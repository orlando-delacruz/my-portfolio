// src/hooks/cms/useCta.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCta, updateCta, uploadCtaImage } from "../../services/cms/cta";

export const CTA_QUERY_KEY = "cta";

export function useCta() {
  return useQuery({
    queryKey: [CTA_QUERY_KEY],
    queryFn: fetchCta,
    staleTime: 60 * 1000,
  });
}

export function useUpdateCta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CTA_QUERY_KEY] });
    },
  });
}

export { uploadCtaImage };
