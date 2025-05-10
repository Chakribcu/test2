import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import BrandStory from "@/components/BrandStory";
import ProductFeature from "@/components/ProductFeature";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import ContactForm from "@/components/ContactForm";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "KavinoRa - Effortless Comfort for Every Step";
  }, []);

  return (
    <>
      <Hero />
      <Benefits />
      <BrandStory />
      <ProductFeature />
      <Testimonials />
      <BlogPreview />
      <ContactForm />
    </>
  );
};

export default Home;
