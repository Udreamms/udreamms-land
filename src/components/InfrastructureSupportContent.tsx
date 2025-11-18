'use client';

import { HardDrive, Wifi, Server, LifeBuoy, Wrench, ChevronRight } from 'lucide-react';

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

export function InfrastructureSupportContent() {
  const features = [
    {
      icon: <HardDrive className="h-6 w-6 text-white" />,
      title: "Technical Inventory",
      description: "Manage equipment, software, and accessories.",
      link: "#"
    },
    {
      icon: <Wifi className="h-6 w-6 text-white" />,
      title: "Networks & Connectivity",
      description: "Access configurations and the network map.",
      link: "#"
    },
    {
      icon: <Server className="h-6 w-6 text-white" />,
      title: "Servers / Hosting",
      description: "Check access credentials and current server status.",
      link: "#"
    },
    {
      icon: <LifeBuoy className="h-6 w-6 text-white" />,
      title: "Internal Support (Helpdesk)",
      description: "Find common issues, guides, and the ticket log.",
      link: "#"
    },
    {
      icon: <Wrench className="h-6 w-6 text-white" />,
      title: "Maintenance",
      description: "Review weekly/monthly checklists and preventive tasks.",
      link: "#"
    },
  ];

  return (
    <main className="flex-1 p-8 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Infrastructure & Support</h1>
        <p className="text-neutral-400 text-lg mb-10">Maintain the network, equipment, services, and resolve technical issues.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}
