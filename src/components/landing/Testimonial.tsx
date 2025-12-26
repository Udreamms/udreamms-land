import { Star } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <blockquote className="text-xl lg:text-2xl font-medium text-white max-w-4xl mx-auto leading-relaxed mb-8">
          "Seasoned Living gave me the stability and support I needed to get back on my feet. The house leaders truly care, and I finally feel like I have a real home."
        </blockquote>
        
        <cite className="text-white/80 text-lg">
          — Jessica L., Former Resident
        </cite>
      </div>
    </section>
  );
};

export default Testimonial;