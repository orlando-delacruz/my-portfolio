// src/services/serviceBranches.js
import { supabase } from "./supabase/supabase";

/**
 * Fetch active services for a specific branch.
 * Returns an array of objects with service_branch_id, name, price, duration_minutes.
 */
export async function fetchServicesForBranch(branchId) {
  if (!branchId) {
    return [];
  }

  // Step 1: Get branch-specific service records from service_branches
  const { data: branchServices, error: branchError } = await supabase
    .from("service_branches")
    .select("id, service_id, price, duration_minutes, status, online_booking_enabled")
    .eq("branch_id", branchId)
    .eq("status", "active")
    .eq("online_booking_enabled", true)
    .order("service_id", { ascending: true });

  if (branchError) {
    console.error("fetchServicesForBranch error:", branchError);
    throw branchError;
  }

  if (!branchServices || branchServices.length === 0) {
    return [];
  }

  // Step 2: Collect all unique service_ids
  const serviceIds = branchServices
    .map((bs) => bs.service_id)
    .filter((id) => id);

  if (serviceIds.length === 0) {
    return [];
  }

  // Step 3: Fetch service names from the services table
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name")
    .in("id", serviceIds);

  if (servicesError) {
    // If RLS blocks the query, fallback to a hardcoded map (optional)
    // Uncomment the fallback map below if needed
    // return branchServices.map((bs) => ({
    //   service_branch_id: bs.id,
    //   name: SERVICE_NAMES[bs.service_id] || "",
    //   price: bs.price,
    //   duration_minutes: bs.duration_minutes,
    // }));
    console.error("fetchServicesForBranch services query error:", servicesError);
    throw servicesError;
  }

  // Build a map of service_id -> service name
  const serviceMap = {};
  services.forEach((svc) => {
    serviceMap[svc.id] = svc.name;
  });

  // Step 4: Combine the data
  return branchServices.map((bs) => ({
    service_branch_id: bs.id,
    name: serviceMap[bs.service_id] || "",
    price: bs.price,
    duration_minutes: bs.duration_minutes,
  }));
}

/**
 * Fetch a single service branch by its ID.
 */
export async function fetchServiceBranchById(id) {
  if (!id) throw new Error("Service branch ID is required");

  const { data: branchService, error: branchError } = await supabase
    .from("service_branches")
    .select("id, branch_id, service_id, price, duration_minutes")
    .eq("id", id)
    .single();

  if (branchError) {
    console.error("fetchServiceBranchById error:", branchError);
    throw branchError;
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("name")
    .eq("id", branchService.service_id)
    .single();

  if (serviceError && serviceError.code !== "PGRST116") {
    console.warn("fetchServiceBranchById: service not found:", branchService.service_id);
  }

  return {
    service_branch_id: branchService.id,
    branch_id: branchService.branch_id,
    name: service?.name || "",
    price: branchService.price,
    duration_minutes: branchService.duration_minutes,
  };
}