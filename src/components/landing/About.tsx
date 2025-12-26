import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Home } from "lucide-react";
import aboutCommunityImage from "@/assets/about-community.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Dignity",
      description: "Every resident is treated with respect and compassion, regardless of their past circumstances.",
      color: "bg-red-500"
    },
    {
      icon: Shield,
      title: "Safety",
      description: "We maintain secure, clean environments where residents can feel protected and at peace.",
      color: "bg-brand-teal"
    },
    {
      icon: Home,
      title: "Hope",
      description: "We believe in second chances and work to help residents build brighter futures.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Mission Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
            About Us
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Dedicated to providing dignity, safety, and second chances through supportive 
            independent and shared living environments.
          </p>
        </div>
        
        <div className="mb-20">
          <div className="bg-gradient-to-br from-brand-teal-light to-brand-cream rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-semibold text-brand-navy">Our Mission</h3>
              <p className="text-base leading-relaxed text-brand-navy/80 max-w-3xl mx-auto">
                At Seasoned Living Homes, we believe everyone deserves a safe, stable place to call home. 
                We specialize in providing supportive living environments for individuals who need more than 
                just housing—they need community, support, and a fresh start.
              </p>
              <p className="text-base leading-relaxed text-brand-navy/80 max-w-3xl mx-auto">
                Our homes are more than just places to sleep. They're communities where residents receive 
                the support they need to thrive, whether that's help with daily tasks, transportation to 
                appointments, or simply having someone who cares nearby.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-brand-navy mb-6">
            Our Values
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <Card key={index} className="text-center border-0 shadow-soft hover:shadow-card transition-shadow">
              <CardContent className="pt-8 pb-8 space-y-4">
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-navy">{value.title}</h4>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leadership Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-brand-navy mb-6">
            Our House Leaders
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Every Seasoned Living home has dedicated house leaders who live on-site and provide 24/7 support. 
            They're trained professionals who understand the unique needs of our residents and are committed 
            to creating a warm, supportive environment where everyone can thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center border-0 shadow-soft">
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-semibold">24/7</span>
              </div>
              <h4 className="text-lg font-semibold text-brand-navy">24/7 Availability</h4>
              <p className="text-sm text-muted-foreground">
                House leaders are always available to assist with emergencies, questions, or support needs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-soft">
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-brand-navy">Trained Professionals</h4>
              <p className="text-sm text-muted-foreground">
                All house leaders receive specialized training in working with individuals in transitional living.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-soft">
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-brand-navy">Community Builders</h4>
              <p className="text-sm text-muted-foreground">
                They foster a sense of community and belonging among all residents in the home.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;