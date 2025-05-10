import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#fafafa]">
      {/* Apple-style minimal design with subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] to-[#fbfbfd] pointer-events-none"></div>
      
      <div className="container relative mx-auto pt-12 pb-16 md:pt-24 md:pb-32 px-6 md:px-8">
        {/* New product announcement - Apple style pill */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f5f5f7] shadow-sm text-sm font-medium text-[#1d1d1f] mb-6">
            New
            <span className="mx-2 text-[#6e6e73]">•</span>
            MotionMist™ Anti-Chafing Spray
          </div>
        </motion.div>
        
        {/* Apple-style big product headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] mx-auto max-w-4xl leading-tight">
            Protection that moves <span className="text-primary">with you.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#6e6e73] mt-6 max-w-3xl mx-auto leading-relaxed font-light">
            Our breakthrough anti-chafing formula. For runners, athletes, and the everyday active.
          </p>
        </motion.div>
        
        {/* Product display - Apple style centered product showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto max-w-5xl mb-16"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f2f2f2] to-white">
            <img 
              src="https://i.imgur.com/vAr3b3G.jpeg" 
              alt="KavinoRa MotionMist Anti-Chafing Spray" 
              className="w-full object-cover h-[300px] md:h-[500px] lg:h-[600px] object-center shadow-lg" 
            />
          </div>
          
          {/* Apple-style floating price indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute top-8 right-8 bg-black/80 backdrop-blur-md text-white rounded-full px-5 py-2.5 font-medium"
          >
            From $29.99
          </motion.div>
        </motion.div>
        
        {/* Feature highlights - Apple style three column grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">100% Plant-Based</h3>
              <p className="text-[#6e6e73] text-sm">Natural formula with zero synthetic ingredients</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Long-Lasting</h3>
              <p className="text-[#6e6e73] text-sm">Up to 8 hours of continuous protection</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Dermatologist Tested</h3>
              <p className="text-[#6e6e73] text-sm">Safe for all skin types including sensitive skin</p>
            </div>
          </div>
        </motion.div>
        
        {/* Call to action buttons - Apple style centered buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-md px-8 w-full sm:w-auto">
            <Link href="/product">
              Buy Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-full border-[#1d1d1f]/20 hover:bg-[#f5f5f7] text-[#1d1d1f] w-full sm:w-auto">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
