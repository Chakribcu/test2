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
  Truck,
  Shield,
  RefreshCcw,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="container mx-auto py-16 px-4">
        {/* Hero section for cart page */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items before proceeding to checkout
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm">
                <CardHeader className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Items in Your Cart ({cartItems.length})</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setCartItems([])}
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
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-28 h-28 bg-background rounded-xl overflow-hidden shadow-sm border shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h3 className="font-semibold text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="font-bold text-primary text-lg">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Item ID and SKU */}
                          <p className="text-xs text-muted-foreground mb-4">
                            Item #KVR{item.id}00{item.id} 
                          </p>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-md overflow-hidden">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() => decreaseQuantity(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-4 py-2 w-10 text-center border-x">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() => increaseQuantity(item.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <span className="font-semibold text-base">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
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
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                      <span>30-Day Returns</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-3.5 w-3.5 mr-1.5" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Recently Viewed / You Might Also Like */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Show other products not in cart */}
                  {[
                    {
                      id: 4,
                      name: "Recovery Balm",
                      price: 19.99,
                      image: "https://i.imgur.com/vbRMEpZ.jpeg"
                    },
                    {
                      id: 5,
                      name: "Bamboo Water Bottle",
                      price: 34.99,
                      image: "https://i.imgur.com/kSDJFN7.jpeg"
                    },
                    {
                      id: 6,
                      name: "Yoga Mat",
                      price: 49.99,
                      image: "https://i.imgur.com/vAr3b3G.jpeg"
                    }
                  ].map(product => (
                    <Card key={product.id} className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">${product.price}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCartItems([
                                ...cartItems,
                                {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  image: product.image
                                }
                              ]);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
                        <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
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
                            ${(subtotal >= 75 ? subtotal : total).toFixed(2)}
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
                    
                    <div className="mt-6 text-center">
                      <div className="flex justify-center items-center gap-1.5 mb-3">
                        <Badge variant="outline" className="bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" className="h-4">
                            <g fill="none">
                              <rect width="28" height="16" fill="#1A1F71" rx="2"/>
                              <path fill="#F7B600" d="M11.252 12.511H9.265V4.301h1.987v8.21Zm-4.318-5.156c-.67-.327-1.302-.436-1.715-.436-.436 0-.709.109-.709.327 0 .219.273.273.764.4.982.218 1.418.62 1.418 1.31 0 1-1.091 1.637-2.564 1.637-.764 0-1.418-.109-2.236-.491l.291-1.31c.709.382 1.254.491 1.945.491.49 0 .763-.109.763-.382 0-.164-.164-.273-.709-.4-1.236-.328-1.491-.764-1.473-1.364 0-.928.928-1.528 2.4-1.528.764 0 1.49.182 1.927.4l-.102 1.346Zm5.1-3.054 1.236 5.865.164.782h-.946c-.164 0-.273-.11-.273-.219l-.219-1.273h-1.927l-.437 1.273c-.54.164-.163.219-.327.219h-1.4l2.073-5.838c.109-.273.273-.491.71-.491.709 0 1.09.218 1.345.683Zm-.273 3.929-.8-3.874h-.055l-1.09 3.874h1.945Zm17.193-.874c0 3.164-2.509 5.646-5.701 5.646-3.193 0-5.701-2.482-5.701-5.646S20.241 1.91 24.252 1.91c3.193 0 5.702 2.482 5.702 5.646Zm-9.2 0c0 1.964 1.564 3.52 3.5 3.52 1.927 0 3.491-1.556 3.491-3.52 0-1.964-1.564-3.52-3.5-3.52-1.927 0-3.491 1.556-3.491 3.52Z"/>
                            </g>
                          </svg>
                        </Badge>
                        <Badge variant="outline" className="bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" className="h-4">
                            <g fill="none" fillRule="evenodd">
                              <rect width="28" height="16" fill="#FFF" rx="2"/>
                              <path fill="#FF5F00" d="M10.599 3.368h6.803v9.264h-6.803z"/>
                              <path fill="#EB001B" d="M11.098 8c0-1.88.88-3.56 2.25-4.632A5.984 5.984 0 0 0 8 8c0 3.312 2.688 6 6 6a5.99 5.99 0 0 0 5.348-3.368A5.998 5.998 0 0 1 11.098 8Z"/>
                              <path fill="#F79E1B" d="M20 8c0 3.312-2.688 6-6 6a5.99 5.99 0 0 1-5.348-3.368A5.998 5.998 0 0 0 16.902 8c0-1.88-.88-3.56-2.25-4.632A5.984 5.984 0 0 1 20 8Z"/>
                            </g>
                          </svg>
                        </Badge>
                        <Badge variant="outline" className="bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" className="h-4">
                            <g fill="none">
                              <rect width="28" height="16" fill="#FFF" rx="2"/>
                              <path fill="#003087" d="M8.813 6.906c-.193 0-.367.005-.53.017H8.28c-.015 0-.022 0-.037.004-.237.018-.284.217-.284.36v.708c0 .06.042.111.112.111h.514c.209 0 .382-.005.538-.03.156-.025.288-.078.383-.147.092-.067.158-.146.198-.241.042-.097.063-.206.063-.328 0-.132-.027-.24-.081-.333a.655.655 0 0 0-.22-.214 1.056 1.056 0 0 0-.327-.112 2.572 2.572 0 0 0-.363-.025v.24Zm-.47-1.23h.74c.203 0 .37.005.505.013.134.009.273.027.418.063a.955.955 0 0 1 .65.498c.07.13.105.285.105.463 0 .19-.029.354-.086.49a.907.907 0 0 1-.262.352c-.117.096-.255.168-.413.214-.158.047-.349.07-.572.07h-.46v1.448c0 .06-.042.111-.114.111h-.624c-.063 0-.105-.051-.105-.11V5.787c0-.067.054-.111.112-.111h.106ZM12.713 8.325c.027-.025.066-.035.117-.035h.632c.061 0 .112.04.112.11v.59c0 .066-.5.111-.112.111h-.625c-.063 0-.105-.045-.105-.11v-.586c0-.03.005-.06.02-.08h-.04Zm-.014 1.21c.027-.027.066-.04.118-.04h.64c.062 0 .104.051.104.112v2.22c0 .06-.042.111-.104.111h-.64c-.063 0-.105-.051-.105-.111V9.62c0-.03.004-.06.018-.085h-.03Zm1.91-1.21c.026-.025.065-.035.117-.035h.632c.06 0 .111.04.111.11v2.766c0 .06-.05.111-.111.111h-.632c-.063 0-.105-.051-.105-.111v-2.76c0-.03.004-.06.018-.08h-.03Zm1.896 1.21c.026-.027.065-.04.117-.04h.632c.061 0 .112.051.112.112v.204c.127-.118.264-.204.406-.258.15-.054.32-.09.512-.09.33 0 .61.085.841.257a.903.903 0 0 1 .367.767v1.34c0 .06-.042.111-.105.111h-.641c-.063 0-.113-.051-.113-.111v-1.12c0-.158-.034-.277-.099-.358-.066-.082-.172-.123-.323-.123-.09 0-.175.019-.252.054a.717.717 0 0 0-.3.291v1.256c0 .06-.042.111-.112.111H16.5c-.062 0-.105-.051-.105-.111V9.62c0-.03.004-.06.018-.085h-.03l.123.04Zm5.125-.158a1.016 1.016 0 0 0-.403-.054c-.1 0-.18.016-.244.045a.226.226 0 0 0-.14.221c0 .05.023.09.064.126.042.035.119.07.236.106l.24.073c.204.057.35.144.44.258.09.114.136.25.136.413 0 .24-.095.426-.288.562-.193.138-.455.205-.784.205-.194 0-.366-.017-.515-.05a3.437 3.437 0 0 1-.33-.094l-.01-.004a.107.107 0 0 1-.072-.107v-.53c0-.03.01-.057.033-.076.02-.017.044-.017.07-.004l.025.013c.088.035.182.063.283.085a1.4 1.4 0 0 0 .383.045c.112 0 .195-.017.257-.045a.214.214 0 0 0 .14-.202.193.193 0 0 0-.063-.147c-.04-.035-.108-.067-.202-.094l-.265-.076c-.188-.054-.33-.135-.424-.24-.095-.105-.14-.246-.14-.417 0-.23.092-.414.278-.55.184-.135.428-.203.729-.203.168 0 .325.015.47.045.143.03.252.062.327.097l.019.008c.052.023.077.071.077.123v.503c0 .03-.01.06-.032.08-.02.022-.047.027-.072.013h-.037l.086-.049Zm.674-1.052c.026-.025.065-.035.117-.035h.632c.06 0 .112.04.112.11v2.766c0 .06-.051.111-.112.111h-.632c-.063 0-.105-.051-.105-.111v-2.76c0-.03.004-.06.018-.08h-.03Zm1.91 1.21c.025-.027.065-.04.117-.04h.632c.06 0 .112.051.112.112v.204c.126-.118.264-.204.406-.258.15-.054.32-.09.512-.09.33 0 .61.085.841.257a.903.903 0 0 1 .367.767v1.34c0 .06-.042.111-.105.111h-.64c-.064 0-.114-.051-.114-.111v-1.12c0-.158-.034-.277-.099-.358-.066-.082-.172-.123-.323-.123-.09 0-.174.019-.252.054a.717.717 0 0 0-.3.291v1.256c0 .06-.042.111-.113.111h-.632c-.062 0-.105-.051-.105-.111V9.62c0-.03.004-.06.018-.085h-.03l.109.04Z"/>
                              <path fill="#009CDE" d="M7.053 9.337c.027-.027.066-.04.118-.04h.632c.06 0 .111.051.111.112v2.22c0 .06-.05.111-.11.111h-.633c-.063 0-.105-.051-.105-.111V9.62c0-.03.004-.06.018-.085h-.03Zm1.91-.048c.16-.076.367-.112.624-.112.26 0 .47.036.63.112.159.077.27.194.333.354a.882.882 0 0 1-.12.871c-.162.204-.426.305-.784.305-.16 0-.328-.032-.506-.096v.894c0 .06-.042.111-.112.111h-.633c-.063 0-.112-.051-.112-.111V9.62c0-.03.004-.06.018-.08.026-.028.065-.04.117-.04h.633c.05 0 .094.037.108.09v.045a1.292 1.292 0 0 1 .314-.25l.09-.096Zm.395.742c0 .118.037.214.112.287.073.073.174.11.3.11a.506.506 0 0 0 .257-.063.418.418 0 0 0 .166-.181.615.615 0 0 0 .058-.267.493.493 0 0 0-.112-.336c-.073-.08-.181-.119-.32-.119a.485.485 0 0 0-.35.134.471.471 0 0 0-.136.345c0-.035.026.09.026.09Zm5.75-1.99c.025-.025.065-.035.117-.035h.632c.06 0 .112.04.112.11v.59c0 .066-.051.111-.112.111h-.633c-.062 0-.104-.045-.104-.11v-.586c0-.03.004-.06.018-.08h-.03Zm-3.47.032c.14-.076.342-.112.61-.112.207 0 .394.02.564.062a.937.937 0 0 1 .627.594c.05.14.074.297.074.476v1.48c0 .042-.014.078-.045.099-.031.022-.068.027-.108.013a2.322 2.322 0 0 0-.271-.103 2.117 2.117 0 0 0-.471-.049c-.179 0-.334.022-.467.067a.734.734 0 0 0-.32.205.535.535 0 0 0-.111.343c0 .204.065.355.195.456.13.1.301.151.519.151.09 0 .174-.01.247-.027.075-.018.14-.04.2-.067l.156-.077v-.65a.245.245 0 0 0-.031-.126c-.022-.035-.05-.063-.09-.08a.347.347 0 0 0-.146-.028h-.104c-.063 0-.105-.05-.105-.11v-.495c0-.063.042-.112.105-.112h.515c.152 0 .277.03.373.085.095.058.164.133.207.227.041.094.063.197.063.309v1.127c0 .11-.02.191-.06.246-.04.054-.1.092-.175.116a2.33 2.33 0 0 1-.574.125c-.108.009-.21.013-.31.013-.28 0-.524-.04-.727-.123a1.02 1.02 0 0 1-.478-.358 1.007 1.007 0 0 1-.166-.58c0-.168.04-.32.121-.459a.9.9 0 0 1 .36-.318c.158-.079.355-.118.588-.118.075 0 .161.008.256.021.096.018.177.04.247.068V9.773c0-.121-.05-.215-.15-.277a.688.688 0 0 0-.38-.094.974.974 0 0 0-.265.035 1.67 1.67 0 0 0-.423.198.117.117 0 0 1-.054.018c-.02 0-.039-.009-.054-.026l-.027-.033-.3-.424a.127.127 0 0 1-.021-.063c0-.022.01-.04.03-.054a2.03 2.03 0 0 1 .324-.2 1.152 1.152 0 0 1 .217-.081l-.019.044Z"/>
                            </g>
                          </svg>
                        </Badge>
                        <Badge variant="outline" className="bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" className="h-4">
                            <g fill="none">
                              <rect width="28" height="16" fill="#F1F1F1" rx="2"/>
                              <path fill="#0A0B09" d="M19.508 5.695c-.097 0-.171.026-.193.087v3.008c.021.062.107.087.204.087.31 0 .493-.214.493-.793 0-.653-.193-.847-.504-.847ZM7.525 7.044c0 .124-.107.214-.257.214h-.053L7 7.247v-1.26l.225-.01h.043c.151 0 .258.08.258.194 0 .112-.108.192-.258.192a.192.192 0 0 0 .129.05c.086 0 .129-.04.129-.092v-.162c0-.052-.043-.092-.13-.092-.073 0-.13.04-.162.102a.123.123 0 0 0 .72.153c-.5.092-.172.204-.417.204-.245 0-.417-.102-.417-.246 0-.152.183-.255.43-.255.246 0 .429.103.429.255 0-.265-.214-.428-.472-.428-.258 0-.472.163-.472.428 0 .265.214.439.472.439.258 0 .472-.174.472-.428v-.46c0-.203-.15-.306-.321-.306h-.58l-.215.01v2.12l.215.011h.58c.171 0 .32-.113.32-.306v-.244h-.003Zm12.312-1.696h-.386l.022 1.31a.78.78 0 0 1-.428-.417L18.12 5.345h-.3v2.12l.226-.01h.15l-.022-1.188c.096.154.3.398.568.755l.878 1.065h.215V5.347h-.001Zm-9.637 0h-.29l-1.007 2.13h.257l.214-.448h.887l.015.448h.472l-.548-2.13Zm-.719 1.34.321-.744h.011l.118.745h-.45v-.001Zm5.26-1.34h-.258l-.535 1.32h-.01l-.268-1.32h-.525l.01 2.12h.386V6.446h.01l.78 1.661h.525l-.375-.846.01-.011.86-1.907Zm1.576 1.53h-.812l.021 1.31a.78.78 0 0 1-.428-.417l-.923-.897h-.3v2.12l.225-.01h.15l-.021-1.188c.096.154.3.398.568.755l.878 1.065h.214V6.878h.429v-.316-.377h-.001Zm-8.122.814v.316h.525V5.345h-.525v1.674h-.02l-.715-1.674h-.525v2.12l.246-.01h.15V5.8h.01l.854 1.93v.001ZM8.96 5.346h-.707v2.12h.514v-.662h.193c.29 0 .568-.225.568-.729 0-.505-.279-.73-.568-.73Zm-.21.336h.15c.15 0 .247.103.247.393 0 .306-.129.398-.246.398h-.15V5.681v.001Zm11.166 1.104v.02c0 .47.3.683.825.683.526 0 .814-.214.814-.683v-.02c0-.46-.288-.673-.814-.673-.525 0-.825.214-.825.673Zm.257 0c0-.307.161-.367.568-.367.408 0 .557.06.557.367v.02c0 .316-.15.377-.557.377-.407 0-.568-.061-.568-.377v-.02Z"/>
                            </g>
                          </svg>
                        </Badge>
                      </div>

                      <p className="flex items-center justify-center text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 mr-1.5" />
                        Secure Checkout with 256-bit SSL Encryption
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Trust badges */}
                <div className="mt-6 bg-muted/40 border p-4 rounded-lg">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-primary mt-0.5 mr-3 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">100% Satisfaction Guarantee</h4>
                        <p className="text-xs text-muted-foreground">
                          Try our products risk-free for 30 days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 text-primary mt-0.5 mr-3 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">Free shipping on orders over $75</h4>
                        {subtotal < 75 && (
                          <p className="text-xs text-muted-foreground">
                            Add ${(75 - subtotal).toFixed(2)} more to qualify!
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <RefreshCcw className="h-4 w-4 text-primary mt-0.5 mr-3 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">Easy 30-Day Returns</h4>
                        <p className="text-xs text-muted-foreground">
                          No questions asked, hassle-free returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="rounded-xl border bg-card shadow-sm p-8 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <ShoppingCart className="h-10 w-10 text-primary/70" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Browse our collection to find the perfect wellness products for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/product")}
                >
                  Browse Products
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
              
              {/* Featured products */}
              <div className="mt-16 text-left">
                <h3 className="text-xl font-semibold mb-6">Featured Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      id: 1,
                      name: "MotionMist™ Anti-Chafing Spray",
                      price: 29.99,
                      image: "https://i.imgur.com/vAr3b3G.jpeg"
                    },
                    {
                      id: 2,
                      name: "KavinoRa Wellness Tea",
                      price: 24.99,
                      image: "https://i.imgur.com/kSDJFN7.jpeg"
                    },
                    {
                      id: 3,
                      name: "Mindfulness Journal",
                      price: 39.95,
                      image: "https://i.imgur.com/vbRMEpZ.jpeg"
                    }
                  ].map(product => (
                    <Card key={product.id} className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">${product.price}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCartItems([
                                ...cartItems,
                                {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  image: product.image
                                }
                              ]);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;