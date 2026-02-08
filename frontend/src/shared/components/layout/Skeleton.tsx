import React from 'react';

export function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 p-6 space-y-4" aria-hidden="true">
      <div className="skeleton h-48 rounded-xl" />
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 space-y-8" aria-label="Chargement en cours">
      <div className="skeleton h-12 w-2/3 rounded-lg" />
      <div className="skeleton h-6 w-1/2 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
