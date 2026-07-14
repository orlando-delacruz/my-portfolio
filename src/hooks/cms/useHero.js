// src/hooks/cms/useHero.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveHero,
  fetchHeroForAdmin,
  updateHero,
  uploadCmsImage,
} from "../../services/cms/hero";

export const HERO_QUERY_KEY = "hero";
export const HERO_ADMIN_QUERY_KEY = "heroAdmin";

export function useHero() {
  return useQuery({
    queryKey: [HERO_QUERY_KEY],
    queryFn: fetchActiveHero,
    staleTime: 60 * 1000,
  });
}

export function useHeroAdmin() {
  return useQuery({
    queryKey: [HERO_ADMIN_QUERY_KEY],
    queryFn: fetchHeroForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHero,
    onSuccess: () => {
      queryClient.invalidateQueries([HERO_QUERY_KEY]);
      queryClient.invalidateQueries([HERO_ADMIN_QUERY_KEY]);
    },
  });
}

export { uploadCmsImage as uploadHeroImage };
