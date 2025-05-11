import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import BrandStory from "@/components/BrandStory";
import ProductFeature from "@/components/ProductFeature";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import ContactForm from "@/components/ContactForm";
import PopularProducts from "@/components/PopularProducts";
import TrendingProducts from "@/components/TrendingProducts";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToTopInstant } from "@/lib/scroll-restoration";
import { Loading } from "@/components/ui/loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    scrollToTopInstant();
    
    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
      clearTimeout(timer);
    };
  }, []);

  // SEO metadata for the homepage
  const seoData = {
    title: "KavinoRa - Effortless Comfort for Every Step",
    description: "Discover premium plant-based wellness products designed to enhance your active lifestyle with natural ingredients and superior performance.",
    ogImage: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630",
    ogType: "website" as const
  };

  return (
    <Layout>
      <SEOHead {...seoData} />
      <div className="overflow-x-hidden">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <Loading size="lg" message="Loading amazing products..." />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Hero />
            <Benefits />
            <BrandStory />
            <ProductFeature />
            <PopularProducts />
            <Testimonials />
            <TrendingProducts />
            <BlogPreview />
            <ContactForm />
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Home;