// ================================================================
// FILE: src/hooks/cms/useFaqs.js
// ================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveFaqs,
  fetchFaqsForAdmin,
  updateFaqs,
  uploadFaqFormImage,
} from "../../services/cms/faqs";

export const FAQS_QUERY_KEY = "faqs";
export const FAQS_ADMIN_QUERY_KEY = "faqsAdmin";

export function useFaqs() {
  return useQuery({
    queryKey: [FAQS_QUERY_KEY],
    queryFn: fetchActiveFaqs,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useFaqsAdmin() {
  return useQuery({
    queryKey: [FAQS_ADMIN_QUERY_KEY],
    queryFn: fetchFaqsForAdmin,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useUpdateFaqs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFaqs,
    onSuccess: () => {
      // Invalidate and remove both queries to force fresh fetches
      queryClient.invalidateQueries({ queryKey: [FAQS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FAQS_ADMIN_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [FAQS_QUERY_KEY] });
    },
  });
}

export { uploadFaqFormImage };
