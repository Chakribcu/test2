const benefits = [
  {
    icon: "ri-leaf-line",
    title: "Plant-Based Formula",
    description: "Gentle on your skin with natural ingredients that provide lasting protection."
  },
  {
    icon: "ri-timer-line",
    title: "Long-Lasting Protection",
    description: "Stays active throughout your workout or run, so you can focus on performance."
  },
  {
    icon: "ri-drop-line",
    title: "Non-Greasy Formula",
    description: "Dries quickly without leaving any residue while providing smooth comfort."
  }
];

const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-beige rounded-full mb-4">
                <i className={`${benefit.icon} text-teal text-2xl`}></i>
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
