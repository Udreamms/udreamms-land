'use client';

import { Calendar, Briefcase, Book, FolderKanban, FileText, MessageSquare, ChevronRight } from 'lucide-react';

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

export function AreaAdministrationContent() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-white" />,
      title: "Area Agenda",
      description: "Weekly/monthly calendar and important meetings.",
      link: "#"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-white" />,
      title: "Workflows",
      description: "Task management processes and the work cycle: planning, execution, review.",
      link: "#"
    },
    {
      icon: <Book className="h-6 w-6 text-white" />,
      title: "General Documentation",
      description: "Access CTO protocols and internal guides.",
      link: "#"
    },
    {
      icon: <FolderKanban className="h-6 w-6 text-white" />,
      title: "Active Projects",
      description: "Track project dates, statuses, and priorities.",
      link: "#"
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Reports & Decisions",
      description: "Log of important decisions, changes, improvements, and reviews.",
      link: "#"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "Internal Communication",
      description: "Guidelines for our communication channels and norms.",
      link: "#"
    }
  ];

  return (
    <main className="flex-1 p-8 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Area Administration</h1>
        <p className="text-neutral-400 text-lg mb-10">Organize the general functioning of the technical department.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}
