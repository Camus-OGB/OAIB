/**
 * Service API — Gestion des candidatures (profils étudiants côté étudiant + admin).
 */
import api from '../lib/apiClient';
import type {
  CandidateProfile,
  CandidateProfileUpdate,
  TutorInfo,
  CandidateDocument,
  PaginatedResponse,
} from '../shared/types';

// ── Public : compteur d'inscrits (vitrine) ────────────────────
export const getPublicCandidateCount = () =>
  api.get<{ total: number; approved: number }>('/candidates/public/count/', { auth: false });

// ── Étudiant : mon profil candidat ────────────────────────────
export const getMyProfile = () =>
  api.get<CandidateProfile>('/candidates/profile/');

export const updateMyProfile = (data: CandidateProfileUpdate) =>
  api.patch<CandidateProfile>('/candidates/profile/', data);

// ── Étudiant : tuteur ─────────────────────────────────────────
export const getMyTutor = () =>
  api.get<TutorInfo>('/candidates/profile/tutor/');

export const updateMyTutor = (data: Partial<TutorInfo>) =>
  api.put<TutorInfo>('/candidates/profile/tutor/', data);

// ── Étudiant : documents ──────────────────────────────────────
export const getMyDocuments = () =>
  api.get<CandidateDocument[]>('/candidates/profile/documents/');

export const uploadDocument = (formData: FormData) =>
  api.upload<CandidateDocument>('/candidates/profile/documents/', formData);

export const deleteDocument = (id: number) =>
  api.delete(`/candidates/profile/documents/${id}/`);

// ── Admin : gestion des candidats ─────────────────────────────
export const listCandidates = (params?: string) =>
  api.get<PaginatedResponse<CandidateProfile>>(`/candidates/admin/${params ? `?${params}` : ''}`);

export const getCandidate = (id: number) =>
  api.get<CandidateProfile>(`/candidates/admin/${id}/`);

export const approveCandidate = (id: number) =>
  api.post(`/candidates/admin/${id}/approve/`);

export const rejectCandidate = (id: number, comment: string) =>
  api.post(`/candidates/admin/${id}/reject/`, { admin_comment: comment });

export const getCandidateStats = () =>
  api.get<Record<string, number>>('/candidates/admin/stats/');
