/**
 * Helpers pour gérer les dates avec le format Django (DD/MM/YYYY HH:MM)
 */

/**
 * Parse une date au format DD/MM/YYYY ou DD/MM/YYYY HH:MM (format Django)
 * @param dateStr - Date au format Django
 * @returns Date object ou null si invalide
 */
export const parseDjangoDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;

  // Format: DD/MM/YYYY HH:MM ou DD/MM/YYYY
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);

  if (match) {
    const [, day, month, year, hours = '00', minutes = '00'] = match;
    // Mois en JS commence à 0
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  }

  // Fallback: essayer de parser en ISO
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Formate une date en français
 * @param date - Date object ou string
 * @param options - Options de formatage Intl.DateTimeFormat
 */
export const formatDate = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseDjangoDate(date) : date;
  if (!dateObj || isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString('fr-FR', options);
};

/**
 * Formate une date avec heure
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Retourne un objet Date valide ou la date de fallback
 */
export const getValidDate = (date: string | null | undefined, fallback: Date): Date => {
  const parsed = parseDjangoDate(date);
  return parsed || fallback;
};
