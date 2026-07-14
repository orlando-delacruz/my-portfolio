// src/hooks/cms/useAbout.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveAbout,
  fetchAboutForAdmin,
  updateAbout,
  uploadAboutImage,
} from "../../services/cms/about";

export const ABOUT_QUERY_KEY = "about";
export const ABOUT_ADMIN_QUERY_KEY = "aboutAdmin";

export function useAbout() {
  return useQuery({
    queryKey: [ABOUT_QUERY_KEY],
    queryFn: fetchActiveAbout,
    staleTime: 60 * 1000,
  });
}

export function useAboutAdmin() {
  return useQuery({
    queryKey: [ABOUT_ADMIN_QUERY_KEY],
    queryFn: fetchAboutForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAbout,
    onSuccess: () => {
      queryClient.invalidateQueries([ABOUT_QUERY_KEY]);
      queryClient.invalidateQueries([ABOUT_ADMIN_QUERY_KEY]);
    },
  });
}

export { uploadAboutImage };
