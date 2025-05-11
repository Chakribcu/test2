import { Product } from './recommendationEngine';

/**
 * Content-Based Recommendation Algorithms
 * 
 * This module provides various algorithms for content-based recommendation
 * systems that analyze product attributes to find similar items.
 */

/**
 * Calculate Jaccard similarity between two arrays
 * Measures how similar two sets are by comparing their intersection and union
 * 
 * @param setA First array of items
 * @param setB Second array of items
 * @returns Similarity score between 0 and 1
 */
export function jaccardSimilarity<T>(setA: T[], setB: T[]): number {
  const intersectionSize = setA.filter(item => setB.includes(item)).length;
  
  // Create a combined array of all unique items (union)
  const combined = [...setA, ...setB];
  const uniqueItems = combined.filter((item, index) => combined.indexOf(item) === index);
  const unionSize = uniqueItems.length;
  
  if (unionSize === 0) return 0;
  return intersectionSize / unionSize;
}

/**
 * Calculate cosine similarity between two feature vectors
 * Often used in recommendation systems for numeric features
 * 
 * @param vectorA First feature vector
 * @param vectorB Second feature vector
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }
  
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate similarity score between two products based on various features
 * 
 * @param product1 First product
 * @param product2 Second product
 * @returns Overall similarity score between 0 and 1
 */
export function calculateProductSimilarity(product1: Product, product2: Product): number {
  // Different features contribute different weights to the overall similarity
  const weights = {
    tags: 0.5,       // Category tags have significant importance
    price: 0.3,      // Price range matters moderately
    name: 0.1,       // Product name can indicate similarity
    description: 0.1 // Product description can contain relevant terms
  };
  
  // Calculate tag similarity using Jaccard similarity
  const tagSimilarity = jaccardSimilarity(product1.tags, product2.tags);
  
  // Calculate price similarity (closer prices = more similar)
  // Convert to a score between 0 and 1, where 1 means exactly the same price
  // and 0 means very different prices (e.g., >100% difference)
  const priceDiff = Math.abs(product1.price - product2.price);
  const avgPrice = (product1.price + product2.price) / 2;
  const priceRatio = priceDiff / avgPrice;
  const priceSimilarity = Math.max(0, 1 - priceRatio); // Cap at 0 (no similarity)
  
  // Calculate name similarity (basic approximation - count overlapping words)
  const product1Words = product1.name.toLowerCase().split(/\W+/).filter(Boolean);
  const product2Words = product2.name.toLowerCase().split(/\W+/).filter(Boolean);
  const nameSimilarity = jaccardSimilarity(product1Words, product2Words);
  
  // Calculate description similarity (basic approximation)
  const desc1Words = product1.description.toLowerCase().split(/\W+/).filter(Boolean);
  const desc2Words = product2.description.toLowerCase().split(/\W+/).filter(Boolean);
  const descSimilarity = jaccardSimilarity(desc1Words, desc2Words);
  
  // Calculate weighted similarity score
  const weightedScore = 
    weights.tags * tagSimilarity +
    weights.price * priceSimilarity +
    weights.name * nameSimilarity +
    weights.description * descSimilarity;
  
  return weightedScore;
}

/**
 * Find similar products using content-based filtering
 * 
 * @param targetProduct The product to find similar items for
 * @param allProducts List of all available products
 * @param limit Maximum number of recommendations to return
 * @returns Array of products sorted by similarity
 */
export function findSimilarProducts(
  targetProduct: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // Calculate similarity for all other products
  const scoredProducts = allProducts
    .filter(product => product.id !== targetProduct.id) // Exclude the target product
    .map(product => ({
      product,
      similarityScore: calculateProductSimilarity(targetProduct, product)
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by descending similarity
    .slice(0, limit); // Take only the top N
  
  return scoredProducts.map(item => item.product);
}

/**
 * Implement a simple collaborative filtering algorithm based on user behavior
 * 
 * In a real system, this would analyze actual user behavior data. For this
 * prototype, we'll use a simplified approach based on our available data.
 * 
 * @param productId The product ID
 * @param allProducts List of all available products
 * @param limit Maximum number of recommendations to return
 * @returns Array of products recommended for users who viewed/bought this product
 */
export function collaborativeFilteringRecommendations(
  productId: string,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // In a real system, we would look at user behavior data to see what
  // other products are frequently viewed/purchased by users who
  // interacted with this product
  
  // For our prototype, we'll simulate this with a deterministic algorithm
  // that uses the product ID as a seed value
  const targetProduct = allProducts.find(p => p.id === productId);
  
  if (!targetProduct) {
    return [];
  }
  
  // Create a seed value based on the product ID
  const seed = parseInt(productId) || 1;
  
  // Generate a "similarity" score that's different for each product
  // but deterministic for the same product ID
  const scoredProducts = allProducts
    .filter(p => p.id !== productId)
    .map(product => {
      const idSeed = parseInt(product.id) || 1;
      // Generate a pseudorandom score based on the product IDs
      const score = (seed * 19 + idSeed * 17) % 97 / 97;
      
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scoredProducts.map(item => item.product);
}

/**
 * Generate trending product recommendations based on:
 * - Ratings and reviews (popularity)
 * - Recency factor (newer products get a boost)
 * - Random variance (to allow for discovery)
 * 
 * @param allProducts List of all available products
 * @param limit Maximum number of products to return
 * @returns Array of trending products
 */
export function getTrendingProductRecommendations(
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // In a real system, we would use real-time data on view counts,
  // sales velocity, review frequency, etc.
  
  // For our prototype, we'll use a simplified algorithm that
  // combines ratings, reviews, and some randomness
  
  const scoredProducts = allProducts.map(product => {
    // Base score from ratings and reviews
    const popularityScore = product.rating * product.reviews;
    
    // Add random variance for "trending" effect 
    // This would typically be based on recent view/purchase data
    const trendingVariance = Math.random() * 0.3;
    
    // Calculate final score
    const score = popularityScore * (1 + trendingVariance);
    
    return { product, score };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);
  
  return scoredProducts.map(item => item.product);
}

/**
 * Calculate a personalized set of recommendations for a specific user
 * based on their viewing and purchase history
 * 
 * @param userId User identifier
 * @param viewHistory Array of product IDs the user has viewed
 * @param purchaseHistory Array of product IDs the user has purchased
 * @param allProducts List of all available products
 * @param limit Maximum number of recommendations to return
 * @returns Personalized product recommendations
 */
export function getPersonalizedRecommendations(
  userId: number,
  viewHistory: string[],
  purchaseHistory: string[],
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // In a real system, we would have a sophisticated model that considers the user's
  // entire interaction history, including time spent viewing items, items added to cart
  // but not purchased, purchase recency, etc.
  
  // For our prototype, we'll implement a simplified algorithm that:
  // 1. Finds products similar to those they've viewed/purchased
  // 2. Weights recently viewed products more heavily
  // 3. Prioritizes similar products to those they've purchased
  
  if (!viewHistory.length && !purchaseHistory.length) {
    // Fall back to popular products if we have no history
    return getTrendingProductRecommendations(allProducts, limit);
  }
  
  // Create a map to track accumulated scores for each product
  const productScores = new Map<string, number>();
  
  // Initialize all products with a zero score (except ones they've already seen/bought)
  const seenProducts = new Set([...viewHistory, ...purchaseHistory]);
  allProducts.forEach(product => {
    if (!seenProducts.has(product.id)) {
      productScores.set(product.id, 0);
    }
  });
  
  // Calculate scores based on purchase history (higher weight)
  purchaseHistory.forEach(boughtProductId => {
    const boughtProduct = allProducts.find(p => p.id === boughtProductId);
    if (!boughtProduct) return;
    
    // Find similar products to those purchased
    allProducts.forEach(product => {
      if (!seenProducts.has(product.id)) {
        const similarity = calculateProductSimilarity(boughtProduct, product);
        const currentScore = productScores.get(product.id) || 0;
        // Purchased products get a 2x weight
        productScores.set(product.id, currentScore + similarity * 2);
      }
    });
  });
  
  // Calculate scores based on view history
  viewHistory.forEach((viewedProductId, index) => {
    const viewedProduct = allProducts.find(p => p.id === viewedProductId);
    if (!viewedProduct) return;
    
    // Find similar products to those viewed
    allProducts.forEach(product => {
      if (!seenProducts.has(product.id)) {
        const similarity = calculateProductSimilarity(viewedProduct, product);
        const currentScore = productScores.get(product.id) || 0;
        // More recently viewed items get higher weight
        const recencyWeight = 1 + (viewHistory.length - index) / viewHistory.length;
        productScores.set(product.id, currentScore + similarity * recencyWeight);
      }
    });
  });
  
  // Convert scores to array and sort
  const scoredProducts = Array.from(productScores.entries())
    .map(([id, score]) => ({
      product: allProducts.find(p => p.id === id)!,
      score
    }))
    .filter(item => item.product) // Remove any undefined products
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scoredProducts.map(item => item.product);
}