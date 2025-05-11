import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Product from "@/pages/Product";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/not-found";
import Cart from "@/pages/cart";
import OrderHistory from "@/pages/OrderHistory";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import AuthPage from "@/pages/auth-page";
import Wishlist from "@/pages/Wishlist";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/ui/nprogress";
import { applyScrollOptimizations } from "@/lib/scroll-fix";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/product" component={Product} />
      <Route path="/product/:id" component={Product} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/wishlist" component={Wishlist} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/order-history" component={OrderHistory} />
      <ProtectedRoute path="/account" component={Account} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Apply scroll optimizations when the app loads
  useEffect(() => {
    applyScrollOptimizations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <ScrollToTop />
              <NavigationProgress />
              <Router />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
