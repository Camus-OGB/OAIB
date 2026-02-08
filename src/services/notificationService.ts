/**
 * Service API — Notifications utilisateur.
 */
import api from '../lib/apiClient';
import type { Notification, PaginatedResponse } from '../shared/types';

export const listNotifications = (params?: string) =>
  api.get<PaginatedResponse<Notification>>(`/notifications/${params ? `?${params}` : ''}`);

export const markAsRead = (id: number) =>
  api.post(`/notifications/${id}/mark_read/`);

export const markAllAsRead = () =>
  api.post('/notifications/mark_all_read/');

export const getUnreadCount = () =>
  api.get<{ unread_count: number }>('/notifications/unread_count/');
