import { Link } from "wouter";

const BrandStory = () => {
  return (
    <section className="py-16 bg-beige-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-8">
            KavinoRa was inspired by my mother Kavitha, whose wisdom and care taught me the importance of natural solutions for everyday comfort. Our brand combines innovation with plant-based ingredients to create products that support your active lifestyle.
          </p>
          <Link href="/about" className="inline-block text-teal hover:text-teal-dark font-montserrat font-medium transition-all">
            Learn more about us <i className="ri-arrow-right-line align-middle ml-1"></i>
          </Link>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600" 
            alt="Active people enjoying outdoor running" 
            className="w-full h-auto" 
          />
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
