// src/services/services.js
import { supabase } from "./supabase/supabase";

export async function fetchServices(branchId) {
  if (!branchId) throw new Error("Branch ID is required");

  const { data: branchServices, error: branchError } = await supabase
    .from("service_branches")
    .select("id, service_id, price, duration_minutes, status, online_booking_enabled")
    .eq("branch_id", branchId)
    .order("service_id", { ascending: true });

  if (branchError) throw branchError;
  if (!branchServices || branchServices.length === 0) return [];

  const serviceIds = branchServices.map((bs) => bs.service_id).filter((id) => id);
  if (serviceIds.length === 0) return [];

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, description")
    .in("id", serviceIds);

  if (servicesError) throw servicesError;

  const serviceMap = {};
  services.forEach((s) => { serviceMap[s.id] = s; });

  return branchServices.map((bs) => ({
    id: bs.id,
    service_id: bs.service_id,
    name: serviceMap[bs.service_id]?.name || "",
    description: serviceMap[bs.service_id]?.description || "",
    duration_minutes: bs.duration_minutes,
    price: bs.price,
    is_active: bs.status === "active",
    branch_id: branchId,
  }));
}

export async function createService(serviceData) {
  const { branch_id, name, description, duration_minutes, price, is_active } = serviceData;
  if (!branch_id) throw new Error("Branch ID is required");
  if (!name || name.trim() === "") throw new Error("Service name is required");

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      default_duration_minutes: duration_minutes,
      default_price: price,
      status: "active",
    })
    .select()
    .single();
  if (serviceError) throw serviceError;

  const { data: branchService, error: branchError } = await supabase
    .from("service_branches")
    .insert({
      service_id: service.id,
      branch_id,
      price,
      duration_minutes,
      status: is_active ? "active" : "inactive",
      online_booking_enabled: true,
    })
    .select()
    .single();
  if (branchError) {
    await supabase.from("services").delete().eq("id", service.id);
    throw branchError;
  }

  return {
    id: branchService.id,
    service_id: service.id,
    name: service.name,
    description: service.description,
    duration_minutes: branchService.duration_minutes,
    price: branchService.price,
    is_active: branchService.status === "active",
    branch_id,
  };
}

export async function updateService(serviceId, updates) {
  if (!serviceId) throw new Error("Service ID is required");
  const { name, description, duration_minutes, price, is_active } = updates;

  const { data: existing, error: fetchError } = await supabase
    .from("service_branches")
    .select("service_id")
    .eq("id", serviceId)
    .single();
  if (fetchError) throw fetchError;

  if (name || description) {
    const { error: updateServiceError } = await supabase
      .from("services")
      .update({
        name: name?.trim(),
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.service_id);
    if (updateServiceError) throw updateServiceError;
  }

  const { data: updated, error: updateBranchError } = await supabase
    .from("service_branches")
    .update({
      duration_minutes: duration_minutes !== undefined ? duration_minutes : null,
      price: price !== undefined ? price : null,
      status: is_active !== undefined ? (is_active ? "active" : "inactive") : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId)
    .select()
    .single();
  if (updateBranchError) throw updateBranchError;

  const { data: serviceData, error: serviceFetchError } = await supabase
    .from("services")
    .select("id, name, description")
    .eq("id", existing.service_id)
    .single();
  if (serviceFetchError) console.warn("Could not fetch updated service");

  return {
    id: updated.id,
    service_id: existing.service_id,
    name: serviceData?.name || "",
    description: serviceData?.description || "",
    duration_minutes: updated.duration_minutes,
    price: updated.price,
    is_active: updated.status === "active",
  };
}

export async function deleteService(serviceId) {
  if (!serviceId) throw new Error("Service ID is required");

  const { data: branchService, error: fetchError } = await supabase
    .from("service_branches")
    .select("service_id")
    .eq("id", serviceId)
    .single();
  if (fetchError) throw fetchError;

  const { error: deleteBranchError } = await supabase
    .from("service_branches")
    .delete()
    .eq("id", serviceId);
  if (deleteBranchError) throw deleteBranchError;

  const { count, error: countError } = await supabase
    .from("service_branches")
    .select("id", { count: "exact", head: true })
    .eq("service_id", branchService.service_id);
  if (countError) console.warn("Could not check other branches");

  if (count === 0) {
    const { error: deleteServiceError } = await supabase
      .from("services")
      .delete()
      .eq("id", branchService.service_id);
    if (deleteServiceError) console.warn("Could not delete service");
  }
}