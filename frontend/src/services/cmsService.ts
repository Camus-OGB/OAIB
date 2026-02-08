/**
 * Service API — CMS (pages, actualités, FAQ, médias, partenaires, témoignages).
 */
import api from '../lib/apiClient';
import type {
  Page,
  NewsArticle,
  NewsArticleListItem,
  FAQItem,
  MediaItem,
  Partner,
  Testimonial,
  PaginatedResponse,
} from '../shared/types';

// ── Pages ─────────────────────────────────────────────────────
export const listPages = () =>
  api.get<PaginatedResponse<Page>>('/cms/pages/');

export const getPageBySlug = (slug: string) =>
  api.get<Page>(`/cms/pages/${slug}/`, { auth: false });

export const createPage = (data: Partial<Page>) =>
  api.post<Page>('/cms/pages/', data);

export const updatePage = (slug: string, data: Partial<Page>) =>
  api.patch<Page>(`/cms/pages/${slug}/`, data);

export const deletePage = (slug: string) =>
  api.delete(`/cms/pages/${slug}/`);

// ── Actualités ────────────────────────────────────────────────
export const listNews = (params?: string, requireAuth = false) =>
  api.get<PaginatedResponse<NewsArticleListItem>>(`/cms/news/${params ? `?${params}` : ''}`, { auth: requireAuth });

export const getNewsArticle = (id: number) =>
  api.get<NewsArticle>(`/cms/news/${id}/`, { auth: false });

export const createNewsArticle = (data: Partial<NewsArticle>) =>
  api.post<NewsArticle>('/cms/news/', data);

export const updateNewsArticle = (id: number, data: Partial<NewsArticle>) =>
  api.patch<NewsArticle>(`/cms/news/${id}/`, data);

export const deleteNewsArticle = (id: number) =>
  api.delete(`/cms/news/${id}/`);

// ── FAQ ───────────────────────────────────────────────────────
export const listFAQ = (params?: string, requireAuth = false) =>
  api.get<PaginatedResponse<FAQItem>>(`/cms/faq/${params ? `?${params}` : ''}`, { auth: requireAuth });

export const createFAQ = (data: Partial<FAQItem>) =>
  api.post<FAQItem>('/cms/faq/', data);

export const updateFAQ = (id: number, data: Partial<FAQItem>) =>
  api.patch<FAQItem>(`/cms/faq/${id}/`, data);

export const deleteFAQ = (id: number) =>
  api.delete(`/cms/faq/${id}/`);

// ── Médias ────────────────────────────────────────────────────
export const listMedia = (params?: string) =>
  api.get<PaginatedResponse<MediaItem>>(`/cms/media/${params ? `?${params}` : ''}`);

export const uploadMedia = (formData: FormData) =>
  api.upload<MediaItem>('/cms/media/', formData);

export const deleteMedia = (id: number) =>
  api.delete(`/cms/media/${id}/`);

// ── Partenaires ───────────────────────────────────────────────
export const listPartners = (params?: string, requireAuth = false) =>
  api.get<PaginatedResponse<Partner>>(`/cms/partners/${params ? `?${params}` : ''}`, { auth: requireAuth });

export const createPartner = (data: Partial<Partner>) =>
  api.post<Partner>('/cms/partners/', data);

export const updatePartner = (id: number, data: Partial<Partner>) =>
  api.patch<Partner>(`/cms/partners/${id}/`, data);

export const deletePartner = (id: number) =>
  api.delete(`/cms/partners/${id}/`);

// ── Témoignages ───────────────────────────────────────────────
export const listTestimonials = (params?: string, requireAuth = false) =>
  api.get<PaginatedResponse<Testimonial>>(`/cms/testimonials/${params ? `?${params}` : ''}`, { auth: requireAuth });

export const createTestimonial = (data: Partial<Testimonial>) =>
  api.post<Testimonial>('/cms/testimonials/', data);

export const updateTestimonial = (id: number, data: Partial<Testimonial>) =>
  api.patch<Testimonial>(`/cms/testimonials/${id}/`, data);

export const deleteTestimonial = (id: number) =>
  api.delete(`/cms/testimonials/${id}/`);
