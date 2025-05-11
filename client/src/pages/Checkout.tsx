import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { CreditCard, Check, Lock, ChevronLeft, MapPin, ShoppingBag, CircleAlert, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import OptimizedImage from "@/components/ui/optimized-image";
import { scrollToTopInstant } from "@/lib/scroll-restoration";

// Form schema with validation
const checkoutSchema = z.object({
  // Contact Information
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  
  // Shipping Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  
  // Billing Details (same as shipping by default)
  sameAsShipping: z.boolean().default(true),
  
  // Payment Information (depends on selected method)
  paymentMethod: z.enum(["credit-card", "paypal", "apple-pay"]),
  
  // Credit Card (only required if payment method is credit-card)
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expDate: z.string().optional(),
  cvv: z.string().optional(),
  
  // Terms & Marketing
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  subscribeNewsletter: z.boolean().default(false),
}).refine(
  (data) => {
    // Validation for credit card payment method
    if (data.paymentMethod === "credit-card") {
      return (
        data.cardNumber && data.cardNumber.length >= 16 &&
        data.cardName && data.cardName.length >= 2 &&
        data.expDate && data.expDate.length >= 5 &&
        data.cvv && data.cvv.length >= 3
      );
    }
    return true;
  },
  {
    message: "Please fill out all credit card information",
    path: ["paymentMethod"],
  }
);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { items, clearCart, subtotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"credit-card" | "paypal" | "apple-pay">("credit-card");
  
  useEffect(() => {
    // Scroll to the top when component mounts
    scrollToTopInstant();
    document.title = "Checkout | KavinoRa";
    
    // Redirect to cart if there are no items
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);
  
  // Calculate order total
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shipping;
  
  // SEO data for checkout page
  const seoData = {
    title: "Secure Checkout | KavinoRa",
    description: "Complete your purchase securely. KavinoRa uses industry-standard encryption to protect your personal and payment information.",
    canonicalUrl: window.location.origin + "/checkout"
  };
  
  // Initialize form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      sameAsShipping: true,
      paymentMethod: "credit-card",
      cardNumber: "",
      cardName: "",
      expDate: "",
      cvv: "",
      acceptTerms: false,
      subscribeNewsletter: false,
    },
  });
  
  // Watch for form value changes
  const paymentMethod = form.watch("paymentMethod");
  const sameAsShipping = form.watch("sameAsShipping");
  
  // Update payment tab when payment method changes
  useEffect(() => {
    setPaymentTab(paymentMethod);
  }, [paymentMethod]);
  
  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit the order to the server here
      // For demo purposes, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. We will email you an order confirmation shortly.",
        variant: "default",
      });
      
      // Redirect to order confirmation page
      navigate("/");
      
    } catch (error) {
      toast({
        title: "Error Processing Order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Layout>
      <SEOHead {...seoData} />
      <div className="container mx-auto py-10 px-4">
        {/* Checkout header with steps */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 text-muted-foreground"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span className="text-primary font-medium">Cart</span>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="font-medium">Checkout</span>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span>Confirmation</span>
          </div>
        </div>
        
        {/* Main checkout layout */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact Information Section */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subscribeNewsletter"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md pt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Keep me updated on new products, exclusive offers, and wellness tips.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Shipping Information Section */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</div>
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip / Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="sameAsShipping"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Billing address is the same as shipping address
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Payment Information Section */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <Tabs defaultValue="credit-card" value={paymentTab} onValueChange={(value) => {
                            setPaymentTab(value as any);
                            field.onChange(value);
                          }}>
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                              <TabsTrigger value="credit-card" className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Credit Card</span>
                              </TabsTrigger>
                              <TabsTrigger value="paypal">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 inline">
                                  <path fill="currentColor" d="M9.315 5.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.595.87 1.034 1.13 2.438.78 4.005-.39 1.755-1.225 3.083-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283h-1.466a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H7.54a.375.375 0 0 1-.367-.45l2.142-9.689Z"/>
                                  <path fill="currentColor" d="M3.316 7.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.594.87 1.035 1.13 2.438.78 4.006-.39 1.755-1.225 3.082-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283H6.623a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H1.54a.375.375 0 0 1-.367-.45l2.143-9.689Z" opacity=".5"/>
                                </svg>
                                PayPal
                              </TabsTrigger>
                              <TabsTrigger value="apple-pay">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 inline">
                                  <path fill="currentColor" d="m18.57 13.54-2.401-.461c-.199-.046-.313-.128-.313-.297 0-.254.341-.486.878-.486.591 0 1.017.255 1.145.761h.896c-.109-.966-.952-1.577-2.011-1.577-1.136 0-1.967.621-1.967 1.421 0 .678.405 1.082 1.195 1.221l2.394.439c.247.046.33.173.33.321 0 .276-.366.508-.952.508-.708 0-1.169-.31-1.237-.845h-.929c.084 1.018.976 1.642 2.175 1.642 1.195 0 2.034-.582 2.034-1.431 0-.662-.366-1.051-1.237-1.216Zm-6.818 1.75h1.001v-5.48h-1.001v5.48Zm-2.099-2.737v-.003c0-1.054-.691-1.869-1.697-1.869-.63 0-1.04.302-1.302.68V10.67h-.94v5.48h.94v-2.649c0-.782.494-1.308 1.172-1.308.702 0 1.106.486 1.106 1.335v2.622h.939v-2.593H9.653ZM5.05 13.41c0-1.2-1.041-2.156-2.35-2.156-1.318 0-2.35.947-2.35 2.156 0 1.2 1.041 2.147 2.35 2.147 1.318 0 2.35-.947 2.35-2.147Zm-.94.008c0 .745-.615 1.328-1.41 1.328-.794 0-1.41-.583-1.41-1.328 0-.746.606-1.336 1.41-1.336.804 0 1.41.59 1.41 1.336Zm14.881-2.57h-.904l-1.261 4.305h-.127l-1.35-4.306H14.22l1.962 5.48h.758l1.969-5.48h-.918Z"/>
                                </svg>
                                Apple Pay
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="credit-card" className="mb-0">
                              <div className="space-y-4">
                                <div className="p-4 bg-muted/40 rounded-lg text-center">
                                  <p className="text-sm text-muted-foreground">
                                    Credit card processing is currently unavailable. We're working on implementing secure payment processing. Please try alternative payment methods or check back later.
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <ShieldCheck className="h-4 w-4 text-green-500" />
                                  <p className="text-xs text-muted-foreground">Your payment information will be secure and encrypted</p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="paypal" className="flex flex-col items-center justify-center p-6 text-center h-[220px]">
                              <div className="bg-[#f5f5f7] p-4 rounded-xl mb-4">
                                <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-[#0070ba]">
                                  <path fill="currentColor" d="M9.315 5.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.595.87 1.034 1.13 2.438.78 4.005-.39 1.755-1.225 3.083-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283h-1.466a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H7.54a.375.375 0 0 1-.367-.45l2.142-9.689Z"/>
                                  <path fill="currentColor" d="M3.316 7.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.594.87 1.035 1.13 2.438.78 4.006-.39 1.755-1.225 3.082-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283H6.623a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H1.54a.375.375 0 0 1-.367-.45l2.143-9.689Z" opacity=".5"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium">Pay with PayPal</h3>
                              <p className="text-muted-foreground text-sm mt-2 mb-4">
                                You'll be redirected to PayPal to complete your purchase securely.
                              </p>
                              <Button variant="outline" className="w-full max-w-xs">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                                  <path fill="currentColor" d="M9.315 5.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.595.87 1.034 1.13 2.438.78 4.005-.39 1.755-1.225 3.083-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283h-1.466a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H7.54a.375.375 0 0 1-.367-.45l2.142-9.689Z"/>
                                  <path fill="currentColor" d="M3.316 7.335a.75.75 0 0 1 .736-.6h5.83c1.806 0 3.148.55 4.027 1.594.87 1.035 1.13 2.438.78 4.006-.39 1.755-1.225 3.082-2.395 3.966-1.16.878-2.598 1.283-4.204 1.283H6.623a.75.75 0 0 0-.736.6l-.599 2.69a.75.75 0 0 1-.736.6H1.54a.375.375 0 0 1-.367-.45l2.143-9.689Z" opacity=".5"/>
                                </svg>
                                Continue to PayPal
                              </Button>
                            </TabsContent>
                            
                            <TabsContent value="apple-pay" className="flex flex-col items-center justify-center p-6 text-center h-[220px]">
                              <div className="bg-black p-4 rounded-xl mb-4">
                                <svg viewBox="0 0 24 24" className="h-8 w-8 mx-auto text-white">
                                  <path fill="currentColor" d="m18.57 13.54-2.401-.461c-.199-.046-.313-.128-.313-.297 0-.254.341-.486.878-.486.591 0 1.017.255 1.145.761h.896c-.109-.966-.952-1.577-2.011-1.577-1.136 0-1.967.621-1.967 1.421 0 .678.405 1.082 1.195 1.221l2.394.439c.247.046.33.173.33.321 0 .276-.366.508-.952.508-.708 0-1.169-.31-1.237-.845h-.929c.084 1.018.976 1.642 2.175 1.642 1.195 0 2.034-.582 2.034-1.431 0-.662-.366-1.051-1.237-1.216Zm-6.818 1.75h1.001v-5.48h-1.001v5.48Zm-2.099-2.737v-.003c0-1.054-.691-1.869-1.697-1.869-.63 0-1.04.302-1.302.68V10.67h-.94v5.48h.94v-2.649c0-.782.494-1.308 1.172-1.308.702 0 1.106.486 1.106 1.335v2.622h.939v-2.593H9.653ZM5.05 13.41c0-1.2-1.041-2.156-2.35-2.156-1.318 0-2.35.947-2.35 2.156 0 1.2 1.041 2.147 2.35 2.147 1.318 0 2.35-.947 2.35-2.147Zm-.94.008c0 .745-.615 1.328-1.41 1.328-.794 0-1.41-.583-1.41-1.328 0-.746.606-1.336 1.41-1.336.804 0 1.41.59 1.41 1.336Zm14.881-2.57h-.904l-1.261 4.305h-.127l-1.35-4.306H14.22l1.962 5.48h.758l1.969-5.48h-.918Z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium">Pay with Apple Pay</h3>
                              <p className="text-muted-foreground text-sm mt-2 mb-4">
                                Complete your purchase quickly and securely with Apple Pay.
                              </p>
                              <Button className="w-full max-w-xs bg-black text-white hover:bg-black/90">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                                  <path fill="currentColor" d="m18.57 13.54-2.401-.461c-.199-.046-.313-.128-.313-.297 0-.254.341-.486.878-.486.591 0 1.017.255 1.145.761h.896c-.109-.966-.952-1.577-2.011-1.577-1.136 0-1.967.621-1.967 1.421 0 .678.405 1.082 1.195 1.221l2.394.439c.247.046.33.173.33.321 0 .276-.366.508-.952.508-.708 0-1.169-.31-1.237-.845h-.929c.084 1.018.976 1.642 2.175 1.642 1.195 0 2.034-.582 2.034-1.431 0-.662-.366-1.051-1.237-1.216Zm-6.818 1.75h1.001v-5.48h-1.001v5.48Zm-2.099-2.737v-.003c0-1.054-.691-1.869-1.697-1.869-.63 0-1.04.302-1.302.68V10.67h-.94v5.48h.94v-2.649c0-.782.494-1.308 1.172-1.308.702 0 1.106.486 1.106 1.335v2.622h.939v-2.593H9.653ZM5.05 13.41c0-1.2-1.041-2.156-2.35-2.156-1.318 0-2.35.947-2.35 2.156 0 1.2 1.041 2.147 2.35 2.147 1.318 0 2.35-.947 2.35-2.147Zm-.94.008c0 .745-.615 1.328-1.41 1.328-.794 0-1.41-.583-1.41-1.328 0-.746.606-1.336 1.41-1.336.804 0 1.41.59 1.41 1.336Zm14.881-2.57h-.904l-1.261 4.305h-.127l-1.35-4.306H14.22l1.962 5.48h.758l1.969-5.48h-.918Z"/>
                                </svg>
                                Pay with Apple Pay
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-xs text-muted-foreground flex items-center pt-4 border-t">
                    <Lock className="h-3 w-3 mr-1.5" />
                    All transactions are secure and encrypted. Your payment information is never stored on our servers.
                  </div>
                </CardContent>
              </Card>
              
              {/* Review & Place Order */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">4</div>
                    Review & Place Order
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-6">
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a>, <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, and <a href="/refund" className="text-primary hover:underline">Refund Policy</a>.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing Order...</>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Place Order — ${total.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary Section */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Cart Item List */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          {/* Smaller product image */}
                          <div className="w-16 h-16 rounded-md border overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full"
                              objectFit="cover"
                              loadingStrategy="lazy"
                            />
                          </div>
                          <div className="flex-grow space-y-1">
                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Price Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        {subtotal >= 75 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span>${shipping.toFixed(2)}</span>
                        )}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Shipping & Returns Information */}
                <Card className="border-none shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Free Shipping on Orders $75+</h4>
                        <p className="text-xs text-muted-foreground">
                          Most orders deliver within 3-5 business days
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-3">
                      <RefreshCcw className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">30-Day Returns</h4>
                        <p className="text-xs text-muted-foreground">
                          Not satisfied? Return products within 30 days for a full refund
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-3">
                      <CircleAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Need Help?</h4>
                        <p className="text-xs text-muted-foreground">
                          Contact our customer support at <a href="mailto:support@kavinora.com" className="text-primary hover:underline">support@kavinora.com</a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Trust Badges */}
                <div className="text-center p-4">
                  <p className="text-xs text-muted-foreground mb-3">Trusted & Secure</p>
                  <div className="flex justify-center items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm border">
                      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.9967 0H3.00333C1.34685 0 0 1.34685 0 3.00333V16.9967C0 18.6531 1.34685 20 3.00333 20H28.9967C30.6531 20 32 18.6531 32 16.9967V3.00333C32 1.34685 30.6531 0 28.9967 0Z" fill="#EBF0F3"/>
                        <path d="M15.0152 13.7383H16.9656V6.25391H15.0152V13.7383Z" fill="#0077A6"/>
                        <path d="M14.5335 10.0004C14.5335 8.95485 15.0073 7.99933 15.7704 7.38843C15.2212 6.92647 14.5058 6.65332 13.7219 6.65332C12.0105 6.65332 10.6191 8.14183 10.6191 10.0004C10.6191 11.859 12.0105 13.3475 13.7219 13.3475C14.5058 13.3475 15.2212 13.0736 15.7704 12.6124C15.0073 12.0015 14.5335 11.046 14.5335 10.0004Z" fill="#0077A6"/>
                        <path d="M21.3818 6.65332C20.5979 6.65332 19.8825 6.92647 19.334 7.38843C20.0964 7.99933 20.5702 8.95485 20.5702 10.0004C20.5702 11.046 20.0964 12.0015 19.334 12.6124C19.8825 13.0743 20.5979 13.3475 21.3818 13.3475C23.0932 13.3475 24.4846 11.859 24.4846 10.0004C24.4846 8.14183 23.0932 6.65332 21.3818 6.65332Z" fill="#0077A6"/>
                        <path d="M11.9922 15.7549H13.3934L14.0481 14.2422H17.9514L18.6061 15.7549H20.0073L16.9598 8.27051H15.0401L11.9922 15.7549Z" fill="#0077A6"/>
                        <path d="M14.4824 12.9883L16.0003 9.0125L17.5182 12.9883H14.4824Z" fill="#0077A6"/>
                        <path d="M27.1318 10.1543C27.1318 8.74323 26.1255 7.50846 24.6719 7.50846C23.2184 7.50846 22.2783 8.95592 22.2783 10.3663C22.2783 11.7766 23.4314 13.0122 24.885 13.0122C25.5789 13.0122 26.1248 12.8003 26.564 12.4542L26.1248 11.7766C25.8193 12.016 25.3139 12.2287 24.885 12.2287C24.0257 12.2287 23.3564 11.6388 23.2495 10.6826H27.0994C27.1233 10.5071 27.1318 10.3309 27.1318 10.1543ZM24.6719 8.29196C25.3396 8.29196 25.9663 8.85834 26.0732 9.89905H23.2495C23.3564 8.88273 23.9831 8.29196 24.6719 8.29196Z" fill="#0077A6"/>
                        <path d="M10.0344 13.3475V8.95592H8.22852V12.9376C8.22852 13.2094 8.22852 13.4457 8.12163 13.7175C7.90786 14.2839 7.37321 14.6096 6.80612 14.6096C6.23904 14.6096 5.70438 14.2839 5.49061 13.7175C5.38373 13.4457 5.38373 13.1094 5.38373 12.9376V8.95592H3.57788V13.3475C3.57788 13.5838 3.57788 13.82 3.68476 14.0556C4.11334 15.2897 5.10962 16 6.20659 16C6.95987 16 7.57281 15.7817 8.00139 15.4006C8.00139 15.4006 8.21516 15.2188 8.32204 15.0643V15.7549H10.0344V13.3475Z" fill="#0077A6"/>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded-md shadow-sm border">
                      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.9967 0H3.00333C1.34685 0 0 1.34685 0 3.00333V16.9967C0 18.6531 1.34685 20 3.00333 20H28.9967C30.6531 20 32 18.6531 32 16.9967V3.00333C32 1.34685 30.6531 0 28.9967 0Z" fill="#EBF0F3"/>
                        <path d="M22.5008 10.0004C22.5008 13.5902 19.5906 16.5004 16.0008 16.5004C12.411 16.5004 9.50078 13.5902 9.50078 10.0004C9.50078 6.41063 12.411 3.50043 16.0008 3.50043C19.5906 3.50043 22.5008 6.41063 22.5008 10.0004Z" fill="#FFB600"/>
                        <path d="M16.0001 6.125C14.8601 6.125 13.8773 6.64023 13.2579 7.45266C12.9563 7.85387 12.7363 8.32285 12.6245 8.83215C12.5337 9.25766 12.5 9.70402 12.5 10.1665C12.5 10.629 12.5405 11.0754 12.6245 11.5009C12.7363 12.0102 12.9563 12.4791 13.2579 12.8804C13.8773 13.6928 14.8601 14.208 16.0001 14.208C17.1401 14.208 18.1229 13.6928 18.7423 12.8804C19.0505 12.4791 19.2639 12.0102 19.3757 11.5009C19.4732 11.0754 19.5003 10.629 19.5003 10.1665C19.5003 9.70402 19.4597 9.25766 19.3757 8.83215C19.2639 8.32285 19.0505 7.85387 18.7423 7.45266C18.1229 6.64023 17.1401 6.125 16.0001 6.125Z" fill="#F7F8F9"/>
                        <path d="M13.2571 7.45266C13.8766 6.64023 14.8593 6.125 15.9993 6.125C17.1393 6.125 18.1221 6.64023 18.7415 7.45266C19.0497 7.85387 19.2631 8.32285 19.3749 8.83215C18.4295 8.56008 17.2895 8.39551 15.9993 8.39551C14.7092 8.39551 13.5692 8.56008 12.6237 8.83215C12.7356 8.32285 12.9555 7.85387 13.2571 7.45266Z" fill="#EB001B"/>
                        <path d="M15.9993 8.39551C17.2895 8.39551 18.4295 8.56008 19.3749 8.83215C19.4724 9.25766 19.4995 9.70402 19.4995 10.1665C19.4995 10.629 19.4724 11.0754 19.3749 11.5009C18.4295 11.773 17.2895 11.9375 15.9993 11.9375C14.7092 11.9375 13.5692 11.773 12.6237 11.5009C12.5397 11.0754 12.4993 10.629 12.4993 10.1665C12.4993 9.70402 12.5329 9.25766 12.6237 8.83215C13.5692 8.56008 14.7092 8.39551 15.9993 8.39551Z" fill="#F79E1B"/>
                        <path d="M12.6245 11.5004C13.5699 11.7725 14.71 11.937 16.0001 11.937C17.2902 11.937 18.4303 11.7725 19.3757 11.5004C19.2639 12.0097 19.0506 12.4787 18.7424 12.8799C18.1229 13.6923 17.1401 14.2075 16.0001 14.2075C14.8601 14.2075 13.8773 13.6923 13.2579 12.8799C12.9563 12.4787 12.7363 12.0097 12.6245 11.5004Z" fill="#00579F"/>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded-md shadow-sm border">
                      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.9967 0H3.00333C1.34685 0 0 1.34685 0 3.00333V16.9967C0 18.6531 1.34685 20 3.00333 20H28.9967C30.6531 20 32 18.6531 32 16.9967V3.00333C32 1.34685 30.6531 0 28.9967 0Z" fill="#EBF0F3"/>
                        <path d="M11.9668 13.4955L12.908 7.875H14.8281L13.8869 13.4955H11.9668Z" fill="#3C58BF"/>
                        <path d="M11.9668 13.4955L13.1285 7.875H14.8281L13.8869 13.4955H11.9668Z" fill="#293688"/>
                        <path d="M20.2318 7.93262C19.8551 7.7819 19.2711 7.61523 18.5455 7.61523C16.6587 7.61523 15.3555 8.55637 15.3467 9.9446C15.3291 10.9462 16.2791 11.4989 16.9959 11.8419C17.7303 12.1936 17.9742 12.4168 17.9742 12.7246C17.9654 13.2070 17.3638 13.4217 16.7973 13.4217C16.0013 13.4217 15.5806 13.3026 14.9086 13.0203L14.6208 12.8836L14.3154 14.2063C14.7625 14.4183 15.5982 14.6065 16.4659 14.6155C18.4756 14.6155 19.7523 13.6919 19.7699 12.1909C19.7787 11.4018 19.2975 10.7984 18.2094 10.2837C17.5454 9.95898 17.1422 9.74531 17.1422 9.41023C17.1511 9.10315 17.5014 8.78641 18.3252 8.78641C19.0254 8.77704 19.5304 8.93434 19.9157 9.09164L20.1138 9.19331L20.4193 7.93262H20.2318Z" fill="#3C58BF"/>
                        <path d="M20.2318 7.93262C19.8551 7.7819 19.2711 7.61523 18.5455 7.61523C16.6587 7.61523 15.5367 8.55637 15.5367 9.9446C15.5191 10.9462 16.2791 11.4989 16.9959 11.8419C17.7303 12.1936 17.9742 12.4168 17.9742 12.7246C17.9654 13.2070 17.3638 13.4217 16.7973 13.4217C16.0013 13.4217 15.5806 13.3026 14.9086 13.0203L14.6208 12.8836L14.3154 14.2063C14.7625 14.4183 15.5982 14.6065 16.4659 14.6155C18.4756 14.6155 19.7523 13.6919 19.7699 12.1909C19.7787 11.4018 19.2975 10.7984 18.2094 10.2837C17.5454 9.95898 17.1422 9.74531 17.1422 9.41023C17.1511 9.10315 17.5014 8.78641 18.3252 8.78641C19.0254 8.77704 19.5304 8.93434 19.9157 9.09164L20.1138 9.19331L20.4193 7.93262H20.2318Z" fill="#293688"/>
                        <path d="M22.2592 7.875C21.8122 7.875 21.4883 7.90219 21.2815 8.27893L18.4766 13.4954H20.3897L20.7569 12.5011H23.1208L23.3363 13.4954H24.9933L23.5233 7.875H22.2592ZM21.2375 11.2962C21.4091 10.8605 21.9004 9.54815 21.9004 9.54815C21.8916 9.55752 22.0439 9.17141 22.132 8.93148L22.2415 9.49296C22.2415 9.49296 22.5645 10.8699 22.6439 11.2962H21.2375Z" fill="#3C58BF"/>
                        <path d="M22.5823 7.875C22.1353 7.875 21.8113 7.90219 21.6046 8.27893L18.2695 13.4954H20.1826L20.5499 12.5011H22.9138L23.1293 13.4954H24.7863L23.3162 7.875H22.5823ZM21.2375 11.2962C21.4443 10.7949 21.9004 9.54815 21.9004 9.54815C21.8916 9.55752 22.0439 9.17141 22.132 8.93148L22.2415 9.49296C22.2415 9.49296 22.5645 10.8699 22.6439 11.2962H21.2375Z" fill="#293688"/>
                        <path d="M23.2461 5.625C23.2461 5.625 23.029 5.36006 22.5996 5.36006H9.21875L9.27739 5.59999C9.27739 5.59999 11.4061 6.14147 13.376 8.10541C15.0507 9.77351 15.5142 11.4884 15.5142 11.4884L16.606 8.12415L17.0531 6.66093H23.2461V5.625Z" fill="#FFBC00"/>
                        <path d="M9.2207 5.36006C9.2207 5.36006 14.7793 6.84452 18.1699 10.5873L17.4697 6.8089C17.4697 6.8089 17.2629 5.56693 16.1711 5.36006H9.2207Z" fill="#F7981D"/>
                        <path d="M7.3125 13.536L7.37993 13.3292L7.16626 12.5682C7.16626 12.5682 9.41823 13.0003 11.5381 12.0921C13.8493 11.1058 15.5414 9.6895 15.5414 9.6895L16.6508 5.62488L17.1066 7.87571C17.1066 7.87571 19.3059 10.541 19.2442 13.4919L7.3125 13.536Z" fill="#F7981D"/>
                        <path d="M8.2207 13.5262C8.2207 13.5262 8.44374 13.5999 9.03288 13.5999C9.62201 13.5999 15.542 13.6086 15.542 13.6086C15.542 13.6086 17.3851 11.1246 17.6698 9.13867L18.3965 13.291C18.3965 13.291 15.2805 15.5253 8.2207 13.5262Z" fill="#FFBC00"/>
                        <path d="M7.94141 14.2061L8.01822 13.7237C8.01822 13.7237 10.2176 14.5128 12.765 14.1642C15.3125 13.8156 17.1293 13.0984 17.1293 13.0984L17.5938 14.3778C17.5938 14.3778 15.0727 15.7537 11.9492 15.7537C8.82568 15.7537 7.94141 14.2061 7.94141 14.2061Z" fill="#D97B16"/>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded-md shadow-sm border">
                      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.9967 0H3.00333C1.34685 0 0 1.34685 0 3.00333V16.9967C0 18.6531 1.34685 20 3.00333 20H28.9967C30.6531 20 32 18.6531 32 16.9967V3.00333C32 1.34685 30.6531 0 28.9967 0Z" fill="#EBF0F3"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.5312 13.5781H14.8438L16.4688 7.03125H13.1562L11.5312 13.5781Z" fill="#253B80"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.4688 7.03125H17.4062C17.1979 7.03125 17.0208 7.17706 16.9792 7.38544L15.6562 13.0938V13.1562C15.6562 13.3854 15.8333 13.5729 16.0729 13.5729H17.5625C17.7708 13.5729 17.9479 13.4271 17.9896 13.2188L18.2917 11.7396H19.9688C21.6562 11.7396 22.7917 10.8021 23.1562 9.17706C23.3333 8.50008 23.2708 7.94794 23 7.54169C22.7083 7.21877 22.1875 7.03125 20.4688 7.03125Z" fill="#179BD7"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.2917 11.7396L19.9688 11.7396C21.6562 11.7396 22.7917 10.8021 23.1562 9.17706C23.3333 8.50008 23.2708 7.94794 23 7.54169C22.7083 7.21877 22.1875 7.03125 20.4688 7.03125H17.4062C17.1979 7.03125 17.0208 7.17706 16.9792 7.38544L15.6562 13.0938V13.1562C15.6562 13.3854 15.8333 13.5729 16.0729 13.5729H17.5625C17.7708 13.5729 17.9479 13.4271 17.9896 13.2188L18.2917 11.7396ZM18.5 10.6354H17.25L17.7292 8.13544H18.9271C19.6771 8.13544 20.0521 8.3646 19.9896 8.9896C19.9062 9.89585 19.3021 10.6354 18.5 10.6354Z" fill="#179BD7"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.5 10.6354H17.25L17.7292 8.13544H18.9271C19.6771 8.13544 20.0521 8.3646 19.9896 8.9896C19.9062 9.89585 19.3021 10.6354 18.5 10.6354Z" fill="#222D65"/>
                        <path d="M9.39062 7.03125H6.20312C6.07292 7.03125 5.94271 7.11456 5.91667 7.24481L4.52083 13.3021V13.3333C4.52083 13.4688 4.63542 13.5833 4.77083 13.5833H6.14062C6.27083 13.5833 6.40104 13.5 6.42708 13.3698L6.75 11.7396H8.03125C9.71875 11.7396 10.8542 10.8021 11.2188 9.17706C11.3958 8.5 11.3333 7.94792 11.0625 7.54167C10.7396 7.21875 10.25 7.03125 9.39062 7.03125Z" fill="#253B80"/>
                        <path d="M9.39062 7.03125H6.20312C6.07292 7.03125 5.94271 7.11456 5.91667 7.24481L4.52083 13.3021V13.3333C4.52083 13.4688 4.63542 13.5833 4.77083 13.5833H6.14062C6.27083 13.5833 6.40104 13.5 6.42708 13.3698L6.75 11.7396H8.03125C9.71875 11.7396 10.8542 10.8021 11.2188 9.17706C11.3958 8.5 11.3333 7.94792 11.0625 7.54167C10.7396 7.21875 10.25 7.03125 9.39062 7.03125ZM7.40625 10.6354H6.15625L6.63542 8.13544H7.83333C8.58333 8.13544 8.95833 8.3646 8.89583 8.9896C8.83333 9.89585 8.20833 10.6354 7.40625 10.6354Z" fill="#179BD7"/>
                        <path d="M7.40625 10.6354H6.15625L6.63542 8.13544H7.83333C8.58333 8.13544 8.95833 8.3646 8.89583 8.9896C8.83333 9.89585 8.20833 10.6354 7.40625 10.6354Z" fill="#222D65"/>
                        <path d="M21.4845 7.67706C21.4427 7.63544 21.401 7.59379 21.3594 7.55212C21.276 7.48962 21.1927 7.42712 21.0886 7.38544C20.7032 7.21877 20.151 7.13544 19.4427 7.13544H16.5885C16.4844 7.13544 16.3802 7.17706 16.3177 7.24481C16.2344 7.32814 16.1927 7.43752 16.1719 7.56773L15.6146 10.7396L15.5938 10.8229L15.026 13.3542C15.0052 13.4271 15.026 13.5 15.0469 13.5417C15.0886 13.6042 15.1302 13.6458 15.1927 13.6458H16.6823C16.7864 13.6458 16.8906 13.5833 16.9323 13.5208C16.9739 13.4583 17.0156 13.3542 17.0156 13.2604L17.4427 11.1354V11.0729C17.4427 10.9792 17.526 10.8854 17.6094 10.8229C17.6719 10.7812 17.7552 10.7396 17.8385 10.7396H18.5469C20.0886 10.7396 21.1302 9.86458 21.4531 8.3646V8.32293C21.6406 7.96877 21.5781 7.80208 21.4845 7.67706Z" fill="#253B80"/>
                        <path d="M10.4322 7.67706C10.3905 7.63544 10.3489 7.59379 10.3072 7.55212C10.2239 7.48962 10.1406 7.42712 10.0364 7.38544C9.65104 7.21877 9.09894 7.13544 8.39062 7.13544H5.5364C5.43229 7.13544 5.32812 7.17706 5.26562 7.24481C5.18229 7.32814 5.14062 7.43752 5.11979 7.56773L4.56249 10.7396L4.54166 10.8229L3.9739 13.3542C3.95307 13.4271 3.9739 13.5 3.99473 13.5417C4.0364 13.6042 4.07807 13.6458 4.14057 13.6458H5.60416C5.70832 13.6458 5.81249 13.5833 5.85416 13.5208C5.9739 13.3542 5.95308 13.3021 5.95308 13.3021L6.38019 11.1354V11.0729C6.38019 10.9792 6.46353 10.8854 6.54686 10.8229C6.60936 10.7812 6.6927 10.7396 6.77603 10.7396H7.48436C9.02603 10.7396 10.0676 9.86458 10.3905 8.3646V8.32293C10.5781 7.96877 10.5364 7.80208 10.4322 7.67706Z" fill="#179BD7"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.1771 7.05212C26.6458 6.51044 25.724 6.25 24.4375 6.25H20.2604C20.0104 6.25 19.7812 6.44792 19.7396 6.70835L18.2396 13.2813C18.2188 13.4481 18.3438 13.5834 18.5104 13.5834H20.4792C20.7396 13.5834 20.9688 13.3959 21.0104 13.1355L21.3646 11.3542C21.3855 11.0938 21.6146 10.9063 21.8646 10.9063H22.6979C25.0625 10.9063 26.6458 9.5313 27.0208 7.26046C27.0417 7.1563 27.0625 7.07293 27.0625 6.96877C27.0625 6.9688 27.0625 6.96872 27.0625 6.96877C27.1042 6.62502 27.0208 6.30212 26.8333 6.05212C26.9583 6.36462 26.9792 6.69793 26.8125 7.05212H27.1771Z" fill="#31A5E7"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M26.8125 7.05212C26.4375 9.32293 24.8542 10.6979 22.4896 10.6979H21.6563C21.4063 10.6979 21.1771 10.8854 21.1354 11.1458L20.7813 12.9271C20.7396 13.1875 20.5104 13.375 20.25 13.375H18.2813C18.1354 13.375 18.0104 13.2396 18.0313 13.0729L19.5313 6.5C19.5521 6.33337 19.7021 6.21877 19.8688 6.21877H24.0459C25.3334 6.21877 26.2553 6.47918 26.7865 7.02085C26.9532 6.6667 26.9323 6.33337 26.8073 6.02085C26.5781 5.6667 26.1979 5.39587 25.7084 5.21043C25.1771 5 24.5313 4.9375 23.7813 4.9375H19.5313C19.2709 4.9375 19.0417 5.125 18.9896 5.38543L17.3855 12.5C17.3334 12.7188 17.3855 12.9375 17.5209 13.0938C17.6563 13.25 17.8334 13.3334 18.0313 13.3334H20.25C20.5104 13.3334 20.7396 13.1459 20.7813 12.8855L21.1563 11.1042C21.1979 10.8438 21.4271 10.6563 21.6771 10.6563H22.5104C24.875 10.6563 26.4584 9.28127 26.8334 7.01043C26.8543 6.9063 26.875 6.82293 26.875 6.71877C26.875 6.8125 26.8543 6.92712 26.8125 7.05212Z" fill="#253B80"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}