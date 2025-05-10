import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    title: "How to Prevent Skin Chafing During Exercise",
    summary: "Discover practical tips and preventative measures to avoid uncomfortable chafing during your workouts.",
    image: "https://pixabay.com/get/gbe38794bcee7087300abcd262664cda7524094c3a3cd38245b0381ded767fccd01470c1b8ef6d4fc13ccc6ee1b81cd44209b195d05430e3bfe5252bf428824fc_1280.jpg",
    imageAlt: "Person applying skin care product"
  },
  {
    id: 2,
    title: "The Ultimate Skincare Routine for Runners",
    summary: "Learn about the essential skincare products and habits that every runner should incorporate into their routine.",
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    imageAlt: "Runner on trail enjoying exercise"
  },
  {
    id: 3,
    title: "The Benefits of Plant-Based Skincare",
    summary: "Why natural ingredients are not just better for the environment, but also more effective for your skin health.",
    image: "https://pixabay.com/get/g5c70461282a7d88e5625217a7a13f5e283a407a917002faad991ea2bda9a0cba561b2f006867ab6bab22584cb3c141842eb352e8ad53661a844a1a613abea023_1280.jpg",
    imageAlt: "Natural plant-based ingredients"
  }
];

const BlogPreview = () => {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">KavinoRa Journal</h2>
          <p className="text-gray-600">Insights and advice for active lifestyles and wellness journeys.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img 
                src={post.image} 
                alt={post.imageAlt} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.summary}</p>
                <Link href={`/blog/${post.id}`} className="text-teal hover:text-teal-dark font-montserrat font-medium transition-all">
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/blog" className="inline-block bg-beige hover:bg-beige-dark text-gray-800 font-montserrat font-medium py-3 px-8 rounded-full transition-all">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
