// src/services/cms/services.js
import { supabase } from '../supabase/supabase';

const TABLE = 'cms_services';
const BRIDGE_TABLE = 'cms_service_branches';

/**
 * Fetch all CMS services (admin view) with branch details
 */
export async function fetchCmsServices() {
  const { data: services, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;

  // Fetch branch associations with branch names
  const serviceIds = services.map(s => s.id);
  let branchMap = {};
  if (serviceIds.length > 0) {
    const { data: bridge, error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .select('cms_service_id, branch:branch_id(id, name)')
      .in('cms_service_id', serviceIds);
    if (!bridgeError) {
      bridge.forEach(item => {
        if (!branchMap[item.cms_service_id]) branchMap[item.cms_service_id] = [];
        branchMap[item.cms_service_id].push(item.branch);
      });
    }
  }

  return services.map(s => ({
    ...s,
    branches: branchMap[s.id] || [],
    branch_ids: (branchMap[s.id] || []).map(b => b.id),
  }));
}

/**
 * Fetch active services for the public homepage (with branch details)
 */
export async function fetchActiveCmsServicesForHomepage() {
  const { data: services, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('show_on_homepage', true)
    .order('display_order', { ascending: true });
  if (error) throw error;

  const serviceIds = services.map(s => s.id);
  let branchMap = {};
  if (serviceIds.length > 0) {
    const { data: bridge, error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .select('cms_service_id, branch:branch_id(id, name)')
      .in('cms_service_id', serviceIds);
    if (!bridgeError) {
      bridge.forEach(item => {
        if (!branchMap[item.cms_service_id]) branchMap[item.cms_service_id] = [];
        branchMap[item.cms_service_id].push(item.branch);
      });
    }
  }

  return services.map(s => ({
    ...s,
    branches: branchMap[s.id] || [],
    branch_ids: (branchMap[s.id] || []).map(b => b.id),
  }));
}

/**
 * Create a new CMS service with branch associations
 */
export async function createCmsService(payload) {
  const { branch_ids, ...serviceData } = payload;

  // Insert service
  const { data: createdService, error: serviceError } = await supabase
    .from(TABLE)
    .insert([serviceData])
    .select()
    .single();
  if (serviceError) throw serviceError;

  // Insert branch associations
  if (branch_ids && branch_ids.length > 0) {
    const bridgeData = branch_ids.map(branch_id => ({
      cms_service_id: createdService.id,
      branch_id,
    }));
    const { error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .insert(bridgeData);
    if (bridgeError) {
      // Rollback: delete the service
      await supabase.from(TABLE).delete().eq('id', createdService.id);
      throw bridgeError;
    }
  }

  // Fetch the service with branches to return full object
  const allServices = await fetchCmsServices();
  return allServices.find(s => s.id === createdService.id);
}

/**
 * Update an existing CMS service with branch associations
 */
export async function updateCmsService(id, payload) {
  const { branch_ids, ...serviceData } = payload;

  // Update service (we don't need the returned data, just check for error)
  const { error: serviceError } = await supabase
    .from(TABLE)
    .update(serviceData)
    .eq('id', id);
  if (serviceError) throw serviceError;

  // Replace branch associations
  const { error: deleteError } = await supabase
    .from(BRIDGE_TABLE)
    .delete()
    .eq('cms_service_id', id);
  if (deleteError) throw deleteError;

  if (branch_ids && branch_ids.length > 0) {
    const bridgeData = branch_ids.map(branch_id => ({
      cms_service_id: id,
      branch_id,
    }));
    const { error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .insert(bridgeData);
    if (bridgeError) throw bridgeError;
  }

  // Fetch the updated service with branches
  const allServices = await fetchCmsServices();
  return allServices.find(s => s.id === id);
}

/**
 * Delete a CMS service (cascade will remove bridge rows)
 */
export async function deleteCmsService(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/**
 * Upload an image to Supabase Storage for CMS use
 */
export async function uploadCmsImage(file) {
  if (!file) throw new Error('No file provided');
  if (!(file instanceof File)) {
    throw new Error('Invalid file object. Expected a File instance.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `cms/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cms')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload image. Please try again.');
  }

  const { data: urlData } = supabase.storage
    .from('cms')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}