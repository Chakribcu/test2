import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  Truck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    document.title = "Your Cart | KavinoRa";
  }, []);

  // In a real app, this would come from context or state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "MotionMist™ Anti-Chafing Spray",
      price: 29.99,
      quantity: 2,
      image: "https://i.imgur.com/vAr3b3G.jpeg",
    },
    {
      id: 2,
      name: "KavinoRa Wellness Tea",
      price: 24.99,
      quantity: 1,
      image: "https://i.imgur.com/kSDJFN7.jpeg",
    },
    {
      id: 3,
      name: "Mindfulness Journal",
      price: 39.95,
      quantity: 1,
      image: "https://i.imgur.com/vbRMEpZ.jpeg",
    }
  ]);

  const increaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Items in Your Cart ({cartItems.length})</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 bg-muted rounded overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h3 className="font-medium text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => decreaseQuantity(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-3 w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => increaseQuantity(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/product")}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setCartItems([])}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-6"
                    onClick={() => navigate("/checkout")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      We accept all major credit cards
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Badge variant="outline">Visa</Badge>
                      <Badge variant="outline">Mastercard</Badge>
                      <Badge variant="outline">PayPal</Badge>
                      <Badge variant="outline">Apple Pay</Badge>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <div className="bg-muted/40 p-3 rounded-lg w-full">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Free shipping on orders over $75
                        </h4>
                        {subtotal < 75 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Add ${(75 - subtotal).toFixed(2)} more to qualify for free shipping!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="text-center py-12 px-4">
            <CardContent>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <ShoppingCart className="h-10 w-10 text-primary/60" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Browse our collection to find the perfect wellness products for you.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/product")}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cart;