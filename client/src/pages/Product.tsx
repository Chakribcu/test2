import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ChevronRight, ShoppingCart, Plus, Minus, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/product-card";
import ImageSlider from "@/components/ui/image-slider";
import OptimizedImage from "@/components/ui/optimized-image";

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
        
        {/* Newsletter signup */}
        <div className="mt-24 bg-slate-50 rounded-2xl p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-0">
                Join our newsletter to receive updates on new product launches, 
                wellness tips, and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
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
  
  useEffect(() => {
    document.title = `${product.name} | KavinoRa`;
  }, [product.name]);
  
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    
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
  }, [product.name, quantity, toast]);
  
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

            {/* Features in cards */}
            <div className="mb-12">
              <div className="flex items-center border-b pb-4 mb-6">
                <h2 className="text-xl font-bold flex-1">Key Features</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors">
                    <div className="mr-4 mt-1 bg-primary/10 p-1.5 rounded-full h-fit">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mb-12">
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
                    <span className="text-sm text-muted-foreground">2 months ago</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    This product has been amazing for my marathon training. No more chafing issues on my long runs.
                    I've recommended it to everyone in my running club!
                  </p>
                </div>
                
                <div className="pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                        MS
                      </div>
                      <div>
                        <h4 className="font-medium">Michael Smith</h4>
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
                    <span className="text-sm text-muted-foreground">1 month ago</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Good product overall. I would have given 5 stars but it could last a bit longer.
                    Still much better than other brands I've tried.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Purchasing Information */}
          <div className="lg:w-5/12">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Product Title and Pricing */}
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
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
                  <span className="text-sm text-muted-foreground">
                    {product.rating} · {product.reviews} reviews
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                </div>
                
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-2">Quantity</label>
                  <div className="flex items-center max-w-[10rem]">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 h-9 flex items-center justify-center border-y">
                      {quantity}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={isAddingToCart}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button variant="secondary" className="w-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
                
                {/* Secure checkout message */}
                <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-lock mr-1.5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
              
              {/* Shipping & Returns */}
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h3 className="font-bold text-base mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary">
                      <rect width="16" height="13" x="4" y="5" rx="2"/>
                      <path d="M16 2v3"/>
                      <path d="M8 2v3"/>
                      <path d="M4 10h16"/>
                    </svg>
                    <div>
                      <p className="font-medium">Free shipping</p>
                      <p className="text-muted-foreground">2-5 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <path d="m9 9 3-3 3 3"/>
                      <path d="M12 6v9"/>
                    </svg>
                    <div>
                      <p className="font-medium">Easy returns</p>
                      <p className="text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">You Might Also Like</h2>
            <Button variant="outline" onClick={() => navigate("/product")}>
              View All Products
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.id !== product.id).map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border bg-card"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="h-72 bg-muted relative overflow-hidden cursor-pointer">
                  <OptimizedImage 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    objectFit="cover"
                    lazyLoad={true}
                    blurEffect={true}
                  />
                  
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-primary text-white rounded-full px-3 py-1 text-sm font-bold">
                    ${relatedProduct.price.toFixed(2)}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(relatedProduct.rating) 
                              ? "text-amber-400 fill-amber-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({relatedProduct.reviews})
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Added to Cart",
                        description: `${relatedProduct.name} has been added to your cart`,
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;