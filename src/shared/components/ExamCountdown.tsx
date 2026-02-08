import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface ExamCountdownProps {
  startDateTime: string; // ISO date string
  endDateTime?: string; // ISO date string (optionnel)
  onStart?: () => void; // Callback quand le compte à rebours atteint 0
  onEnd?: () => void; // Callback quand l'examen se termine
  variant?: 'compact' | 'full'; // Affichage compact ou complet
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // millisecondes restantes
}

const calculateTimeLeft = (targetDate: string): TimeLeft => {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
};

const ExamCountdown: React.FC<ExamCountdownProps> = ({
  startDateTime,
  endDateTime,
  onStart,
  onEnd,
  variant = 'full',
}) => {
  const now = new Date().getTime();
  const start = new Date(startDateTime).getTime();
  const end = endDateTime ? new Date(endDateTime).getTime() : null;

  // Déterminer quelle phase nous sommes
  const isBeforeStart = now < start;
  const isActive = now >= start && (!end || now < end);
  const isEnded = end && now >= end;

  const targetDate = isBeforeStart ? startDateTime : (endDateTime || startDateTime);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [hasStarted, setHasStarted] = useState(!isBeforeStart);
  const [hasEnded, setHasEnded] = useState(!!isEnded);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      // Détection du démarrage
      if (isBeforeStart && newTimeLeft.total <= 0 && !hasStarted) {
        setHasStarted(true);
        onStart?.();
      }

      // Détection de la fin
      if (!isBeforeStart && endDateTime && newTimeLeft.total <= 0 && !hasEnded) {
        setHasEnded(true);
        onEnd?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, hasStarted, hasEnded, isBeforeStart, endDateTime, onStart, onEnd]);

  // Si l'examen est terminé
  if (hasEnded || isEnded) {
    return (
      <div className="inline-flex items-center gap-2 text-gray-500">
        <Calendar size={16} />
        <span className="text-sm">Examen terminé</span>
      </div>
    );
  }

  // Affichage compact (une seule ligne)
  if (variant === 'compact') {
    const label = isBeforeStart ? 'Commence dans' : 'Se termine dans';

    return (
      <div className="inline-flex items-center gap-2 text-benin-yellow">
        <Clock size={16} />
        <span className="text-sm font-medium">
          {label} : {timeLeft.days > 0 && `${timeLeft.days}j `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Affichage complet (avec boxes)
  const label = isBeforeStart ? 'Commence dans' : 'Se termine dans';
  const colorClass = isBeforeStart
    ? 'bg-blue-500/10 text-blue-600 border-blue-200'
    : 'bg-red-500/10 text-red-600 border-red-200';

  return (
    <div className={`inline-flex flex-col gap-3 p-4 rounded-xl border ${colorClass}`}>
      <div className="flex items-center gap-2">
        <Clock size={18} />
        <span className="font-bold text-sm">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center min-w-[50px]">
            <div className="text-2xl font-black tabular-nums">{timeLeft.days}</div>
            <div className="text-xs opacity-70">jour{timeLeft.days > 1 ? 's' : ''}</div>
          </div>
        )}

        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-2xl font-black tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-70">heures</div>
        </div>

        <div className="text-2xl font-black opacity-50">:</div>

        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-2xl font-black tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-70">min</div>
        </div>

        <div className="text-2xl font-black opacity-50">:</div>

        <div className="flex flex-col items-center min-w-[50px]">
          <div className="text-2xl font-black tabular-nums">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-70">sec</div>
        </div>
      </div>
    </div>
  );
};

export default ExamCountdown;
