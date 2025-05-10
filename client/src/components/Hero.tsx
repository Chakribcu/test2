import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="pt-16 pb-20 md:pt-20 md:pb-24 bg-beige-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-4">
              Effortless Comfort for Every Step
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Introducing MotionMist™, the plant-based anti-chafing spray designed for runners, athletes, and active individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/product" className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all whitespace-nowrap">
                Shop Now
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-montserrat font-medium py-3 px-8 rounded-full transition-all whitespace-nowrap border border-gray-300">
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img 
              src="https://pixabay.com/get/gbd20e1f06248868b2321297688b4c6d759a99b67d53173f852fb2cd83347348017d39e1f97d3a9c0a72d23e2a146826858308734326d6e60642e3760b60e2a8c_1280.jpg" 
              alt="KavinoRa MotionMist Anti-Chafing Spray" 
              className="rounded-xl shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
