import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  FastForward, 
  CheckCircle, 
  Check, 
  Zap, 
  Shield, 
  Clock, 
  Plus,
  ShoppingBag
} from "lucide-react";

interface CheckoutItem {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  isExpedited: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

export function ImprovedCheckout() {
  const { user } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [useExpressCheckout, setUseExpressCheckout] = useState(false);
  
  // Sample cart data
  const cartItems: CheckoutItem[] = [
    {
      id: "prod-1",
      name: "Cloud Walker Pro",
      size: "US 10",
      color: "Slate Gray",
      price: 149.99,
      quantity: 1,
      image: "https://placehold.co/200x200/e4e4e7/71717a?text=Shoes"
    },
    {
      id: "prod-2",
      name: "Wellness Insoles",
      size: "One Size",
      color: "Blue",
      price: 39.99,
      quantity: 1,
      image: "https://placehold.co/200x200/e4e4e7/71717a?text=Insoles"
    }
  ];
  
  // Shipping options
  const shippingOptions: ShippingOption[] = [
    {
      id: "ship-standard",
      name: "Standard Shipping",
      description: "Standard shipping with tracking",
      price: 5.99,
      estimatedDelivery: "5-7 business days",
      isExpedited: false
    },
    {
      id: "ship-express",
      name: "Express Shipping",
      description: "Priority shipping with tracking",
      price: 12.99,
      estimatedDelivery: "2-3 business days",
      isExpedited: true
    },
    {
      id: "ship-next-day",
      name: "Next Day Delivery",
      description: "Get it by tomorrow",
      price: 24.99,
      estimatedDelivery: "Next business day",
      isExpedited: true
    }
  ];
  
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "payment-1",
      type: "card",
      name: "Visa ending in 4242",
      lastFour: "4242",
      expiryDate: "04/25",
      isDefault: true
    },
    {
      id: "payment-2",
      type: "paypal",
      name: "PayPal"
    },
    {
      id: "payment-3",
      type: "applepay",
      name: "Apple Pay"
    },
    {
      id: "payment-4",
      type: "googlepay",
      name: "Google Pay"
    }
  ];
  
  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping ? 
    shippingOptions.find(option => option.id === selectedShipping)?.price || 0 : 0;
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;
  
  // Handle order placement
  const handlePlaceOrder = () => {
    // In a real app, this would send the order to the backend
    alert("Your order has been placed successfully!");
  };
  
  const handleExpressCheckout = () => {
    setUseExpressCheckout(true);
    setCheckoutStep('review');
    // Auto-select defaults
    setSelectedShipping(shippingOptions[0].id);
    setSelectedPayment(paymentMethods.find(method => method.isDefault)?.id || paymentMethods[0].id);
  };
  
  const PaymentIcon = ({ type }: { type: PaymentMethod['type'] }) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return <div className="text-xs font-bold text-[#0070ba]">PayPal</div>;
      case 'applepay':
        return <div className="text-xs font-bold">Apple Pay</div>;
      case 'googlepay':
        return <div className="text-xs font-bold">Google Pay</div>;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h2>
        <p className="text-muted-foreground mb-8">Complete your purchase securely</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main checkout flow */}
          <div className="w-full lg:w-2/3">
            {/* Express checkout banner */}
            {!useExpressCheckout && checkoutStep === 'cart' && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Express Checkout</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Skip the multiple steps and complete your order with saved preferences
                </p>
                <Button 
                  className="w-full btn-primary"
                  onClick={handleExpressCheckout}
                >
                  <FastForward className="h-4 w-4 mr-2" /> One-Click Checkout
                </Button>
              </div>
            )}
            
            {/* Checkout steps */}
            {!useExpressCheckout ? (
              <div>
                <div className="mb-6 border-b border-border">
                  <div className="flex justify-between relative">
                    <div 
                      className={`pb-3 px-4 font-medium text-sm relative cursor-pointer ${
                        checkoutStep === 'cart' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setCheckoutStep('cart')}
                    >
                      Cart
                    </div>
                    <div 
                      className={`pb-3 px-4 font-medium text-sm relative cursor-pointer ${
                        checkoutStep === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setCheckoutStep('shipping')}
                    >
                      Shipping
                    </div>
                    <div 
                      className={`pb-3 px-4 font-medium text-sm relative cursor-pointer ${
                        checkoutStep === 'payment' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setCheckoutStep('payment')}
                    >
                      Payment
                    </div>
                    <div 
                      className={`pb-3 px-4 font-medium text-sm relative cursor-pointer ${
                        checkoutStep === 'review' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setCheckoutStep('review')}
                    >
                      Review
                    </div>
                  </div>
                </div>
                
                {/* Cart step */}
                {checkoutStep === 'cart' && (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center border-b border-border pb-4">
                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex text-xs text-muted-foreground mt-1 space-x-4">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                              <button className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">-</button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">+</button>
                            </div>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline">
                        Continue Shopping
                      </Button>
                      <Button onClick={() => setCheckoutStep('shipping')}>
                        Continue to Shipping
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Shipping step */}
                {checkoutStep === 'shipping' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Shipping Address</h3>
                      <div className="bg-card p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">123 Main St, Apt 4B</p>
                            <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                            <p className="text-sm text-muted-foreground">United States</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Shipping Method</h3>
                      <div className="space-y-3">
                        {shippingOptions.map(option => (
                          <div
                            key={option.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedShipping === option.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedShipping(option.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  selectedShipping === option.id ? 'border-primary' : 'border-muted-foreground'
                                }`}>
                                  {selectedShipping === option.id && (
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{option.name}</p>
                                  <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${option.price.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">{option.estimatedDelivery}</p>
                              </div>
                            </div>
                            {option.isExpedited && (
                              <div className="mt-2 ml-8 flex items-center">
                                <FastForward className="h-3 w-3 text-primary mr-1" />
                                <span className="text-xs text-primary">Expedited</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCheckoutStep('cart')}>
                        Back to Cart
                      </Button>
                      <Button 
                        onClick={() => setCheckoutStep('payment')}
                        disabled={!selectedShipping}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Payment step */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <Tabs defaultValue="saved" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="saved">Saved Methods</TabsTrigger>
                          <TabsTrigger value="new">New Payment</TabsTrigger>
                        </TabsList>
                        <TabsContent value="saved" className="py-4 space-y-3">
                          {paymentMethods.map(method => (
                            <div
                              key={method.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedPayment === method.id 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedPayment(method.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                    selectedPayment === method.id ? 'border-primary' : 'border-muted-foreground'
                                  }`}>
                                    {selectedPayment === method.id && (
                                      <div className="w-3 h-3 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <div className="bg-muted/50 w-10 h-6 rounded flex items-center justify-center mr-3">
                                      <PaymentIcon type={method.type} />
                                    </div>
                                    <div>
                                      <p className="font-medium">{method.name}</p>
                                      {method.expiryDate && (
                                        <p className="text-xs text-muted-foreground">Expires {method.expiryDate}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {method.isDefault && (
                                  <span className="text-xs bg-muted px-2 py-1 rounded">Default</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="new" className="py-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Add New Payment Method</CardTitle>
                              <CardDescription>
                                Enter your card details to save a new payment method
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <form className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Name on Card</label>
                                  <input
                                    type="text"
                                    className="input-apple w-full"
                                    placeholder="John Doe"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Card Number</label>
                                  <input
                                    type="text"
                                    className="input-apple w-full"
                                    placeholder="4242 4242 4242 4242"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                    <input
                                      type="text"
                                      className="input-apple w-full"
                                      placeholder="MM/YY"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">CVC</label>
                                    <input
                                      type="text"
                                      className="input-apple w-full"
                                      placeholder="123"
                                    />
                                  </div>
                                </div>
                              </form>
                            </CardContent>
                            <CardFooter>
                              <Button className="w-full">Save Card</Button>
                            </CardFooter>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCheckoutStep('shipping')}>
                        Back to Shipping
                      </Button>
                      <Button 
                        onClick={() => setCheckoutStep('review')}
                        disabled={!selectedPayment}
                      >
                        Review Order
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Review step */}
                {checkoutStep === 'review' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Order Summary
                        </h3>
                        <div className="space-y-3">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-background rounded-md overflow-hidden mr-3">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.size} • {item.color} • Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Shipping Details
                        </h3>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">123 Main St, Apt 4B</p>
                            <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                            <p className="text-sm text-muted-foreground">United States</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {shippingOptions.find(option => option.id === selectedShipping)?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {shippingOptions.find(option => option.id === selectedShipping)?.estimatedDelivery}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          Payment Method
                        </h3>
                        <div className="flex items-center">
                          <div className="bg-background w-10 h-6 rounded flex items-center justify-center mr-3">
                            <PaymentIcon 
                              type={paymentMethods.find(method => method.id === selectedPayment)?.type || 'card'} 
                            />
                          </div>
                          <p className="font-medium">
                            {paymentMethods.find(method => method.id === selectedPayment)?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCheckoutStep('payment')}>
                        Back to Payment
                      </Button>
                      <Button 
                        className="btn-primary"
                        onClick={handlePlaceOrder}
                      >
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Express checkout review
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Express Checkout</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Using your saved shipping address and payment method for a faster checkout
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Order summary (condensed) */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Order Summary
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setUseExpressCheckout(false);
                        setCheckoutStep('cart');
                      }}>
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-background rounded-md overflow-hidden mr-3">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-medium">
                              {item.name} ({item.quantity})
                            </p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping & Payment (condensed) */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Shipping & Payment</h3>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setUseExpressCheckout(false);
                        setCheckoutStep('shipping');
                      }}>
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Shipping To:</p>
                        <p className="text-sm">John Doe</p>
                        <p className="text-xs text-muted-foreground">123 Main St, NY 10001</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Payment Method:</p>
                        <div className="flex items-center">
                          <div className="bg-background w-8 h-5 rounded flex items-center justify-center mr-2">
                            <PaymentIcon 
                              type={paymentMethods.find(method => method.isDefault)?.type || 'card'} 
                            />
                          </div>
                          <p className="text-sm">
                            {paymentMethods.find(method => method.isDefault)?.name}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Shipping Method:</p>
                        <p className="text-sm">
                          {shippingOptions[0].name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shippingOptions[0].estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full btn-primary py-6"
                    onClick={handlePlaceOrder}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Complete Purchase (${total.toFixed(2)})
                  </Button>
                  
                  <div className="mt-3 text-center">
                    <button 
                      className="text-sm text-primary hover:underline"
                      onClick={() => {
                        setUseExpressCheckout(false);
                        setCheckoutStep('cart');
                      }}
                    >
                      Switch to Standard Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order summary sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {selectedShipping ? (
                    <span>${shippingCost.toFixed(2)}</span>
                  ) : (
                    <span className="text-muted-foreground">Calculated next</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg flex items-start">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">
                      All transactions are secure and encrypted with 256-bit SSL
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg flex items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">30-Day Returns</p>
                    <p className="text-xs text-muted-foreground">
                      Not the right fit? Return within 30 days for a full refund
                    </p>
                  </div>
                </div>
                
                {checkoutStep === 'cart' && !useExpressCheckout && (
                  <div>
                    <Button 
                      className="w-full btn-primary"
                      onClick={() => setCheckoutStep('shipping')}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}