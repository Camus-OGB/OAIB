/**
 * Service API — Gestion des examens, éditions, phases, questions.
 */
import api from '../lib/apiClient';
import type {
  Edition,
  Phase,
  QuestionCategory,
  Question,
  Exam,
  ExamDetail,
  ExamSession,
  ExamAnswer,
  PaginatedResponse,
} from '../shared/types';

// ── Éditions ──────────────────────────────────────────────────
export const listEditions = (params?: string) =>
  api.get<PaginatedResponse<Edition>>(`/exams/editions/${params ? `?${params}` : ''}`);

export const listEditionsPublic = (params?: string) =>
  api.get<PaginatedResponse<Edition>>(`/exams/editions/${params ? `?${params}` : ''}`, { auth: false });

export const getEdition = (id: number) =>
  api.get<Edition>(`/exams/editions/${id}/`);

export const createEdition = (data: Partial<Edition>) =>
  api.post<Edition>('/exams/editions/', data);

export const updateEdition = (id: number, data: Partial<Edition>) =>
  api.patch<Edition>(`/exams/editions/${id}/`, data);

export const deleteEdition = (id: number) =>
  api.delete(`/exams/editions/${id}/`);

// ── Phases ────────────────────────────────────────────────────
export const listPhases = (params?: string) =>
  api.get<PaginatedResponse<Phase>>(`/exams/phases/${params ? `?${params}` : ''}`);

export const listPhasesPublic = (params?: string) =>
  api.get<PaginatedResponse<Phase>>(`/exams/phases/${params ? `?${params}` : ''}`, { auth: false });
export const getPhase = (id: number) =>
  api.get<Phase>(`/exams/phases/${id}/`);

export const createPhase = (data: Partial<Phase>) =>
  api.post<Phase>('/exams/phases/', data);

export const updatePhase = (id: number, data: Partial<Phase>) =>
  api.patch<Phase>(`/exams/phases/${id}/`, data);

// ── Catégories de questions ───────────────────────────────────
export const listCategories = () =>
  api.get<PaginatedResponse<QuestionCategory>>('/exams/categories/');

export const createCategory = (data: { name: string }) =>
  api.post<QuestionCategory>('/exams/categories/', data);

export const updateCategory = (id: number, data: { name: string }) =>
  api.patch<QuestionCategory>(`/exams/categories/${id}/`, data);

export const deleteCategory = (id: number) =>
  api.delete(`/exams/categories/${id}/`);

// ── Questions ─────────────────────────────────────────────────
export const listQuestions = (params?: string) =>
  api.get<PaginatedResponse<Question>>(`/exams/questions/${params ? `?${params}` : ''}`);

export const getQuestion = (id: number) =>
  api.get<Question>(`/exams/questions/${id}/`);

export const createQuestion = (data: {
  category: number;
  text: string;
  difficulty: string;
  points: number;
  time_limit_seconds?: number;
  is_active?: boolean;
  options: { text: string; is_correct: boolean; order: number }[];
}) => api.post<Question>('/exams/questions/', data);

export const updateQuestion = (id: number, data: Partial<Question>) =>
  api.patch<Question>(`/exams/questions/${id}/`, data);

export const deleteQuestion = (id: number) =>
  api.delete(`/exams/questions/${id}/`);

// ── Import / Export Questions ─────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const downloadBlob = async (endpoint: string, filename: string) => {
  const token = localStorage.getItem('oaib_access_token');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const exportQuestionsJSON = () =>
  downloadBlob('/exams/questions/export-json/', 'questions_oaib.json');

export const exportQuestionsExcel = () =>
  downloadBlob('/exams/questions/export-excel/', 'questions_oaib.xlsx');

export const importQuestionsJSON = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<{ created: number; errors: { index: number; error: string }[] }>(
    '/exams/questions/import-json/',
    formData,
  );
};

export const importQuestionsExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<{ created: number; errors: { index: number; error: string }[] }>(
    '/exams/questions/import-excel/',
    formData,
  );
};

// ── Examens ───────────────────────────────────────────────────
export const listExams = (params?: string) =>
  api.get<PaginatedResponse<Exam>>(`/exams/exams/${params ? `?${params}` : ''}`);

export const getExam = (id: number) =>
  api.get<ExamDetail>(`/exams/exams/${id}/`);

export const createExam = (data: Partial<Exam>) =>
  api.post<Exam>('/exams/exams/', data);

export const updateExam = (id: number, data: Partial<Exam>) =>
  api.patch<Exam>(`/exams/exams/${id}/`, data);

export const deleteExam = (id: number) =>
  api.delete(`/exams/exams/${id}/`);

// ── Sessions d'examen (étudiant) ──────────────────────────────
export const startExam = (examId: number) =>
  api.post<ExamSession>(`/exams/start/${examId}/`);

export const submitAnswer = (sessionId: number, data: {
  question_id: number;
  option_id: number | null;
  is_flagged?: boolean;
}) => api.post<ExamAnswer>(`/exams/session/${sessionId}/answer/`, data);

export const finishExam = (sessionId: number) =>
  api.post<ExamSession>(`/exams/session/${sessionId}/finish/`);

export const getMyExamSessions = (params?: string) =>
  api.get<PaginatedResponse<ExamSession>>(`/exams/my-sessions/${params ? `?${params}` : ''}`);

// ── Sessions d'examen (admin) ─────────────────────────────────
export const listExamSessions = (params?: string) =>
  api.get<PaginatedResponse<ExamSession>>(`/exams/sessions/admin/${params ? `?${params}` : ''}`);

export const getExamSession = (id: number) =>
  api.get<ExamSession>(`/exams/sessions/admin/${id}/`);
