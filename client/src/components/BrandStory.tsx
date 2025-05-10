import { motion } from "framer-motion";
import { Link } from "wouter";

const BrandStory = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Apple-style two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-6 leading-tight">
              Designed for athletes.<br />
              Made for everyone.
            </h2>
            
            <p className="text-lg text-[#6e6e73] mb-6 leading-relaxed">
              KavinoRa was born from a simple belief: wellness shouldn't be complicated. 
              Our journey began when our founder, an avid marathon runner, 
              couldn't find products that were both effective and natural.
            </p>
            
            <p className="text-lg text-[#6e6e73] mb-8 leading-relaxed">
              Today, we create premium wellness products using plant-based ingredients 
              that support your active lifestyle without compromising on performance or sustainability.
            </p>
            
            <Link href="/about">
              <button className="inline-flex items-center px-8 py-3 rounded-full border border-[#1d1d1f]/20 text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                Our Story
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </Link>
          </motion.div>
          
          {/* Image Column with Apple-style gradient and shadow */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Background gradient element */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-[32px] blur-3xl"></div>
            
            {/* Main image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                alt="KavinoRa wellness products" 
                className="w-full h-auto aspect-[4/3] object-cover"
              />
              
              {/* Floating stats card - Apple style */}
              <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-lg max-w-[220px]">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#1d1d1f]">100% Plant-Based</h3>
                    <p className="text-xs text-[#6e6e73]">All natural ingredients</p>
                  </div>
                </div>
                <div className="h-0.5 bg-gray-100 my-3"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#1d1d1f]">Clinically Tested</h3>
                    <p className="text-xs text-[#6e6e73]">Proven performance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;