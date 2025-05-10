import { Link } from "wouter";
import { motion } from "framer-motion";

// Placeholder data
const blogPosts = [
  {
    id: 1,
    title: "The Science Behind Anti-Chafing Products",
    excerpt: "Learn how our plant-based formula works to prevent friction and irritation during high-intensity activities.",
    date: "May 5, 2025",
    category: "Product Insights",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Training Tips for Your First Marathon",
    excerpt: "Discover essential preparation strategies from experienced athletes to help you conquer your first 26.2 miles.",
    date: "April 28, 2025",
    category: "Performance",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "How Plant-Based Products Benefit Your Skin",
    excerpt: "Explore the advantages of using natural ingredients for skin care, especially for active individuals.",
    date: "April 21, 2025",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop"
  }
];

const BlogPreview = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Apple-style section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4">From Our Journal</h2>
          <p className="text-lg text-[#6e6e73] max-w-2xl mx-auto">
            Explore articles, training tips, and wellness insights from our team of experts.
          </p>
        </motion.div>
        
        {/* Apple-style blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="cursor-pointer">
                  {/* Post image with hover effect */}
                  <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/3]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Apple-style category tag */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-[#1d1d1f]">
                      {post.category}
                    </div>
                  </div>
                  
                  {/* Post date - Apple style subtle text */}
                  <p className="text-sm text-[#86868b] mb-2">
                    {post.date}
                  </p>
                  
                  {/* Post title - Apple style clear heading with hover effect */}
                  <h3 className="text-xl font-medium text-[#1d1d1f] mb-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  {/* Post excerpt - Apple style body text */}
                  <p className="text-[#6e6e73] line-clamp-3">
                    {post.excerpt}
                  </p>
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link href="/blog">
            <button className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              View all articles
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-0.5 transition-transform">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;