import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
  priority?: boolean;
  loadingStrategy?: 'lazy' | 'eager';
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component for performance-optimized image loading
 * Features:
 * - Progressive loading with blur-up effect
 * - Lazy loading for images below the fold
 * - Optional priority loading for above-the-fold images
 * - Placeholder during loading
 * - Fallback handling for errors
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  className,
  priority = false,
  loadingStrategy = 'lazy',
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // If priority is true, we should set loading to eager
  const loading = priority ? 'eager' : loadingStrategy;
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleError = () => {
    setIsError(true);
    if (onError) onError();
  };
  
  // Generate a tiny placeholder image with the specified color
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' width='1' height='1'%3E%3Crect width='1' height='1' fill='${placeholderColor.replace('#', '%23')}' /%3E%3C/svg%3E`;
  
  // Style for the image container
  const containerStyle = {
    position: 'relative' as const,
    width: width || '100%',
    height: height || '100%',
    backgroundColor: placeholderColor,
    overflow: 'hidden' as const,
  };
  
  // Style for the image
  const imageStyle = {
    objectFit,
    width: '100%',
    height: '100%',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };
  
  return (
    <div style={containerStyle} className={className}>
      {isError ? (
        <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground text-sm">
          {alt || 'Image not available'}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      
      {/* Show a low-quality placeholder while the image is loading */}
      {!isLoaded && !isError && (
        <img
          src={placeholderImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
    </div>
  );
}