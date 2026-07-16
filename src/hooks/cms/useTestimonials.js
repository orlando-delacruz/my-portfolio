// src/hooks/cms/useTestimonials.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveTestimonials,
  fetchTestimonialsForAdmin,
  updateTestimonials,
} from "../../services/cms/testimonials";

export const TESTIMONIALS_QUERY_KEY = "testimonials";
export const TESTIMONIALS_ADMIN_QUERY_KEY = "testimonialsAdmin";

export function useTestimonials() {
  return useQuery({
    queryKey: [TESTIMONIALS_QUERY_KEY],
    queryFn: fetchActiveTestimonials,
    staleTime: 60 * 1000,
  });
}

export function useTestimonialsAdmin() {
  return useQuery({
    queryKey: [TESTIMONIALS_ADMIN_QUERY_KEY],
    queryFn: fetchTestimonialsForAdmin,
    staleTime: 60 * 1000,
  });
}

export function useUpdateTestimonials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTestimonials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTIMONIALS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [TESTIMONIALS_ADMIN_QUERY_KEY],
      });
    },
  });
}
