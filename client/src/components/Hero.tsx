import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full border bg-background shadow-sm text-sm font-medium text-foreground/80 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              New product launch: MotionMist™
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Effortless Comfort for <span className="text-primary">Every Step</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover our plant-based anti-chafing spray designed for runners, athletes, and active individuals to protect your skin when it matters most.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                100% Plant-Based
              </div>
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                Long-Lasting Protection
              </div>
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                Dermatologist Tested
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/product">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Product image with shadow and border */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-white aspect-square md:aspect-[4/5] lg:aspect-square">
              <img 
                src="https://i.imgur.com/vAr3b3G.jpeg" 
                alt="KavinoRa MotionMist Anti-Chafing Spray" 
                className="w-full h-full object-cover object-center" 
              />
              
              {/* Floating testimonial card */}
              <div className="absolute -bottom-6 -left-6 bg-background rounded-lg p-4 shadow-lg border max-w-[200px] hidden md:block">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs font-medium">5.0</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  "This spray has been a game-changer for my long-distance runs!"
                </p>
              </div>
              
              {/* Price tag */}
              <div className="absolute top-6 right-6 bg-primary text-white rounded-full px-4 py-2 font-bold shadow-lg">
                $29.99
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
