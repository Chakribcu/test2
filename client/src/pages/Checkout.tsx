import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  CreditCard, 
  ShieldCheck, 
  WalletCards, 
  ChevronRight,
  Check,
  CheckCircle2,
  Lock
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

// Checkout form validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expMonth: z.string().min(1, "Month is required"),
  expYear: z.string().min(4, "Year is required"),
  cvv: z.string().min(3, "CVV is required")
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [location, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  // Generate random order number on component mount
  useEffect(() => {
    const randomOrderNum = Math.floor(10000000 + Math.random() * 90000000).toString();
    setOrderNumber(`KVR-${randomOrderNum}`);
    
    // Set page title with SEO in mind
    document.title = "Secure Checkout | KavinoRa - Complete Your Order";
  }, []);

  // Sample cart items - in a real app, this would come from a cart context or state
  const cartItems = [
    {
      id: 1,
      name: "MotionMist™ Anti-Chafing Spray",
      price: 29.99,
      quantity: 2,
      image: "https://i.imgur.com/vAr3b3G.jpeg"
    },
    {
      id: 2,
      name: "KavinoRa Wellness Tea",
      price: 24.99,
      quantity: 1,
      image: "https://i.imgur.com/kSDJFN7.jpeg"
    },
    {
      id: 3,
      name: "Mindfulness Journal",
      price: 39.95,
      quantity: 1,
      image: "https://i.imgur.com/vbRMEpZ.jpeg"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      cardName: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: ""
    }
  });

  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your order. You will receive a confirmation email shortly.",
      });
      
      // Redirect to confirmation page
      navigate("/order-confirmation");
    }, 1500);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth?redirect=checkout" />;
  }

  if (cartItems.length === 0) {
    return <Redirect to="/cart" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Checkout Progress Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute top-4 h-0.5 w-full bg-muted">
              <div className="absolute top-0 h-full bg-primary" style={{ width: "50%" }}></div>
            </div>
            <div className="relative flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center z-10">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm mt-2 font-medium">Cart</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center z-10">
                  <span className="text-xs font-bold">2</span>
                </div>
                <span className="text-sm mt-2 font-medium">Checkout</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center z-10">
                  <span className="text-xs font-bold">3</span>
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Confirmation</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Complete Your Order</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            You're just a few steps away from experiencing the benefits of KavinoRa products
          </p>
          
          {/* Order Number & Secure Message */}
          <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium">Order: </span>
              <span className="ml-1">{orderNumber}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30"></div>
            <div className="flex items-center text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main checkout form */}
          <div className="lg:col-span-2 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="shadow-sm border-none">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium mr-2">1</span>
                      Shipping Information
                    </CardTitle>
                    <CardDescription>
                      Enter your shipping details below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Zip code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            defaultValue={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="CAN">Canada</SelectItem>
                              <SelectItem value="GBR">United Kingdom</SelectItem>
                              <SelectItem value="AUS">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-none">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium mr-2">2</span>
                      Payment Method
                    </CardTitle>
                    <CardDescription>
                      All transactions are secure and encrypted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-muted/30 p-4 rounded-lg mb-6 flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">Secure Payment Processing</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your payment information is protected with industry-standard encryption
                        </p>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="credit-card">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="credit-card" className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="paypal" className="flex items-center">
                          <WalletCards className="h-4 w-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="credit-card" className="space-y-6 mt-2">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card</FormLabel>
                              <FormControl>
                                <Input placeholder="Name as it appears on card" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="xxxx xxxx xxxx xxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="expMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Month</FormLabel>
                                <Select 
                                  defaultValue={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({length: 12}, (_, i) => {
                                      const month = (i + 1).toString().padStart(2, '0');
                                      return (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="expYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Year</FormLabel>
                                <Select 
                                  defaultValue={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({length: 10}, (_, i) => {
                                      const year = (new Date().getFullYear() + i).toString();
                                      return (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} maxLength={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="paypal" className="py-4">
                        <div className="text-center p-6">
                          <p className="text-muted-foreground mb-4">Click the button below to pay with PayPal</p>
                          <Button type="button" className="w-full">
                            Continue with PayPal
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    <>Complete Order</>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </form>
            </Form>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="lg:sticky lg:top-24">
              <Card className="shadow-sm overflow-hidden border-none">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Cart Items */}
                  <div className="p-6 border-b">
                    <div className="mb-4">
                      <p className="font-medium mb-3">Items ({cartItems.length})</p>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 rounded-md overflow-hidden border bg-muted shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{item.name}</h4>
                              <div className="flex justify-between items-baseline mt-1">
                                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="link" 
                      size="sm"
                      className="p-0 h-auto text-primary text-sm flex items-center"
                      onClick={() => navigate("/cart")}
                    >
                      <ChevronRight className="h-3.5 w-3.5 rotate-180 mr-1" />
                      Edit Cart
                    </Button>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      {subtotal >= 75 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(subtotal + shipping + tax).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-6 bg-muted/30">
                  <div className="w-full space-y-4">
                    <h3 className="text-sm font-medium">Our Guarantees</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>100% Satisfaction Guarantee</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>Free Shipping on Orders Over $75</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>30-Day Easy Returns</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center text-xs text-muted-foreground mt-4">
                      <Lock className="h-3 w-3 mr-1" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}