import React from 'react';
import { AnimatedSection } from './AnimatedSection';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export function SectionTitle({ title, subtitle, className = '', center = false }: SectionTitleProps) {
  return (
    <AnimatedSection className={`${center ? 'text-center' : ''} ${className}`}>
      <h2 className="text-2xl md:text-3xl font-black mb-2 text-[#111813] dark:text-white">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{subtitle}</p>
      )}
    </AnimatedSection>
  );
}
