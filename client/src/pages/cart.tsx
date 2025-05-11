import { useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  Shield,
  RefreshCcw,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProductRecommendations from "../components/ProductRecommendations";
import RecentlyViewedProducts from "../components/RecentlyViewedProducts";
import { useCart } from "@/hooks/use-cart";
import SEOHead from "@/components/SEOHead";
import { scrollToTopInstant } from "@/lib/scroll-restoration";
import OptimizedImage from "@/components/ui/optimized-image";
import { PageLoading } from "@/components/ui/loading";

const Cart = () => {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  
  useEffect(() => {
    // Scroll to top when component mounts
    scrollToTopInstant();
    document.title = "Your Cart | KavinoRa";
  }, []);

  const increaseQuantity = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // Calculate shipping and total
  const shipping = subtotal > 0 && subtotal < 75 ? 5.99 : 0;
  const total = subtotal + shipping;
  
  // SEO data for cart page
  const seoData = {
    title: "Your Shopping Cart | KavinoRa",
    description: "View and manage your KavinoRa shopping cart. Review your selected wellness products before checkout.",
    canonicalUrl: window.location.origin + "/cart"
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <Layout>
        <SEOHead {...seoData} />
        <div className="container mx-auto py-16 px-4">
          <div className="text-center max-w-lg mx-auto">
            <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/product")}
              className="px-8"
            >
              Browse Products
            </Button>
          </div>
          
          {/* Product recommendations for empty cart */}
          <div className="mt-24">
            <ProductRecommendations 
              strategy="popular"
              title="Popular Products You Might Like"
              limit={4}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead {...seoData} />
      <div className="container mx-auto py-12 px-4">
        {/* Hero section for cart page */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items before proceeding to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Items in Your Cart ({itemCount})</CardTitle>
                  {items.length > 1 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => clearCart()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove all items from your cart</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4">
                      {/* Product image - smaller */}
                      <div className="w-full sm:w-24 h-24 bg-background rounded-xl overflow-hidden shadow-sm border shrink-0">
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full"
                          objectFit="cover"
                          lazyLoad={true}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="font-semibold text-base mb-1">
                            {item.name}
                          </h3>
                          <p className="font-bold text-primary text-base">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Item ID */}
                        <p className="text-xs text-muted-foreground mb-3">
                          Item #{item.id.toString().padStart(6, '0')}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-4 py-1.5 w-8 text-center text-sm border-x">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove item</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-6 flex flex-wrap justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/product")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
                
                {/* Order Policy Links */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <RefreshCcw className="h-3 w-3 mr-1.5" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1.5" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <div className="lg:sticky lg:top-24">
              <Card className="border-none shadow overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Shipping</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Spend $75 or more to qualify for free shipping</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {subtotal >= 75 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {/* Discount code input */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Have a promo code?</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter code" 
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                        />
                        <Button variant="outline" size="sm" className="shrink-0">
                          Apply
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Including all taxes and duties
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-6 py-6 text-base"
                    onClick={() => navigate("/checkout")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  {/* Payment methods */}
                  <div className="mt-5 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Secure Payment Methods</p>
                    <div className="flex justify-center items-center gap-1.5">
                      <Badge variant="outline" className="bg-white p-1 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-4" />
                      </Badge>
                      <Badge variant="outline" className="bg-white p-1 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-4" />
                      </Badge>
                      <Badge variant="outline" className="bg-white p-1 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="Paypal" className="h-4" />
                      </Badge>
                      <Badge variant="outline" className="bg-white p-1 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Amex" className="h-4" />
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Shipping and Returns Info */}
              <Card className="border-none shadow mt-4 p-4 text-sm">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="shrink-0 bg-primary/10 rounded-full p-2 h-fit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium mb-0.5">Fast Shipping</h4>
                      <p className="text-xs text-muted-foreground">Orders ship within 1-2 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="shrink-0 bg-primary/10 rounded-full p-2 h-fit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                        <path d="M2 9c-.15-1.83.5-3.5 1.85-4.85C5.2 2.8 6.87 2.15 8.7 2"></path>
                        <path d="M14 8c1.85.15 3.5.8 4.85 2.15a7.51 7.51 0 0 1 1.65 2.85"></path>
                        <path d="m8 16 4-4 4 4"></path>
                        <path d="M16 12v4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium mb-0.5">Easy Returns</h4>
                      <p className="text-xs text-muted-foreground">30-day hassle-free returns</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Frequently Bought Together */}
        <div className="mt-16">
          <ProductRecommendations 
            strategy="frequently-bought-together"
            productId={items.length > 0 ? items[0].id.toString() : undefined}
            title="Complete Your Purchase"
            limit={3}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;