import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 *
 * Features:
 * - Lazy loading by default
 * - Automatic WebP fallback (tries .webp first, falls back to original)
 * - Loading state handling
 *
 * Usage:
 *   <OptimizedImage src="Images/icon.webp" alt="Icon" />
 *
 * The component will automatically try to load "Images/icon.webp" first,
 * and fall back to "Images/icon.webp" if WebP is not available.
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  style,
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [useFallback, setUseFallback] = useState(false);

  // Convert PNG/JPG path to WebP
  const getWebPSrc = (originalSrc: string): string | null => {
    if (originalSrc.match(/\.(png|jpg|jpeg)$/i)) {
      return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    return null;
  };

  const webpSrc = getWebPSrc(src);
  const shouldTryWebP = webpSrc && !useFallback;

  const handleError = () => {
    if (shouldTryWebP) {
      // WebP failed, try original format
      setUseFallback(true);
    } else {
      onError?.();
    }
  };

  // If WebP is available and we haven't fallen back, use picture element
  if (webpSrc && !useFallback) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={width}
          height={height}
          loading={loading}
          onLoad={onLoad}
          onError={handleError}
        />
      </picture>
    );
  }

  // Fallback to regular img
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
