// src/hooks/cms/useFooter.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFooter,
  updateFooter,
  uploadFooterLogo,
} from "../../services/cms/footer";

export const FOOTER_QUERY_KEY = "footer";

export function useFooter() {
  return useQuery({
    queryKey: [FOOTER_QUERY_KEY],
    queryFn: fetchFooter,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFooter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOOTER_QUERY_KEY] });
    },
  });
}

export { uploadFooterLogo };
