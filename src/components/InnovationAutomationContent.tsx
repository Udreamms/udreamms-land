'use client';

import { Bot, Cpu, FlaskConical, Search, Lightbulb, ChevronRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) => (
  <a href={link} className="bg-neutral-800 hover:bg-neutral-700/80 rounded-lg p-6 transition-all group">
    <div className="flex items-start justify-between">
        <div>
            <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-neutral-400 mt-2">{description}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-1 transition-transform" />
    </div>
  </a>
);

export function InnovationAutomationContent() {
  const features = [
    {
      icon: <Bot className="h-6 w-6 text-white" />,
      title: "Active Automations",
      description: "Explore active scripts, bots, and automated processes.",
      link: "#"
    },
    {
      icon: <Cpu className="h-6 w-6 text-white" />,
      title: "AI Tools Used",
      description: "Browse generators, analysis systems, and integrations.",
      link: "#"
    },
    {
      icon: <FlaskConical className="h-6 w-6 text-white" />,
      title: "Innovation Projects",
      description: "Track ideas, prototypes, and experiment results.",
      link: "#"
    },
    {
      icon: <Search className="h-6 w-6 text-white" />,
      title: "New Tech Research",
      description: "Review notes, tests, and findings on new technologies.",
      link: "#"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-white" />,
      title: "Pending Improvements",
      description: "See what can be optimized and find recommendations.",
      link: "#"
    }
  ];

  return (
    <main className="flex-1 p-8 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Innovation & Automation (R&D / AI)</h1>
        <p className="text-neutral-400 text-lg mb-10">Integrate new technologies, automate processes, and improve efficiency.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}
