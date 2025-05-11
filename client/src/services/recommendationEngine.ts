import { apiRequest } from "@/lib/queryClient";

/**
 * Product interface matching our product data structure
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  features: string[];
  tags: string[];
  inStock: boolean;
}

/**
 * Recommendation types for different recommendation strategies
 */
export type RecommendationType = 
  | 'similar' 
  | 'popular' 
  | 'trending' 
  | 'frequently-bought-together' 
  | 'recently-viewed';

/**
 * Recommendation Engine Service
 * 
 * This service provides methods to get product recommendations based on
 * different strategies such as similarity, popularity, user behavior, etc.
 */
export class RecommendationEngine {
  private cachedRecommendations: Map<string, { products: Product[], timestamp: number }> = new Map();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  /**
   * Gets product recommendations based on the specified strategy
   * 
   * @param strategy - The recommendation type to use
   * @param productId - The current product ID (optional, for similarity-based recommendations)
   * @param userId - The current user ID (optional, for personalized recommendations)
   * @param limit - Maximum number of recommendations to return
   * @returns Array of recommended products
   */
  async getRecommendations(
    strategy: RecommendationType = 'popular',
    productId?: string,
    userId?: number,
    limit: number = 3
  ): Promise<Product[]> {
    // Create a cache key based on the request parameters
    const cacheKey = `${strategy}-${productId || ''}-${userId || ''}-${limit}`;
    
    // Check if we have cached results that haven't expired
    const cached = this.cachedRecommendations.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
      return cached.products;
    }
    
    try {
      // In a real app, this would make an API call to the recommendation service
      // For now, we'll simulate with client-side logic
      let recommendations: Product[];
      
      if (strategy === 'similar' && productId) {
        // For similar products, we'd typically call an endpoint like:
        // const response = await apiRequest('GET', `/api/recommendations/similar/${productId}?limit=${limit}`);
        // recommendations = await response.json();
        
        // For now, simulate with client-side logic
        recommendations = await this.getSimilarProducts(productId, limit);
      } else if (strategy === 'trending') {
        // For trending products
        recommendations = await this.getTrendingProducts(limit);
      } else if (strategy === 'frequently-bought-together' && productId) {
        // For frequently bought together
        recommendations = await this.getFrequentlyBoughtTogether(productId, limit);
      } else if (strategy === 'recently-viewed' && userId) {
        // For recently viewed by the specific user
        recommendations = await this.getRecentlyViewed(userId, limit);
      } else {
        // Default to popular products
        recommendations = await this.getPopularProducts(limit);
      }
      
      // Cache the results
      this.cachedRecommendations.set(cacheKey, {
        products: recommendations,
        timestamp: Date.now()
      });
      
      return recommendations;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }
  
  /**
   * Fetch similar products based on product tags, categories or attributes
   */
  private async getSimilarProducts(productId: string, limit: number): Promise<Product[]> {
    try {
      // In a production app, this would be an API call
      // const response = await apiRequest('GET', `/api/products/${productId}/similar?limit=${limit}`);
      // return await response.json();
      
      // For now, we'll fetch all products and filter them by similarity
      const products = await this.getAllProducts();
      const currentProduct = products.find(p => p.id === productId);
      
      if (!currentProduct) {
        return [];
      }
      
      // Score products by similarity (same tags, similar price range, etc.)
      const scoredProducts = products
        .filter(p => p.id !== productId) // Exclude current product
        .map(product => {
          let score = 0;
          
          // Score by matching tags
          const commonTags = product.tags.filter(tag => 
            currentProduct.tags.includes(tag)
          );
          score += commonTags.length * 2;
          
          // Score by price similarity (products within 20% price range)
          const priceDiff = Math.abs(product.price - currentProduct.price);
          const pricePercentage = priceDiff / currentProduct.price;
          if (pricePercentage < 0.2) {
            score += 1;
          }
          
          return { product, score };
        })
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, limit) // Take only the requested number of products
        .map(item => item.product); // Extract just the product
        
      return scoredProducts;
    } catch (error) {
      console.error("Error fetching similar products:", error);
      return [];
    }
  }
  
  /**
   * Fetch popular products based on ratings and reviews
   */
  private async getPopularProducts(limit: number): Promise<Product[]> {
    try {
      // In a production app, this would be an API call
      // const response = await apiRequest('GET', `/api/products/popular?limit=${limit}`);
      // return await response.json();
      
      // For now, we'll fetch all products and sort by popularity
      const products = await this.getAllProducts();
      
      // Calculate popularity score (ratings * number of reviews)
      return products
        .map(product => ({
          product,
          popularityScore: product.rating * product.reviews
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, limit)
        .map(item => item.product);
    } catch (error) {
      console.error("Error fetching popular products:", error);
      return [];
    }
  }
  
  /**
   * Fetch trending products (products with recent popularity spikes)
   */
  private async getTrendingProducts(limit: number): Promise<Product[]> {
    // In a real app, trending would consider recent orders and views
    // For now, we'll use a slight variation of popularity
    try {
      const products = await this.getAllProducts();
      
      // Simulate trending with some randomization added to popularity
      return products
        .map(product => ({
          product,
          trendScore: (product.rating * product.reviews) * (1 + Math.random() * 0.2)
        }))
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, limit)
        .map(item => item.product);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      return [];
    }
  }
  
  /**
   * Fetch products frequently bought together with the specified product
   */
  private async getFrequentlyBoughtTogether(productId: string, limit: number): Promise<Product[]> {
    try {
      // In a production app, this would be an API call based on order history analysis
      // const response = await apiRequest('GET', `/api/products/${productId}/frequently-bought-together?limit=${limit}`);
      // return await response.json();
      
      // For prototype, we'll use a seed-based pseudo-random selection that's consistent for the same productId
      const products = await this.getAllProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      
      // Use the product ID to create a consistent "random" selection
      const seed = parseInt(productId, 10) || 1;
      
      return filteredProducts
        .map(product => ({
          product,
          // Use the seed to generate a consistent score for each product
          score: (parseInt(product.id, 10) * seed) % 100
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.product);
    } catch (error) {
      console.error("Error fetching frequently bought together products:", error);
      return [];
    }
  }
  
  /**
   * Fetch products recently viewed by the user
   */
  private async getRecentlyViewed(userId: number, limit: number): Promise<Product[]> {
    try {
      // In a production app, this would be an API call
      // const response = await apiRequest('GET', `/api/users/${userId}/recently-viewed?limit=${limit}`);
      // return await response.json();
      
      // For prototype, we'll use localStorage to track recently viewed products
      const recentlyViewedIds = this.getRecentlyViewedFromStorage();
      const products = await this.getAllProducts();
      
      // Filter and sort by recency
      return recentlyViewedIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as Product[];
    } catch (error) {
      console.error("Error fetching recently viewed products:", error);
      return [];
    }
  }
  
  /**
   * Track a product view for the current user
   */
  trackProductView(productId: string): void {
    const recentlyViewed = this.getRecentlyViewedFromStorage();
    
    // Remove the product if it's already in the list
    const filtered = recentlyViewed.filter(id => id !== productId);
    
    // Add the product to the beginning of the list
    filtered.unshift(productId);
    
    // Keep only the last 10 products
    const trimmed = filtered.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewedProducts', JSON.stringify(trimmed));
  }
  
  /**
   * Get recently viewed product IDs from localStorage
   */
  private getRecentlyViewedFromStorage(): string[] {
    try {
      const stored = localStorage.getItem('recentlyViewedProducts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return [];
    }
  }
  
  /**
   * Fetch all products (in a real app, this would be paginated)
   */
  private async getAllProducts(): Promise<Product[]> {
    // In a production app, this would fetch from the API
    // const response = await apiRequest('GET', '/api/products');
    // return await response.json();
    
    // For prototype, we're using a static product list
    return [
      {
        id: "1",
        name: "MotionMist™ Anti-Chafing Spray",
        slug: "motionmist-anti-chafing-spray",
        price: 29.99,
        rating: 4.8,
        reviews: 124,
        images: [
          "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=1887&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1607004468138-e7e23ea26947?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Our breakthrough anti-chafing spray provides long-lasting comfort during any activity.",
        features: [
          "Prevents friction and irritation in high-friction areas",
          "Water-resistant formula that lasts through intense workouts"
        ],
        tags: ["Plant-Based", "Dermatologist-Tested", "Cruelty-Free", "Vegan", "Eco-Friendly"],
        inStock: true
      },
      {
        id: "2",
        name: "KavinoRa Wellness Tea",
        slug: "wellness-tea",
        price: 24.99,
        rating: 4.9,
        reviews: 89,
        images: [
          "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1887&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1603567941882-60d5490643b8?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Our signature herbal tea blend crafted to promote relaxation, reduce stress, and enhance overall wellness.",
        features: [
          "Organic blend of chamomile, lavender, and lemon balm",
          "Promotes relaxation and reduces stress"
        ],
        tags: ["Organic", "Caffeine-Free", "Non-GMO", "Fair Trade", "Sustainable"],
        inStock: true
      },
      {
        id: "3",
        name: "Mindfulness Journal",
        slug: "mindfulness-journal",
        price: 39.95,
        rating: 4.7,
        reviews: 56,
        images: [
          "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?q=80&w=1887&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518893063132-36e46dbe2428?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Our beautiful, eco-friendly journal designed specifically to guide your mindfulness practice.",
        features: [
          "200 pages of premium recycled paper",
          "Structured daily prompts and reflection exercises"
        ],
        tags: ["Eco-Friendly", "Mindfulness", "Self-Care", "Sustainable", "Recycled"],
        inStock: true
      },
      {
        id: "4",
        name: "Bamboo Yoga Block Set",
        slug: "bamboo-yoga-block-set",
        price: 34.99,
        rating: 4.6,
        reviews: 42,
        images: [
          "https://images.unsplash.com/photo-1518310952931-b1de897abd40?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Sustainable bamboo yoga blocks to enhance your practice and deepen your stretches.",
        features: [
          "Crafted from sustainable bamboo",
          "Provides stability and support for all yoga levels"
        ],
        tags: ["Eco-Friendly", "Yoga", "Sustainable", "Exercise", "Fitness"],
        inStock: true
      },
      {
        id: "5",
        name: "Natural Recovery Balm",
        slug: "natural-recovery-balm",
        price: 19.99,
        rating: 4.5,
        reviews: 78,
        images: [
          "https://images.unsplash.com/photo-1608248543803-ff30f25d2273?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Plant-based recovery balm for sore muscles and joints after workouts.",
        features: [
          "All-natural ingredients including arnica and lavender",
          "Fast-absorbing and non-greasy formula"
        ],
        tags: ["Plant-Based", "Recovery", "Post-Workout", "Natural", "Vegan"],
        inStock: true
      },
      {
        id: "6",
        name: "Organic Cotton Water Bottle Carrier",
        slug: "organic-cotton-water-bottle-carrier",
        price: 15.99,
        rating: 4.3,
        reviews: 35,
        images: [
          "https://images.unsplash.com/photo-1596133407611-d05a4f0ab29b?q=80&w=1887&auto=format&fit=crop"
        ],
        description: "Stylish and eco-friendly water bottle carrier made from organic cotton.",
        features: [
          "Fits standard 750ml water bottles",
          "Adjustable strap for comfortable carrying"
        ],
        tags: ["Organic", "Eco-Friendly", "Sustainable", "Fitness", "Accessories"],
        inStock: true
      }
    ];
  }
}

// Export a singleton instance
export const recommendationEngine = new RecommendationEngine();