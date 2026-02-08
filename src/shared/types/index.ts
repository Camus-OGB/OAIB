/**
 * Types partagés alignés sur les serializers Django.
 * Ce fichier centralise TOUS les types TS correspondant aux API responses.
 */
import React from 'react';

// ── UI Types (existants) ──────────────────────────────────────
export interface NavItem {
  label: string;
  to: string;
}

export interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

export interface NewsItem {
  category: string;
  color: string;
  title: string;
  desc: string;
  date: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  img: string;
}

// ── API Types (Backend) ───────────────────────────────────────

// ── Pagination ────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Accounts ──────────────────────────────────────────────────
export type UserRole = 'student' | 'admin' | 'moderator';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  birth_date: string | null;
  role: UserRole;
  avatar: string | null;
  is_email_verified: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface AdminUser extends User {
  is_staff: boolean;
  last_login: string | null;
}

export interface UserMinimal {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface AuditLog {
  id: number;
  user: number;
  user_email: string;
  action: string;
  target_model: string;
  target_id: number | null;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

// ── Candidates ────────────────────────────────────────────────
export type CandidateStatus = 'incomplete' | 'pending' | 'approved' | 'rejected';
export type DocumentStatus = 'pending' | 'validated' | 'rejected';
export type DocumentType = 'id_card' | 'birth_certificate' | 'school_certificate' | 'photo' | 'parental_consent' | 'other';

export interface TutorInfo {
  id: number;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface CandidateDocument {
  id: number;
  name: string;
  doc_type: DocumentType;
  file: string;
  file_url?: string; // URL signée pour accéder au fichier
  size_bytes: number;
  status: DocumentStatus;
  uploaded_at: string;
}

export interface CandidateProfile {
  id: number;
  user: number;
  user_email: string;
  user_name?: string; // Peut être undefined si l'utilisateur n'a pas de nom complet
  user_phone?: string;
  birth_date?: string;
  gender: string | null;
  address: string;
  city: string;
  country: string;
  school: string;
  level: string;
  class_name: string;
  average_grade: number | null;
  math_grade: number | null;
  science_grade: number | null;
  region: string;
  status: CandidateStatus;
  profile_completion: number;
  admin_comment: string;
  registered_at: string;
  updated_at: string;
  tutor_info: TutorInfo | null;
  documents: CandidateDocument[];
}

export interface CandidateProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  school?: string;
  level?: string;
  class_name?: string;
  average_grade?: number;
  math_grade?: number;
  science_grade?: number;
  region?: string;
}

// ── Exams ─────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExamStatus = 'draft' | 'published' | 'started' | 'finished';
export type SessionStatus = 'in_progress' | 'completed' | 'timed_out' | 'abandoned';
export type PhaseStatus = 'upcoming' | 'active' | 'completed';

export interface Edition {
  id: number;
  year: number;
  title: string;
  description: string;
  is_active: boolean;
  phases_count: number;
  created_at: string;
}

export interface Phase {
  id: number;
  edition: number;
  edition_title: string;
  phase_number: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: PhaseStatus;
}

export interface QuestionCategory {
  id: number;
  name: string;
  slug: string;
  questions_count: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  is_correct?: boolean;
  order: number;
}

export interface Question {
  id: number;
  category: number;
  category_name: string;
  text: string;
  difficulty: Difficulty;
  points: number;
  time_limit_seconds: number | null;
  usage_count: number;
  is_active: boolean;
  options: QuestionOption[];
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: number;
  phase: number;
  phase_title: string;
  title: string;
  description: string;
  duration_minutes: number;
  questions_count: number;
  passing_score: number;
  randomize_questions: boolean;
  show_correct_answers: boolean;
  start_datetime: string;
  end_datetime: string;
  status: ExamStatus;
  sessions_count: number;
  created_at: string;
}

export interface ExamDetail extends Exam {
  questions: Question[];
}

export interface ExamSession {
  id: number;
  candidate: number;
  exam: number;
  exam_title: string;
  candidate_name: string;
  candidate_email: string;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number;
  tab_switch_count: number;
  status: SessionStatus;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  rank: number | null;
  category_scores: Record<string, unknown> | null;
}

export interface ExamAnswer {
  id: number;
  session: number;
  question: number;
  selected_option: number | null;
  is_correct: boolean;
  is_flagged: boolean;
}

// ── CMS ───────────────────────────────────────────────────────
export type ContentStatus = 'draft' | 'published';

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: ContentStatus;
  last_modified: string;
  created_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  status: ContentStatus;
  author: number;
  published_at: string | null;
  created_at: string;
}

export interface NewsArticleListItem {
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  author: string;
  published_at: string | null;
  status: ContentStatus;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface MediaItem {
  id: number;
  name: string;
  media_type: string;
  file: string;
  size_bytes: number;
  uploaded_at: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string | null;
  website: string;
  tier: string;
  display_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string | null;
  video_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// ── Resources ─────────────────────────────────────────────────
export type ResourceType = 'pdf' | 'video' | 'link' | 'article' | 'exercise';

export interface Resource {
  id: number;
  title: string;
  description: string;
  resource_type: ResourceType;
  url: string;
  file: string | null;
  category: string;
  phase: number | null;
  is_active: boolean;
  created_at: string;
}

// ── Notifications ─────────────────────────────────────────────
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notif_type: NotificationType;
  is_read: boolean;
  created_at: string;
}

// ── Platform Settings ─────────────────────────────────────────
export interface PlatformSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  registration_open: boolean;
  maintenance_mode: boolean;
  max_file_size_mb: number;
  allowed_file_types: string[];
  security_settings: Record<string, unknown>;
  updated_at: string;
}

export interface PlatformSettingsPublic {
  site_name: string;
  site_description: string;
  contact_email: string;
  registration_open: boolean;
  maintenance_mode: boolean;
}
