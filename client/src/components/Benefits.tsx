import { Leaf, Clock, Droplets, Feather } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Plant-Based Formula",
    description: "Gentle on your skin with natural ingredients that provide lasting protection without harsh chemicals."
  },
  {
    icon: Clock,
    title: "Long-Lasting Protection",
    description: "Stays active for up to 8 hours, so you can focus on your performance without interruptions."
  },
  {
    icon: Droplets,
    title: "Non-Greasy Formula",
    description: "Dries quickly without leaving any residue while providing smooth comfort throughout your activities."
  },
  {
    icon: Feather,
    title: "Ultra-Lightweight Feel",
    description: "So light you'll forget it's there, but with powerful protection when you need it most."
  }
];

const Benefits = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose KavinoRa</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our innovative formulas are designed with your active lifestyle in mind, 
            providing superior protection and comfort in every situation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-5 text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-xl mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
