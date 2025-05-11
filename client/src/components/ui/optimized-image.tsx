import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, getDeviceAppropriateImageSize, generateSrcSet } from '@/lib/image-optimization';
import { Loading } from './loading';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholder?: boolean;
  quality?: number;
  onLoad?: () => void;
  lazyLoad?: boolean;   // For backward compatibility
  blurEffect?: boolean; // For backward compatibility
}

/**
 * A component that automatically optimizes images
 * - Lazy loads images by default
 * - Provides appropriate srcset for responsive images
 * - Shows loading state while image is loading
 * - Handles errors gracefully
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  placeholder = true,
  quality = 80,
  onLoad
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  // Determine appropriate image size based on device
  const appropriateWidth = width || getDeviceAppropriateImageSize();
  
  // Generate optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, { 
    width: appropriateWidth, 
    quality 
  });
  
  // Generate srcset for responsive images
  const srcSet = generateSrcSet(src);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  // Set loading to false if image is cached
  useEffect(() => {
    const img = new Image();
    img.src = optimizedSrc;
    
    if (img.complete) {
      setIsLoading(false);
    }
  }, [optimizedSrc]);

  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  return (
    <div className={`relative ${className}`}>
      {isLoading && placeholder && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <Loading size="sm" />
        </div>
      )}
      
      {isError ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-400">Image not available</span>
        </div>
      ) : (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          alt={alt}
          className={`${objectFitClass} w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default OptimizedImage;