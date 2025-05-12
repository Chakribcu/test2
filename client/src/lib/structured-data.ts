/**
 * Enhanced Structured Data Module for KavinoRa
 * Provides JSON-LD structured data generation for various schema.org types
 * to improve search engine visibility and rich snippets in search results.
 */

/**
 * Generates structured data for the Organization (Brand)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KavinoRa",
    "url": "https://kavinora.com",
    "logo": "https://kavinora.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/kavinora",
      "https://www.instagram.com/kavinora",
      "https://twitter.com/kavinora",
      "https://www.youtube.com/kavinora"
    ],
    "description": "KavinoRa - Effortless Comfort for Every Step. Premium wellness footwear designed for modern living.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-KAVINO-RA",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    }
  };
}

/**
 * Generates structured data for the Product
 */
export function getProductSchema(product: {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  availability?: string;
  brand?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "productID": product.id,
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "KavinoRa"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "USD",
      "availability": product.availability || "https://schema.org/InStock",
      "url": `https://kavinora.com/product/${product.id}`
    },
    ...(product.ratingValue && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.ratingValue,
        "reviewCount": product.reviewCount
      }
    } : {})
  };
}

/**
 * Generates structured data for BreadcrumbList
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generates structured data for Article
 */
export function getBlogPostSchema(post: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName?: string;
  publisherLogo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.headline,
    "description": post.description,
    "image": post.image,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "author": {
      "@type": "Person",
      "name": post.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": post.publisherName || "KavinoRa",
      "logo": {
        "@type": "ImageObject",
        "url": post.publisherLogo || "https://kavinora.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://kavinora.com/blog"
    }
  };
}

/**
 * Generates structured data for FAQPage
 */
export function getFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generates structured data for LocalBusiness
 */
export function getLocalBusinessSchema(business: {
  name?: string;
  image?: string;
  telephone?: string;
  priceRange?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name || "KavinoRa Store",
    "image": business.image || "https://kavinora.com/store.jpg",
    "telephone": business.telephone || "+1-800-KAVINO-RA",
    "priceRange": business.priceRange || "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.streetAddress,
      "addressLocality": business.address.addressLocality,
      "addressRegion": business.address.addressRegion,
      "postalCode": business.address.postalCode,
      "addressCountry": business.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.geo.latitude,
      "longitude": business.geo.longitude
    },
    "openingHoursSpecification": business.openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(" ")[0],
      "opens": hours.split(" ")[1].split("-")[0],
      "closes": hours.split(" ")[1].split("-")[1]
    }))
  };
}

/**
 * Generates enhanced structured data for wellness footwear products
 * with specific product attributes related to wellness benefits
 */
export function getWellnessProductSchema(product: {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  availability?: string;
  brand?: string;
  ratingValue?: number;
  reviewCount?: number;
  benefits?: string[];
  targetAudience?: string[];
  materials?: string[];
  certifications?: string[];
  footConditions?: string[];
}) {
  // Start with basic product schema
  const basicSchema = getProductSchema(product);
  
  // Add wellness-specific properties
  return {
    ...basicSchema,
    "productID": product.id,
    "category": "Wellness Footwear",
    "additionalProperty": [
      ...(product.benefits ? product.benefits.map(benefit => ({
        "@type": "PropertyValue",
        "name": "Wellness Benefit",
        "value": benefit
      })) : []),
      ...(product.materials ? product.materials.map(material => ({
        "@type": "PropertyValue",
        "name": "Material",
        "value": material
      })) : []),
      ...(product.certifications ? product.certifications.map(cert => ({
        "@type": "PropertyValue",
        "name": "Certification",
        "value": cert
      })) : []),
      ...(product.footConditions ? product.footConditions.map(condition => ({
        "@type": "PropertyValue",
        "name": "Addresses Foot Condition",
        "value": condition
      })) : [])
    ],
    "audience": product.targetAudience ? {
      "@type": "Audience",
      "audienceType": product.targetAudience.join(", ")
    } : undefined,
    "keywords": [
      "wellness footwear", 
      "comfort shoes", 
      "foot health", 
      ...(product.benefits || []),
      ...(product.footConditions || [])
    ].join(", ")
  };
}

/**
 * Generates structured data for product reviews
 */
export function getProductReviewSchema(review: {
  reviewId: string;
  productId: string;
  productName: string;
  reviewerName: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewId": review.reviewId,
    "itemReviewed": {
      "@type": "Product",
      "productID": review.productId,
      "name": review.productName
    },
    "author": {
      "@type": "Person",
      "name": review.reviewerName
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.reviewRating,
      "bestRating": 5
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished
  };
}

/**
 * Generates structured data for medical wellness claims (when applicable)
 * Note: Only use for products with verified medical benefits
 */
export function getMedicalBenefitSchema(claim: {
  productId: string;
  productName: string;
  medicalCondition: string;
  benefitClaim: string;
  evidenceUrl?: string;
  recognizingAuthority?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalIndication",
    "medicineSystem": "http://schema.org/WesternConventional",
    "recognizingAuthority": claim.recognizingAuthority ? {
      "@type": "Organization",
      "name": claim.recognizingAuthority
    } : undefined,
    "relevantSpecialty": "Podiatry",
    "study": claim.evidenceUrl ? {
      "@type": "MedicalStudy",
      "studyLocation": claim.evidenceUrl
    } : undefined,
    "code": {
      "@type": "MedicalCode",
      "codingSystem": "ICD-10",
      "code": "Footwear related wellness"
    },
    "guideline": {
      "@type": "MedicalGuideline",
      "evidenceLevel": "https://schema.org/EvidenceLevelC",
      "guidelineSubject": {
        "@type": "MedicalEntity",
        "name": claim.medicalCondition
      }
    },
    "drug": {
      "@type": "Product",
      "productID": claim.productId,
      "name": claim.productName
    }
  };
}