
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowRight, Search, Code, Image, Map, PenSquare, Plane, BarChart2, BookOpen, Sparkles, Cpu, Users } from "lucide-react";

// Card for the top prompt suggestions
const PromptCard = ({ title, icon, bgColor, link }: { title: string, icon: React.ReactNode, bgColor: string, link: string }) => (
  <Link href={link}>
    <div className={`rounded-xl p-4 h-40 flex flex-col justify-between ${bgColor} hover:opacity-90 transition-opacity`}>
      <p className="font-medium text-lg text-white">{title}</p>
      <div className="self-end bg-white/20 rounded-full p-2">
        {icon}
      </div>
    </div>
  </Link>
);

// Card for features with images
const FeatureCard = ({ title, description, link, cta, imageUrl, className }: { title: string, description: string, link: string, cta: string, imageUrl: string, className?: string }) => (
  <div className={`bg-gray-800 rounded-2xl overflow-hidden group ${className}`}>
    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
      {/* Using a div with background for the image */}
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <Link href={link}>
        <span className="text-blue-400 hover:text-blue-300 flex items-center group-hover:underline">
          {cta} <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </Link>
    </div>
  </div>
);


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131314] text-white font-['Poppins']">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Try Royalty
          </h1>
          <div className="relative w-full max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Ask Royalty"
              className="w-full bg-[#202124] border border-gray-700 rounded-full py-4 pl-14 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-24">
            <PromptCard title="Create a backyard garden plan" icon={<PenSquare size={24} className="text-white"/>} bgColor="bg-yellow-500/80" link="#" />
            <PromptCard title="Create a surrealist photoshop of a cat" icon={<Image size={24} className="text-white"/>} bgColor="bg-purple-500/80" link="#" />
            <PromptCard title="Map out a hike-friendly national park" icon={<Map size={24} className="text-white"/>} bgColor="bg-green-500/80" link="#" />
            <PromptCard title="Restore an old picture" icon={<Sparkles size={24} className="text-white"/>} bgColor="bg-pink-500/80" link="#" />
            <PromptCard title="Plan a family trip" icon={<Plane size={24} className="text-white"/>} bgColor="bg-blue-500/80" link="#" />
            <PromptCard title="Summarize fall fashion trends" icon={<BarChart2 size={24} className="text-white"/>} bgColor="bg-red-500/80" link="#" />
        </div>

        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Get started with Royalty AI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mb-24">
            <FeatureCard 
                title="Ask anything, any way, in Google Search"
                description="The world'''s information, with generative AI."
                cta="Try in Search"
                link="#"
                imageUrl="/placeholder1.jpg" // Placeholder
            />
             <FeatureCard 
                title="Chat with Royalty, your personal AI assistant"
                description="Your expert companion for creativity and productivity."
                cta="Try Royalty"
                link="#"
                imageUrl="/placeholder2.jpg" // Placeholder
            />
            <FeatureCard 
                title="Seamlessly create cinematic clips, scenes and stories"
                description="Create video with just a text description using Veo."
                cta="Create with Veo"
                link="#"
                imageUrl="/placeholder3.jpg" // Placeholder
            />
        </div>

        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Explore what'''s possible</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
                title="For knowledge"
                description="Discover helpful tools for learning"
                cta="Learn more"
                link="#"
                imageUrl="/placeholder4.jpg" // Placeholder
                className="lg:col-span-1"
            />
            <FeatureCard 
                title="For creativity"
                description="Find tools to create and inspire"
                cta="Learn more"
                link="#"
                imageUrl="/placeholder5.jpg" // Placeholder
                className="lg:col-span-1"
            />
             <FeatureCard 
                title="For productivity"
                description="Enhance your efficiency and streamline workflows"
                cta="Learn more"
                link="#"
                imageUrl="/placeholder6.jpg" // Placeholder
                className="lg:col-span-1"
            />
             <FeatureCard 
                title="For students"
                description="Learn in ways that work for you"
                cta="Learn more"
                link="#"
                imageUrl="/placeholder7.jpg" // Placeholder
                className="lg:col-span-1"
            />
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
