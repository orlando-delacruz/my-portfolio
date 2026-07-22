// src/hooks/cms/useCmsServices.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCmsServices,
  fetchActiveCmsServicesForHomepage,
  createCmsService,
  updateCmsService,
  deleteCmsService,
  uploadCmsImage,
  fetchServicesSection,
  updateServicesSection,
} from "../../services/cms/services";

export const CMS_SERVICES_QUERY_KEY = "cmsServices";
export const CMS_SERVICES_HOMEPAGE_KEY = "cmsServicesHomepage";
export const SERVICES_SECTION_QUERY_KEY = "servicesSection";

// ── Service items ──
export function useCmsServices() {
  return useQuery({
    queryKey: [CMS_SERVICES_QUERY_KEY],
    queryFn: fetchCmsServices,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useCmsServicesHomepage() {
  return useQuery({
    queryKey: [CMS_SERVICES_HOMEPAGE_KEY],
    queryFn: fetchActiveCmsServicesForHomepage,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useCreateCmsService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCmsService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_HOMEPAGE_KEY] });
    },
  });
}

export function useUpdateCmsService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCmsService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_HOMEPAGE_KEY] });
    },
  });
}

export function useDeleteCmsService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCmsService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CMS_SERVICES_HOMEPAGE_KEY] });
    },
  });
}

export function useUploadCmsImage() {
  return useMutation({
    mutationFn: uploadCmsImage,
  });
}

// ── Services section metadata (singleton) ──
export function useServicesSection() {
  return useQuery({
    queryKey: [SERVICES_SECTION_QUERY_KEY],
    queryFn: fetchServicesSection,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useServicesSectionAdmin() {
  return useServicesSection(); // same query for admin and public
}

export function useUpdateServicesSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServicesSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_SECTION_QUERY_KEY] });
    },
  });
}
