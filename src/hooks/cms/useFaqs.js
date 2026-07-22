// src/hooks/cms/useFaqs.js
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
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useFaqsAdmin() {
  return useQuery({
    queryKey: [FAQS_ADMIN_QUERY_KEY],
    queryFn: fetchFaqsForAdmin,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useUpdateFaqs() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateFaqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAQS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FAQS_ADMIN_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [FAQS_QUERY_KEY] });
    },
  });
  return mutation;
}

export { uploadFaqFormImage };
