import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ChevronRight, ShoppingCart, Plus, Minus, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/product-card";
import ImageSlider from "@/components/ui/image-slider";
import OptimizedImage from "@/components/ui/optimized-image";
import ProductRecommendations from "../components/ProductRecommendations";
import { recommendationEngine } from "@/services/recommendationEngine";

// Define product type for TypeScript
interface ProductType {
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

// Sample products data - in a real app, this would come from an API
const products: ProductType[] = [
  {
    id: "1",
    name: "MotionMist™ Anti-Chafing Spray",
    slug: "motionmist-anti-chafing-spray",
    price: 29.99,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607004468138-e7e23ea26947?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614267861476-0d129972a0f5?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=1887&auto=format&fit=crop"
    ],
    description: "Our breakthrough anti-chafing spray provides long-lasting comfort during any activity. The lightweight formula applies easily, dries instantly, and creates an invisible protective barrier between your skin and clothing.",
    features: [
      "Prevents friction and irritation in high-friction areas",
      "Water-resistant formula that lasts through intense workouts",
      "Dermatologist tested and approved for sensitive skin",
      "100% plant-based ingredients for natural protection",
      "Quick-drying and non-greasy application",
      "Free from parabens, sulfates, and synthetic fragrances",
      "Suitable for all skin types",
      "Eco-friendly packaging"
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
      "https://images.unsplash.com/photo-1603567941882-60d5490643b8?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565945887714-d5139f4eb0ce?q=80&w=1887&auto=format&fit=crop"
    ],
    description: "Our signature herbal tea blend crafted to promote relaxation, reduce stress, and enhance overall wellness. Each cup delivers a soothing experience with carefully selected organic ingredients.",
    features: [
      "Organic blend of chamomile, lavender, and lemon balm",
      "Promotes relaxation and reduces stress",
      "Supports digestive health",
      "Caffeine-free for any time of day",
      "Hand-blended in small batches",
      "Biodegradable tea bags",
      "30 servings per package",
      "Sustainable packaging"
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
      "https://images.unsplash.com/photo-1518893063132-36e46dbe2428?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1887&auto=format&fit=crop"
    ],
    description: "Our beautiful, eco-friendly journal designed specifically to guide your mindfulness practice. With structured prompts, reflection pages, and mood tracking, it's the perfect companion for your wellness journey.",
    features: [
      "200 pages of premium recycled paper",
      "Structured daily prompts and reflection exercises",
      "Monthly mood and habit trackers",
      "Guided meditation scripts",
      "Inspirational quotes throughout",
      "Lies flat when open for easy writing",
      "Elastic closure band and bookmark ribbon",
      "Made with sustainable materials"
    ],
    tags: ["Eco-Friendly", "Mindfulness", "Self-Care", "Sustainable", "Recycled"],
    inStock: true
  }
];

// Main Product component that determines what to render based on route params
const Product = () => {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // If we're on the main product listing page
  if (!id) {
    return <ProductListing navigate={navigate} toast={toast} />;
  }
  
  // Product detail page - Find the product
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <ProductNotFound navigate={navigate} />;
  }
  
  return <ProductDetail product={product} navigate={navigate} toast={toast} />;
};

// Product listing page component
const ProductListing = ({ navigate, toast }: { navigate: (to: string) => void, toast: any }) => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        {/* Hero section for products page */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-background mb-16">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="py-16 px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Premium Products</h1>
              <p className="text-lg text-muted-foreground mb-0">
                Discover our range of plant-based wellness products designed to enhance your active lifestyle with natural ingredients and superior performance.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters and sort - can be expanded with functionality */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 rounded-full font-medium">
              All Products
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Anti-Chafing
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Wellness
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Lifestyle
            </Badge>
          </div>
          
          <div>
            <Button variant="ghost" size="sm">
              Sort by: Featured
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={parseInt(product.id)}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              category={product.tags[0]}
            />
          ))}
        </div>
        
        {/* We'll use the main Newsletter component from the footer */}
      </div>
    </Layout>
  );
};

// Product not found component
const ProductNotFound = ({ navigate }: { navigate: (to: string) => void }) => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate("/product")}>
          View All Products
        </Button>
      </div>
    </Layout>
  );
};

// Product detail component
const ProductDetail = ({ 
  product, 
  navigate, 
  toast 
}: { 
  product: ProductType, 
  navigate: (to: string) => void, 
  toast: any 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();
  
  useEffect(() => {
    document.title = `${product.name} | KavinoRa`;
    
    // Track product view for recommendations
    recommendationEngine.trackProductView(product.id);
  }, [product.name, product.id]);
  
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    
    // Add to cart using CartProvider
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    });
    
    // Simulate API request
    setTimeout(() => {
      setIsAddingToCart(false);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} (Qty: ${quantity}) has been added to your cart`,
      });
      
      // Reset quantity after adding to cart
      setQuantity(1);
    }, 600);
  }, [product, quantity, toast, addItem]);
  
  return (
    <Layout>
      {/* Product detail with sticky purchasing panel */}
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center mb-8 text-sm">
          <Button 
            variant="link" 
            className="text-muted-foreground p-0 h-auto font-medium" 
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
          <Button 
            variant="link" 
            className="text-muted-foreground p-0 h-auto font-medium" 
            onClick={() => navigate("/product")}
          >
            Products
          </Button>
          <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Images & Details */}
          <div className="lg:w-7/12">
            {/* Product image slider with zoom effect */}
            <div className="relative mb-6">
              {/* If there are multiple images, use slider */}
              {product.images.length > 1 ? (
                <ImageSlider 
                  images={product.images}
                  aspectRatio="square"
                  showArrows={true}
                  showDots={true}
                  autoplay={false}
                  className="shadow-lg"
                />
              ) : (
                <div className="relative bg-background rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <OptimizedImage 
                    src={product.images[0]} 
                    alt={product.name}
                    objectFit="cover"
                    className="w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              {/* Sale badge if applicable */}
              {product.id === "1" && (
                <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full px-3 py-1.5 text-sm font-medium z-10">
                  New
                </div>
              )}
            </div>

            {/* Product Description & Details */}
            <div className="mb-12">
              <div className="flex items-center border-b pb-4 mb-6">
                <h2 className="text-xl font-bold flex-1">Product Details</h2>
              </div>
              
              <div className="prose max-w-none text-muted-foreground">
                <p className="mb-4">{product.description}</p>
                <p>
                  Experience the difference with KavinoRa's premium quality products, 
                  designed with your active lifestyle in mind. Our {product.name} is perfect 
                  for athletes, fitness enthusiasts, and anyone seeking natural, high-performance solutions.
                </p>
              </div>
            </div>

            {/* Features moved to right column */}
          </div>

          {/* Right Column - Purchase Info */}
          <div className="lg:w-5/12">
            <div className="sticky top-24">
              {/* Product Title and Price */}
              <div className="bg-card border rounded-xl p-6 mb-6 shadow-sm">
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? "text-amber-400 fill-amber-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-muted-foreground ml-2">USD</span>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Quantity</p>
                  <div className="inline-flex items-center border rounded-lg">
                    <button 
                      className="p-2 hover:bg-muted/50 rounded-l-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-l border-r min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button 
                      className="p-2 hover:bg-muted/50 rounded-r-lg"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart and Buy Now buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={isAddingToCart}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => {
                      // Add to cart and redirect to checkout
                      addItem({
                        id: parseInt(product.id),
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                        image: product.images[0]
                      });
                      // Navigate to checkout page
                      navigate("/checkout");
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
                
                {/* Secure checkout message */}
                <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
                  <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Secure checkout with 30-day money-back guarantee
                </div>
              </div>
              
              {/* Key Features section - moved from left column */}
              <div className="bg-card border rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex items-center border-b pb-4 mb-6">
                  <h2 className="text-lg font-bold flex-1">Key Features</h2>
                </div>
                
                <div className="space-y-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex p-3 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="mr-3 mt-0.5 bg-primary/10 p-1.5 rounded-full h-fit">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Policy info */}
              <div className="flex flex-col space-y-4">
                {/* Free shipping */}
                <div className="flex p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Free Shipping</h3>
                    <p className="text-xs text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                
                {/* Return policy */}
                <div className="flex p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                      <path d="M2 9c-.15-1.83.5-3.5 1.85-4.85C5.2 2.8 6.87 2.15 8.7 2"></path>
                      <path d="M14 8c1.85.15 3.5.8 4.85 2.15a7.51 7.51 0 0 1 1.65 2.85"></path>
                      <path d="m8 16 4-4 4 4"></path>
                      <path d="M16 12v4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Easy Returns</h3>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
                
                {/* Secure payment */}
                <div className="flex p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Secure Payment</h3>
                    <p className="text-xs text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Products Recommendations */}
        <ProductRecommendations 
          productId={product.id}
          strategy="similar"
          title="Similar Products You Might Like"
          limit={3}
        />
        
        {/* Frequently Bought Together Recommendations */}
        <div className="mt-24">
          <ProductRecommendations 
            productId={product.id}
            strategy="frequently-bought-together"
            title="Frequently Bought Together"
            limit={3}
          />
        </div>
        
        {/* Customer Reviews Section - Moved to bottom of page */}
        <div className="mt-24 mb-12">
          <div className="flex items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-bold flex-1">Customer Reviews</h2>
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? "text-amber-400 fill-amber-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating} · {product.reviews} reviews</span>
            </div>
          </div>
          
          {/* Sample reviews - in a real app, these would come from a database */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                    JD
                  </div>
                  <div>
                    <h4 className="font-medium">Jane Doe</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">3 days ago</span>
              </div>
              <p className="text-muted-foreground">This product exceeded my expectations. The quality is exceptional, and it has significantly improved my daily routine. I highly recommend it to anyone who's considering making a purchase.</p>
            </div>
            
            <div className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                    JS
                  </div>
                  <div>
                    <h4 className="font-medium">John Smith</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">1 week ago</span>
              </div>
              <p className="text-muted-foreground">Great product but shipping took a little longer than expected. The quality makes up for it though. I've been using it daily for the past week and am already seeing results.</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                    AT
                  </div>
                  <div>
                    <h4 className="font-medium">Alice Thompson</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 weeks ago</span>
              </div>
              <p className="text-muted-foreground">Absolutely in love with this product! It fits perfectly into my wellness routine and has made such a difference. The natural ingredients are exactly what I was looking for. Will definitely be purchasing again.</p>
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                View All Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;