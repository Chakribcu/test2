/**
 * Image Optimization Utility
 * 
 * This utility provides functions for optimizing images in the application.
 * It handles image size, responsive loading, and performance optimizations.
 */

// Function to generate optimized image URLs (for production use with a CDN)
export function getOptimizedImageUrl(url: string, options: { width?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' } = {}) {
  const { width = 800, quality = 80, format = 'webp' } = options;
  
  // Check if we're using an image that can be optimized
  if (url.startsWith('https://images.unsplash.com')) {
    // Unsplash already provides an API for image optimization
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (quality) params.append('q', quality.toString());
    if (format) params.append('fm', format);
    
    // Return optimized Unsplash URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }
  
  // For Imgur images
  if (url.startsWith('https://i.imgur.com')) {
    // Extract the image ID and create an optimized URL
    const imgurId = url.split('/').pop()?.split('.')[0];
    if (imgurId) {
      return `https://i.imgur.com/${imgurId}_${getImgurSizeCode(width)}.jpg`;
    }
  }
  
  // For other images, return original for now
  return url;
}

// Function to determine appropriate image sizes for responsive loading
export function getResponsiveImageSizes() {
  return {
    small: 400,
    medium: 800,
    large: 1200
  };
}

// Helper function to get Imgur size code
function getImgurSizeCode(width: number): string {
  if (width <= 160) return 't'; // Tiny Thumbnail
  if (width <= 320) return 'm'; // Medium Thumbnail
  if (width <= 640) return 'l'; // Large Thumbnail
  return 'h'; // Huge Thumbnail
}

// Function to get appropriate image size based on device
export function getDeviceAppropriateImageSize(): number {
  if (typeof window === 'undefined') return 800; // Default to medium for SSR
  
  const width = window.innerWidth;
  if (width <= 640) return 400; // Mobile
  if (width <= 1024) return 800; // Tablet
  return 1200; // Desktop
}

// Generate responsive srcset for modern browsers
export function generateSrcSet(url: string, sizes: number[] = [400, 800, 1200]) {
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(url, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

// Generate responsive sources for picture element
export function generateResponsiveSources(url: string) {
  const sizes = getResponsiveImageSizes();
  
  return [
    { 
      media: '(max-width: 640px)', 
      srcset: getOptimizedImageUrl(url, { width: sizes.small }),
    },
    { 
      media: '(max-width: 1024px)', 
      srcset: getOptimizedImageUrl(url, { width: sizes.medium }),
    },
    { 
      media: '(min-width: 1025px)', 
      srcset: getOptimizedImageUrl(url, { width: sizes.large }),
    }
  ];
}

// Export a React component version for optimized images in the future