import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, generateSrcSet, getDeviceAppropriateImageSize } from '@/lib/image-optimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  lazyLoad?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  blurEffect?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * A React component that renders optimized images with support for:
 * - Lazy loading
 * - Responsive sizing
 * - Blur-up loading effect
 * - WebP format when supported
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  lazyLoad = true,
  objectFit = 'cover',
  quality = 80,
  blurEffect = true,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(800);
  
  useEffect(() => {
    setDeviceWidth(getDeviceAppropriateImageSize());
    
    const handleResize = () => {
      setDeviceWidth(getDeviceAppropriateImageSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate the optimized URL based on device width and quality
  const optimizedSrc = getOptimizedImageUrl(src, { 
    width: width || deviceWidth, 
    quality,
    format: 'webp'
  });
  
  // Generate srcSet for responsive images
  const srcSet = generateSrcSet(src);
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      {/* Low quality placeholder image that shows immediately while main image loads */}
      {blurEffect && !isLoaded && (
        <img
          src={getOptimizedImageUrl(src, { width: 20, quality: 20 })}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Main optimized image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={lazyLoad ? 'lazy' : 'eager'}
        className={`w-full h-full transition-opacity duration-500 ${
          objectFit === 'cover' ? 'object-cover' :
          objectFit === 'contain' ? 'object-contain' :
          objectFit === 'fill' ? 'object-fill' :
          objectFit === 'none' ? 'object-none' :
          'object-scale-down'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default OptimizedImage;