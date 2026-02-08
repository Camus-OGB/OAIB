/**
 * Service API — Ressources pédagogiques.
 */
import api from '../lib/apiClient';
import type { Resource, PaginatedResponse } from '../shared/types';

export const listResources = (params?: string) =>
  api.get<PaginatedResponse<Resource>>(`/resources/${params ? `?${params}` : ''}`);

export const getResource = (id: number) =>
  api.get<Resource>(`/resources/${id}/`);

export const createResource = (data: Partial<Resource>) =>
  api.post<Resource>('/resources/', data);

export const updateResource = (id: number, data: Partial<Resource>) =>
  api.patch<Resource>(`/resources/${id}/`, data);

export const deleteResource = (id: number) =>
  api.delete(`/resources/${id}/`);
