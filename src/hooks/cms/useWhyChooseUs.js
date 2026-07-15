// src/hooks/cms/useWhyChooseUs.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveWhyChooseUs,
  fetchWhyChooseUsForAdmin,
  updateWhyChooseUs,
} from "../../services/cms/whyChooseUs";

export const WHY_CHOOSE_US_QUERY_KEY = "whyChooseUs";
export const WHY_CHOOSE_US_ADMIN_QUERY_KEY = "whyChooseUsAdmin";

export function useWhyChooseUs() {
  return useQuery({
    queryKey: [WHY_CHOOSE_US_QUERY_KEY],
    queryFn: fetchActiveWhyChooseUs,
    staleTime: 60 * 1000,
  });
}

export function useWhyChooseUsAdmin() {
  return useQuery({
    queryKey: [WHY_CHOOSE_US_ADMIN_QUERY_KEY],
    queryFn: fetchWhyChooseUsForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateWhyChooseUs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWhyChooseUs,
    onSuccess: () => {
      queryClient.invalidateQueries([WHY_CHOOSE_US_QUERY_KEY]);
      queryClient.invalidateQueries([WHY_CHOOSE_US_ADMIN_QUERY_KEY]);
    },
  });
}
