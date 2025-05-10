import { Link } from "wouter";
import { ArrowRight, Heart, LeafyGreen, Dumbbell } from "lucide-react";

const BrandStory = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border-8 border-white relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200" 
                  alt="KavinoRa Founder" 
                  className="w-full h-auto" 
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/5 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
              
              {/* Value props floating cards */}
              <div className="absolute -top-8 right-12 bg-white rounded-lg p-4 shadow-lg border z-20 hidden md:flex items-center">
                <Heart className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Made with care</span>
              </div>
              
              <div className="absolute -bottom-8 left-12 bg-white rounded-lg p-4 shadow-lg border z-20 hidden md:flex items-center">
                <LeafyGreen className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">100% Plant-based</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full border bg-white shadow-sm text-sm font-medium text-foreground/80 mb-4">
              <Dumbbell className="h-3.5 w-3.5 mr-2 text-primary" />
              Our Mission
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The KavinoRa Story</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <p>
                KavinoRa was inspired by my mother Kavitha, whose wisdom and care taught me the importance of natural solutions for everyday comfort.
              </p>
              
              <p>
                When I began training for my first marathon, I experienced the discomfort and pain of chafing that many athletes face. Instead of using petroleum-based products, I remembered my mother's teachings about plant-based remedies.
              </p>
              
              <p>
                After years of research and development, MotionMist™ was born — combining innovation with plant-based ingredients to create products that support your active lifestyle without compromising on performance or your values.
              </p>
            </div>
            
            <div className="mt-8">
              <Link href="/about" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-all">
                Learn our full story 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
