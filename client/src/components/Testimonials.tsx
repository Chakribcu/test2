const testimonials = [
  {
    quote: "I've tried many anti-chafing products, but MotionMist is by far the best. It lasts through my entire marathon training runs.",
    name: "Jamie R.",
    title: "Marathon Runner",
    initials: "JR",
    rating: 5
  },
  {
    quote: "Love that it's plant-based and actually works! No more uncomfortable cycling rides for me.",
    name: "Sarah L.",
    title: "Cyclist",
    initials: "SL",
    rating: 5
  },
  {
    quote: "Finally a solution that doesn't feel sticky! Perfect for my hot yoga sessions and summer runs.",
    name: "Michael K.",
    title: "Yoga Instructor",
    initials: "MK",
    rating: 4.5
  }
];

const Testimonials = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-beige-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-center mb-12">
          What People Are Saying
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-teal">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center mr-3">
                  <span className="font-montserrat font-medium text-teal">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
