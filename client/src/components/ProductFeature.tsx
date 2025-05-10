import { Link } from "wouter";
import { motion } from "framer-motion";

// Placeholder data (replace with real products)
const products = [
  {
    id: 1,
    name: "MotionMist™ Anti-Chafing Spray",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=1887&auto=format&fit=crop",
    category: "Body Care"
  },
  {
    id: 2,
    name: "RevitaRoll™ Recovery Roller",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop",
    category: "Recovery"
  },
  {
    id: 3,
    name: "EnduraBalm™ Joint Relief",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1887&auto=format&fit=crop",
    category: "Pain Relief"
  },
  {
    id: 4,
    name: "StaminaPlus™ Energy Supplement",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1887&auto=format&fit=crop",
    category: "Supplements"
  }
];

const ProductFeature = () => {
  return (
    <section className="py-20 bg-[#f5f5f7]">
      <div className="container mx-auto px-6">
        {/* Apple-style section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4">Featured Products</h2>
          <p className="text-lg text-[#6e6e73] max-w-2xl mx-auto">
            Discover our line of premium wellness products designed for your active lifestyle.
          </p>
        </motion.div>
        
        {/* Apple-style products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  {/* Product image with hover effect */}
                  <div className="relative overflow-hidden rounded-2xl bg-white mb-4 aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Apple-style category tag */}
                    <div className="absolute top-3 left-3 text-xs font-medium bg-black/10 backdrop-blur-md rounded-full px-3 py-1 text-white">
                      {product.category}
                    </div>
                  </div>
                  
                  {/* Apple-style product info */}
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium text-[#1d1d1f] group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[#6e6e73] text-sm">
                      From ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Apple-style "View All" button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Link href="/product">
            <button className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
              View All Products
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductFeature;