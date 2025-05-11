import { useEffect } from "react";
import Layout from "@/components/Layout";

const About = () => {
  useEffect(() => {
    document.title = "About Us | KavinoRa";
  }, []);

  return (
    <Layout>
      <div className="pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-8 text-center">About KavinoRa</h1>
            
            <div className="mb-12">
              <img 
                src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500" 
                alt="Wellness in nature" 
                className="w-full h-auto rounded-xl shadow-md mb-8" 
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="font-montserrat text-2xl md:text-3xl mb-4">Our Story</h2>
              <p>
                KavinoRa was born from a simple but powerful inspiration – my mother, Kavitha. Growing up, I watched her create natural remedies for everyday problems, always emphasizing that comfort should never come at the cost of your health or the planet's wellbeing.
              </p>
              <p>
                The name "KavinoRa" honors her influence – combining her name with natural elements that reflect our commitment to plant-based solutions that work in harmony with your body.
              </p>
              
              <h2 className="font-montserrat text-2xl md:text-3xl mt-8 mb-4">Our Mission</h2>
              <p>
                At KavinoRa, we believe that comfort should be effortless. Our mission is to create wellness products that allow you to move through life with confidence, using the power of nature rather than synthetic chemicals that can harm your skin and the environment.
              </p>
              <p>
                We're committed to developing products that are:
              </p>
              <ul>
                <li>Formulated with plant-based ingredients</li>
                <li>Cruelty-free and ethically produced</li>
                <li>Effective and reliable for active lifestyles</li>
                <li>Gentle on sensitive skin</li>
                <li>Environmentally conscious in both formulation and packaging</li>
              </ul>
              
              <h2 className="font-montserrat text-2xl md:text-3xl mt-8 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8">
                <div className="bg-beige-light p-6 rounded-lg">
                  <h3 className="font-montserrat text-xl font-semibold mb-3">Comfort</h3>
                  <p className="text-gray-700">We believe everyone deserves to feel comfortable in their own skin, no matter how active their lifestyle.</p>
                </div>
                <div className="bg-beige-light p-6 rounded-lg">
                  <h3 className="font-montserrat text-xl font-semibold mb-3">Clarity</h3>
                  <p className="text-gray-700">We're transparent about what goes into our products and why, so you can make informed choices.</p>
                </div>
                <div className="bg-beige-light p-6 rounded-lg">
                  <h3 className="font-montserrat text-xl font-semibold mb-3">Confidence</h3>
                  <p className="text-gray-700">Our products are designed to give you the confidence to push boundaries and embrace an active life.</p>
                </div>
              </div>
              
              <h2 className="font-montserrat text-2xl md:text-3xl mt-8 mb-4">Looking Forward</h2>
              <p>
                Our journey begins with MotionMist™, but it doesn't end there. We're committed to developing a full line of wellness products that address real needs with natural solutions. Each product we create will maintain our commitment to quality, effectiveness, and sustainability.
              </p>
              <p>
                Thank you for joining us on this journey. We're excited to grow and evolve with your support, creating products that enhance comfort and confidence in your daily life.
              </p>
              
              <div className="mt-10 text-center">
                <blockquote className="italic text-xl text-gray-600 border-l-4 border-teal pl-4 py-2">
                  "True comfort comes from working with nature, not against it."
                  <footer className="mt-2 font-montserrat not-italic">— Kavitha, Inspiration for KavinoRa</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;