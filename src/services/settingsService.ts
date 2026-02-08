/**
 * Service API — Paramètres de la plateforme.
 */
import api from '../lib/apiClient';
import type { PlatformSettings, PlatformSettingsPublic } from '../shared/types';

/** Paramètres publics (pas d'auth requise) */
export const getPublicSettings = () =>
  api.get<PlatformSettingsPublic>('/settings/public/', { auth: false });

/** Paramètres complets (admin uniquement) */
export const getSettings = () =>
  api.get<PlatformSettings>('/settings/admin/');

/** Mettre à jour les paramètres (admin uniquement) */
export const updateSettings = (data: Partial<PlatformSettings>) =>
  api.patch<PlatformSettings>('/settings/admin/', data);
