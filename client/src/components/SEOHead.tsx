import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
  children?: React.ReactNode;
}

/**
 * SEO component for setting document head metadata
 * - Sets title and meta tags for SEO
 * - Adds Open Graph and Twitter card tags for social sharing
 * - Adds structured data for rich results
 * - Supports canonical URLs
 */
const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  children
}: SEOProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Update OG meta tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    if (ogImage) updateMetaTag('og:image', ogImage);
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl);
      updateCanonicalLink(canonicalUrl);
    }
    
    // Update Twitter meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) updateMetaTag('twitter:image', ogImage);
    
    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('#structured-data');
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData);
      } else {
        const script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
    
    // Cleanup function
    return () => {
      if (structuredData) {
        const script = document.querySelector('#structured-data');
        if (script) document.head.removeChild(script);
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, twitterCard, structuredData]);
  
  // Helper function to update meta tags
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  // Helper function to update canonical link
  const updateCanonicalLink = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };
  
  return <>{children}</>;
};

export default SEOHead;