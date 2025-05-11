import { useEffect } from "react";
import Layout from "@/components/Layout";

const blogPosts = [
  {
    id: 1,
    title: "How to Prevent Skin Chafing During Exercise",
    summary: "Discover practical tips and preventative measures to avoid uncomfortable chafing during your workouts.",
    content: "Skin chafing is a common issue for active individuals, especially during long-distance activities. This irritation occurs when skin rubs against skin or clothing, creating friction that can lead to redness, pain, and even blisters in severe cases...",
    image: "https://pixabay.com/get/gbe38794bcee7087300abcd262664cda7524094c3a3cd38245b0381ded767fccd01470c1b8ef6d4fc13ccc6ee1b81cd44209b195d05430e3bfe5252bf428824fc_1280.jpg",
    imageAlt: "Person applying skin care product",
    date: "June 15, 2023",
    author: "Jamie Walker",
    category: "Skincare"
  },
  {
    id: 2,
    title: "The Ultimate Skincare Routine for Runners",
    summary: "Learn about the essential skincare products and habits that every runner should incorporate into their routine.",
    content: "Running is an excellent form of exercise, but it can take a toll on your skin. From prolonged sun exposure to sweat-induced breakouts, runners face unique skincare challenges that require specific solutions...",
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    imageAlt: "Runner on trail enjoying exercise",
    date: "July 3, 2023",
    author: "Sarah Thompson",
    category: "Fitness"
  },
  {
    id: 3,
    title: "The Benefits of Plant-Based Skincare",
    summary: "Why natural ingredients are not just better for the environment, but also more effective for your skin health.",
    content: "The skincare industry has seen a significant shift toward plant-based formulations in recent years, and for good reason. These natural alternatives often provide powerful benefits without the harsh side effects of some synthetic ingredients...",
    image: "https://pixabay.com/get/g5c70461282a7d88e5625217a7a13f5e283a407a917002faad991ea2bda9a0cba561b2f006867ab6bab22584cb3c141842eb352e8ad53661a844a1a613abea023_1280.jpg",
    imageAlt: "Natural plant-based ingredients",
    date: "August 12, 2023",
    author: "Alex Rivera",
    category: "Wellness"
  },
  {
    id: 4,
    title: "Choosing the Right Anti-Chafing Solution for Your Activity",
    summary: "Different activities call for different approaches to prevent chafing. Find the perfect solution for your preferred exercise.",
    content: "When it comes to preventing chafing, one size doesn't fit all. The right anti-chafing product depends on your activity type, duration, and even the climate you're exercising in...",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    imageAlt: "Various sports equipment",
    date: "September 5, 2023",
    author: "Taylor Jordan",
    category: "Product Guides"
  },
  {
    id: 5,
    title: "Why Sustainable Packaging Matters in Self-Care",
    summary: "Explore how eco-friendly packaging choices impact both our planet and the quality of wellness products.",
    content: "As consumers become more environmentally conscious, the demand for sustainable packaging in the beauty and wellness industry continues to grow. But sustainable packaging isn't just good for the planet...",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    imageAlt: "Eco-friendly packaging materials",
    date: "October 20, 2023",
    author: "Morgan Lee",
    category: "Sustainability"
  }
];

const Blog = () => {
  useEffect(() => {
    document.title = "KavinoRa Journal | Wellness & Skincare Insights";
  }, []);

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  return (
    <Layout>
      <div className="pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-4 text-center">KavinoRa Journal</h1>
            <p className="text-xl text-center text-gray-600 mb-12">Insights and advice for active lifestyles and wellness journeys</p>
            
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button className="bg-teal text-white px-4 py-2 rounded-full font-montserrat text-sm">All Posts</button>
                {categories.map((category, index) => (
                  <button key={index} className="bg-beige hover:bg-beige-dark text-gray-800 px-4 py-2 rounded-full font-montserrat text-sm transition-all">
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Featured Article */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <img 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].imageAlt} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-sm text-teal font-montserrat mb-2">{blogPosts[0].category}</span>
                    <h2 className="font-montserrat font-bold text-2xl mb-4">{blogPosts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{blogPosts[0].summary}</p>
                    <div className="mt-auto">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{blogPosts[0].date}</span>
                        <span className="mx-2">•</span>
                        <span>By {blogPosts[0].author}</span>
                      </div>
                      <a href="#" className="inline-block text-teal hover:text-teal-dark font-montserrat font-medium transition-all">
                        Read more <i className="ri-arrow-right-line align-middle ml-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Regular Articles */}
                {blogPosts.slice(1).map((post, index) => (
                  <article key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <img 
                      src={post.image} 
                      alt={post.imageAlt} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="p-6">
                      <span className="text-sm text-teal font-montserrat mb-2">{post.category}</span>
                      <h3 className="font-montserrat font-semibold text-xl mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.summary}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>By {post.author}</span>
                      </div>
                      <a href="#" className="text-teal hover:text-teal-dark font-montserrat font-medium transition-all">
                        Read more <i className="ri-arrow-right-line align-middle ml-1"></i>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="text-center">
                <button className="inline-block bg-beige hover:bg-beige-dark text-gray-800 font-montserrat font-medium py-3 px-8 rounded-full transition-all">
                  Load More Articles
                </button>
              </div>
            </div>
            
            <div className="bg-beige-light p-8 rounded-xl text-center">
              <h2 className="font-montserrat font-bold text-2xl mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-700 mb-6">Stay updated with our latest articles, product news, and wellness tips delivered straight to your inbox.</p>
              <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
                <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal" required />
                <button type="submit" className="bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;