import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({ src, alt, className = '', width, height }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Generate srcset for Unsplash images
  const srcSet = src.includes('unsplash.com')
    ? [400, 800, 1200].map(w => {
        const url = src.replace(/w=\d+/, `w=${w}`);
        return `${url} ${w}w`;
      }).join(', ')
    : undefined;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
