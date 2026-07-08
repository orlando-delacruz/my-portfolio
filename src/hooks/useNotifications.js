// src/hooks/useNotifications.js
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../services/supabase/supabase';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
} from '../services/notificationService';
import { useAuthStore } from '../store/authStore';

export function useNotifications() {
  const queryClient = useQueryClient();
  const profile = useAuthStore((state) => state.profile);
  const adminId = profile?.id;

  // Query: fetch all notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', adminId],
    queryFn: () => fetchNotifications(adminId),
    enabled: !!adminId,
    staleTime: 30 * 1000,
  });

  // Query: unread count
  const {
    data: unreadCount = 0,
    refetch: refetchUnread,
  } = useQuery({
    queryKey: ['notifications', 'unread', adminId],
    queryFn: () => getUnreadCount(adminId),
    enabled: !!adminId,
    staleTime: 15 * 1000,
  });

  // ── Mutations ──
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', adminId]);
      queryClient.invalidateQueries(['notifications', 'unread', adminId]);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', adminId]);
      queryClient.invalidateQueries(['notifications', 'unread', adminId]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', adminId]);
      queryClient.invalidateQueries(['notifications', 'unread', adminId]);
    },
  });

  // ── Realtime subscription ──
  useEffect(() => {
    if (!adminId) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `admin_id=eq.${adminId}`,
        },
        () => {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries(['notifications', adminId]);
          queryClient.invalidateQueries(['notifications', 'unread', adminId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminId, queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    refetchUnread,
    markAsRead: markReadMutation.mutateAsync,
    markAllAsRead: markAllReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
  };
}