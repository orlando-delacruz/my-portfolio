// src/services/services.js
import { supabase } from "./supabase/supabase";

/**
 * Fetch services for a specific branch (for Service Management)
 * Returns an array of services with full details, sorted alphabetically by name.
 */
export async function fetchServices(branchId) {
  if (!branchId) {
    throw new Error("Branch ID is required");
  }

  // Step 1: Get branch-specific service records from service_branches
  const { data: branchServices, error: branchError } = await supabase
    .from("service_branches")
    .select("id, service_id, price, duration_minutes, status, online_booking_enabled")
    .eq("branch_id", branchId)
    .order("service_id", { ascending: true });

  if (branchError) {
    console.error("Error fetching branch services:", branchError);
    throw new Error(branchError.message || "Failed to fetch branch services");
  }

  if (!branchServices || branchServices.length === 0) {
    return [];
  }

  // Step 2: Collect all unique service_ids
  const serviceIds = branchServices.map((bs) => bs.service_id).filter((id) => id);

  if (serviceIds.length === 0) {
    return [];
  }

  // Step 3: Fetch the corresponding services from the services table, sorted alphabetically
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, description")
    .in("id", serviceIds)
    .order("name", { ascending: true }); // ✅ Alphabetical sort

  if (servicesError) {
    console.error("Error fetching services by IDs:", servicesError);
    throw new Error(servicesError.message || "Failed to fetch service details");
  }

  // Step 4: Build a map of service_id -> service object
  const serviceMap = {};
  services.forEach((svc) => {
    serviceMap[svc.id] = svc;
  });

  // Step 5: Combine the data and sort for safety
  const combined = branchServices.map((bs) => ({
    id: bs.id,
    service_id: bs.service_id,
    name: serviceMap[bs.service_id]?.name || "",
    description: serviceMap[bs.service_id]?.description || "",
    duration_minutes: bs.duration_minutes,
    price: bs.price,
    is_active: bs.status === "active",
    branch_id: branchId,
  }));

  // Sort alphabetically by name (case-insensitive)
  combined.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
      numeric: true,
    })
  );

  return combined;
}

/**
 * Create a new service for a branch.
 * Inserts into services and service_branches.
 */
export async function createService(serviceData) {
  const { branch_id, name, description, duration_minutes, starting_price, maximum_price, is_active } = serviceData;

  if (!branch_id) throw new Error("Branch ID is required");
  if (!name || name.trim() === "") throw new Error("Service name is required");

  // 1. Insert into services
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      default_duration_minutes: duration_minutes,
      starting_price: starting_price,
      maximum_price: maximum_price,
      status: "active",
    })
    .select()
    .single();

  if (serviceError) {
    console.error("Error creating service:", serviceError);
    throw new Error(serviceError.message || "Failed to create service");
  }

  // 2. Insert into service_branches
  const { data: branchService, error: branchError } = await supabase
    .from("service_branches")
    .insert({
      service_id: service.id,
      branch_id,
      price: starting_price,
      duration_minutes,
      status: is_active ? "active" : "inactive",
      online_booking_enabled: true,
    })
    .select()
    .single();

  if (branchError) {
    await supabase.from("services").delete().eq("id", service.id);
    console.error("Error creating branch service:", branchError);
    throw new Error(branchError.message || "Failed to link service to branch");
  }

  return {
    id: branchService.id,
    service_id: service.id,
    name: service.name,
    description: service.description,
    duration_minutes: branchService.duration_minutes,
    starting_price: service.starting_price,
    maximum_price: service.maximum_price,
    is_active: branchService.status === "active",
    branch_id,
  };
}

/**
 * Update an existing branch service
 */
export async function updateService(serviceId, updates) {
  if (!serviceId) throw new Error("Service ID is required");

  const { name, description, duration_minutes, starting_price, maximum_price, is_active } = updates;

  // 1. Get the service_branches record to find the associated service_id
  const { data: existing, error: fetchError } = await supabase
    .from("service_branches")
    .select("service_id")
    .eq("id", serviceId)
    .single();

  if (fetchError) {
    console.error("Error fetching branch service:", fetchError);
    throw new Error(fetchError.message || "Service not found");
  }

  // 2. Update the services table (name, description, prices)
  if (name || description || starting_price !== undefined || maximum_price !== undefined) {
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (starting_price !== undefined) updateData.starting_price = starting_price;
    if (maximum_price !== undefined) updateData.maximum_price = maximum_price;
    updateData.updated_at = new Date().toISOString();

    const { error: updateServiceError } = await supabase
      .from("services")
      .update(updateData)
      .eq("id", existing.service_id);

    if (updateServiceError) {
      console.error("Error updating service:", updateServiceError);
      throw new Error(updateServiceError.message || "Failed to update service details");
    }
  }

  // 3. Update the service_branches table (duration, status)
  const { data: updated, error: updateBranchError } = await supabase
    .from("service_branches")
    .update({
      duration_minutes: duration_minutes !== undefined ? duration_minutes : null,
      status: is_active !== undefined ? (is_active ? "active" : "inactive") : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId)
    .select()
    .single();

  if (updateBranchError) {
    console.error("Error updating branch service:", updateBranchError);
    throw new Error(updateBranchError.message || "Failed to update branch service");
  }

  // 4. Fetch the updated service data
  const { data: serviceData, error: serviceFetchError } = await supabase
    .from("services")
    .select("id, name, description, starting_price, maximum_price")
    .eq("id", existing.service_id)
    .single();

  if (serviceFetchError) {
    console.warn("Could not fetch updated service:", serviceFetchError);
  }

  return {
    id: updated.id,
    service_id: existing.service_id,
    name: serviceData?.name || "",
    description: serviceData?.description || "",
    duration_minutes: updated.duration_minutes,
    starting_price: serviceData?.starting_price || 0,
    maximum_price: serviceData?.maximum_price || 0,
    is_active: updated.status === "active",
  };
}

/**
 * Delete a branch service
 */
export async function deleteService(serviceId) {
  if (!serviceId) throw new Error("Service ID is required");

  const { data: branchService, error: fetchError } = await supabase
    .from("service_branches")
    .select("service_id")
    .eq("id", serviceId)
    .single();

  if (fetchError) {
    console.error("Error fetching branch service:", fetchError);
    throw new Error(fetchError.message || "Service not found");
  }

  const { error: deleteBranchError } = await supabase
    .from("service_branches")
    .delete()
    .eq("id", serviceId);

  if (deleteBranchError) {
    console.error("Error deleting branch service:", deleteBranchError);
    throw new Error(deleteBranchError.message || "Failed to delete branch service");
  }

  // Check if any other branches still use this service
  const { count, error: countError } = await supabase
    .from("service_branches")
    .select("id", { count: "exact", head: true })
    .eq("service_id", branchService.service_id);

  if (countError) {
    console.warn("Could not check other branches:", countError);
    return;
  }

  if (count === 0) {
    const { error: deleteServiceError } = await supabase
      .from("services")
      .delete()
      .eq("id", branchService.service_id);

    if (deleteServiceError) {
      console.warn("Could not delete service (may be referenced elsewhere):", deleteServiceError);
    }
  }
}