import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    content: "This anti-chafing spray has been a game-changer for my marathon training. I can finally focus on my performance without worrying about discomfort.",
    author: "Sarah J.",
    role: "Marathon Runner",
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 2,
    content: "As a cycling enthusiast, I've tried many products, but KavinoRa's MotionMist stands out. It's long-lasting, even during my longest rides.",
    author: "Michael T.",
    role: "Cycling Enthusiast",
    avatar: "https://i.pravatar.cc/100?img=2"
  },
  {
    id: 3,
    content: "The plant-based formula is perfect for my sensitive skin. No irritation, just smooth comfort during my yoga and HIIT workouts.",
    author: "Emma R.",
    role: "Yoga Instructor",
    avatar: "https://i.pravatar.cc/100?img=3"
  },
  {
    id: 4,
    content: "As a trail runner, I need products that can withstand tough conditions. KavinoRa delivers - it's the only brand I trust for my races.",
    author: "David W.",
    role: "Trail Runner",
    avatar: "https://i.pravatar.cc/100?img=4"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Apple-style section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4">What Our Customers Say</h2>
          <p className="text-lg text-[#6e6e73] max-w-2xl mx-auto">
            Join the thousands of athletes and active individuals who have made KavinoRa an essential part of their routine.
          </p>
        </motion.div>
        
        {/* Apple-style testimonial carousel */}
        <div className="max-w-4xl mx-auto">
          {/* Testimonial */}
          <motion.div
            key={testimonials[activeIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-[#f5f5f7] rounded-3xl p-8 md:p-12 mb-8 relative"
          >
            {/* Quote mark decoration */}
            <div className="absolute top-8 left-8 text-8xl text-primary/10 pointer-events-none font-serif">
              "
            </div>
            
            <div className="text-xl md:text-2xl text-[#1d1d1f] font-light leading-relaxed mb-8 max-w-3xl relative">
              "{testimonials[activeIndex].content}"
            </div>
            
            <div className="flex items-center">
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].author} 
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h4 className="text-[#1d1d1f] font-medium">{testimonials[activeIndex].author}</h4>
                <p className="text-[#6e6e73] text-sm">{testimonials[activeIndex].role}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Controls */}
          <div className="flex justify-between items-center">
            {/* Navigation dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-6 bg-primary" : "bg-[#86868b]"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Prev/Next buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-[#1d1d1f]/10 flex items-center justify-center hover:bg-[#f5f5f7] transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-[#1d1d1f]/10 flex items-center justify-center hover:bg-[#f5f5f7] transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;