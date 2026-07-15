// src/hooks/cms/useGallery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveGallery,
  fetchGalleryForAdmin,
  updateGallery,
  uploadGalleryImage,
} from "../../services/cms/gallery";

export const GALLERY_QUERY_KEY = "gallery";
export const GALLERY_ADMIN_QUERY_KEY = "galleryAdmin";

export function useGallery() {
  return useQuery({
    queryKey: [GALLERY_QUERY_KEY],
    queryFn: fetchActiveGallery,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGalleryAdmin() {
  return useQuery({
    queryKey: [GALLERY_ADMIN_QUERY_KEY],
    queryFn: fetchGalleryForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GALLERY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GALLERY_ADMIN_QUERY_KEY] });
    },
  });
}

export { uploadGalleryImage };
