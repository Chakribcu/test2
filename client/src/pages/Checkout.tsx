import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
import { Loader2, CreditCard, WalletCards } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

  // Sample cart items - in a real app, this would come from a cart context or state
  const cartItems = [
    {
      id: 1,
      name: "KavinoRa Wellness Tea",
      price: 24.99,
      quantity: 2,
      image: "/products/tea.jpg"
    },
    {
      id: 2,
      name: "Mindfulness Journal",
      price: 79.97,
      quantity: 1,
      image: "/products/journal.jpg"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 4.99;
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
      <div className="container mx-auto py-8 px-4 lg:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="credit-card">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="credit-card" className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="paypal" className="flex items-center">
                          <WalletCards className="h-4 w-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="credit-card" className="space-y-4 mt-4">
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
                                <FormLabel>Month</FormLabel>
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
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                      <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                        {month.toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
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
                                <FormLabel>Year</FormLabel>
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
                                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
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
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="paypal" className="mt-4">
                        <div className="text-center p-4">
                          <p className="mb-4">You will be redirected to PayPal to complete your payment</p>
                          <Button type="button" className="w-full">Continue with PayPal</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between items-center mt-8">
                  <Button variant="outline" type="button" onClick={() => navigate("/cart")}>
                    Back to Cart
                  </Button>
                  
                  <Button type="submit" className="min-w-[150px]" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                        [Image]
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>${shipping.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Tax</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-semibold text-lg">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
                <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}