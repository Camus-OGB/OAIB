/**
 * Service API — Gestion des utilisateurs (admin).
 */
import api from '../lib/apiClient';
import type { AdminUser, AuditLog, PaginatedResponse } from '../shared/types';

// ── Utilisateurs ──────────────────────────────────────────────
export const listUsers = (params?: string) =>
  api.get<PaginatedResponse<AdminUser>>(`/auth/users/${params ? `?${params}` : ''}`);

export const getUser = (id: number) =>
  api.get<AdminUser>(`/auth/users/${id}/`);

export const createUser = (data: { email: string; first_name: string; last_name: string; password: string; role: string }) =>
  api.post<AdminUser>('/auth/users/', data);

export const updateUser = (id: number, data: Partial<AdminUser>) =>
  api.patch<AdminUser>(`/auth/users/${id}/`, data);

export const deleteUser = (id: number) =>
  api.delete(`/auth/users/${id}/`);

// ── Logs d'audit ──────────────────────────────────────────────
export const listAuditLogs = (params?: string) =>
  api.get<PaginatedResponse<AuditLog>>(`/auth/audit-logs/${params ? `?${params}` : ''}`);
