// src/hooks/cms/useBranches.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveBranchesSection,
  fetchBranchesSectionForAdmin,
  updateBranchesSection,
} from "../../services/cms/branches";

export const BRANCHES_QUERY_KEY = "branches";
export const BRANCHES_ADMIN_QUERY_KEY = "branchesAdmin";

export function useBranchesSection() {
  return useQuery({
    queryKey: [BRANCHES_QUERY_KEY],
    queryFn: fetchActiveBranchesSection,
    staleTime: 60 * 1000,
  });
}

export function useBranchesAdmin() {
  return useQuery({
    queryKey: [BRANCHES_ADMIN_QUERY_KEY],
    queryFn: fetchBranchesSectionForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateBranchesSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranchesSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANCHES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BRANCHES_ADMIN_QUERY_KEY] });
    },
  });
}
