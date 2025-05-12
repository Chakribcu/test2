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
// Note: Using relative path since module resolution seems to be failing with alias
import OrderDetail from "./pages/OrderDetail";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import AuthPage from "@/pages/auth-page";
import Wishlist from "@/pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductManager from "./pages/ProductManager";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ProductProvider } from "@/hooks/use-products";
import { OrderProvider } from "@/hooks/use-orders";
import { SiteSettingsProvider } from "@/hooks/use-site-settings";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/ui/nprogress";
import { applyScrollOptimizations } from "@/lib/scroll-fix";
import { SupportChatbot } from "@/components/SupportChatbot";

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
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <ProtectedRoute path="/order-history" component={OrderHistory} />
      <ProtectedRoute path="/order/:id" component={OrderDetail} />
      <ProtectedRoute path="/account" component={Account} />
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} />
      <ProtectedRoute path="/admin/customers" component={AdminCustomers} />
      <ProtectedRoute path="/admin/analytics" component={AdminAnalytics} />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} />
      <ProtectedRoute path="/admin/product-manager" component={ProductManager} />
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
            <ProductProvider>
              <OrderProvider>
                <SiteSettingsProvider>
                  <TooltipProvider>
                    <Toaster />
                    <ScrollToTop />
                    <NavigationProgress />
                    <SupportChatbot />
                    <Router />
                  </TooltipProvider>
                </SiteSettingsProvider>
              </OrderProvider>
            </ProductProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
