/**
 * Image optimization utilities
 * Provides functions for optimizing images in the application
 */

interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Returns an optimized version of the image URL
 * If using a CDN, this would transform the URL to use CDN optimization features
 */
export function getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}) {
  // Set defaults
  const width = options.width || 800;
  const quality = options.quality || 80;
  const format = options.format || 'webp';
  
  // If URL is already using an image service like Cloudinary, Imgix, etc.
  if (url.includes('cloudinary.com')) {
    // Apply Cloudinary transformations
    return url
      .replace('/upload/', `/upload/q_${quality},w_${width},f_${format}/`);
  }
  
  // If URL is from Unsplash
  if (url.includes('unsplash.com')) {
    // Apply Unsplash parameters
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&fm=${format}&fit=crop`;
  }

  // If URL is from Pixabay 
  if (url.includes('pixabay.com/get/')) {
    // Return the URL as is since we can't optimize Pixabay URLs easily
    return url;
  }
  
  // For other image URLs, return as is
  return url;
}

/**
 * Returns the appropriate image size based on the device viewport
 */
export function getDeviceAppropriateImageSize(): number {
  // Check if window is defined (browser environment)
  if (typeof window === 'undefined') return 800;
  
  const width = window.innerWidth;
  
  // Based on common breakpoints
  if (width <= 640) return 640; // Mobile
  if (width <= 768) return 768; // Small tablets
  if (width <= 1024) return 1024; // Tablets & small laptops
  if (width <= 1280) return 1280; // Laptops
  return 1920; // Desktops & large screens
}

/**
 * Returns a set of responsive image sizes for different viewports
 */
export function getResponsiveImageSizes() {
  return {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
    large: 1920
  };
}

/**
 * For services like Imgur, return the size code for the URL
 */
function getImgurSizeCode(width: number): string {
  if (width <= 320) return 's';
  if (width <= 640) return 'm';
  if (width <= 1024) return 'l';
  return 'h';
}

/**
 * Generates a srcset attribute for responsive images
 */
export function generateSrcSet(url: string, sizes: number[] = [400, 800, 1200]) {
  if (!url) return '';
  
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(url, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Generates a set of source elements for a picture element
 */
export function generateResponsiveSources(url: string) {
  const sizes = getResponsiveImageSizes();
  
  return [
    {
      media: '(max-width: 640px)',
      srcSet: getOptimizedImageUrl(url, { width: sizes.mobile }),
    },
    {
      media: '(max-width: 768px)',
      srcSet: getOptimizedImageUrl(url, { width: sizes.tablet }),
    },
    {
      media: '(max-width: 1024px)',
      srcSet: getOptimizedImageUrl(url, { width: sizes.laptop }),
    },
    {
      media: '(max-width: 1280px)',
      srcSet: getOptimizedImageUrl(url, { width: sizes.desktop }),
    },
    {
      media: '(min-width: 1281px)',
      srcSet: getOptimizedImageUrl(url, { width: sizes.large }),
    },
  ];
}