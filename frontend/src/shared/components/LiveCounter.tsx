import React, { useState, useEffect, useRef } from 'react';
import { getPublicCandidateCount } from '../../services/candidateService';

/**
 * Live counter — affiche le nombre réel de candidats inscrits depuis la BDD.
 * Rafraîchit toutes les 60 secondes pour refléter les nouvelles inscriptions.
 */
const LiveCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const fetched = useRef(false);

  const fetchCount = () => {
    getPublicCandidateCount()
      .then(r => setCount(r.data?.total ?? 0))
      .catch(() => {});
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchCount();
    // Rafraîchir toutes les 60s pour capter les nouvelles inscriptions
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return <span className="tabular-nums">—</span>;

  const formatted = count.toLocaleString('fr-FR');

  return (
    <span className="tabular-nums transition-all duration-500">
      {formatted}
    </span>
  );
};

export default LiveCounter;
