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
import { useEffect } from "react";
import { motion } from "framer-motion";

const Home = () => {
  useEffect(() => {
    document.title = "KavinoRa - Effortless Comfort for Every Step";
    
    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <Layout>
      <div className="overflow-x-hidden">
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
      </div>
    </Layout>
  );
};

export default Home;
