import { useEffect } from 'react';

const BASE_TITLE = "Olympiades d'IA du Benin";

export function usePageTitle(subtitle?: string) {
  useEffect(() => {
    document.title = subtitle ? `${subtitle} | ${BASE_TITLE}` : BASE_TITLE;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', subtitle
        ? `${subtitle} - Plateforme officielle des Olympiades d'Intelligence Artificielle du Benin`
        : `Plateforme officielle des Olympiades d'Intelligence Artificielle du Benin`
      );
    }
  }, [subtitle]);
}
