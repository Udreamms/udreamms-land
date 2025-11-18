'use client';

import { Shield, KeyRound, DatabaseZap, FileClock, Database, HardDrive, ChevronRight } from 'lucide-react';

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

export function DataSecurityManagementContent() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Security Policies",
      description: "Manage passwords, permissions, and allowed devices.",
      link: "#"
    },
    {
      icon: <KeyRound className="h-6 w-6 text-white" />,
      title: "Access Control",
      description: "Define who has access to what, including roles and permissions.",
      link: "#"
    },
    {
      icon: <FileClock className="h-6 w-6 text-white" />,
      title: "Backups",
      description: "Set frequency, locations, and review the copy log.",
      link: "#"
    },
    {
      icon: <DatabaseZap className="h-6 w-6 text-white" />,
      title: "Security Incidents",
      description: "Access the log, analysis, and post-mortems.",
      link: "#"
    },
    {
      icon: <Database className="h-6 w-6 text-white" />,
      title: "Databases",
      description: "Review structure, versions, and table documentation.",
      link: "#"
    },
    {
      icon: <HardDrive className="h-6 w-6 text-white" />,
      title: "Protection Tools",
      description: "Manage antivirus, firewalls, and MFA configurations.",
      link: "#"
    }
  ];

  return (
    <main className="flex-1 p-8 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Data Security & Management</h1>
        <p className="text-neutral-400 text-lg mb-10">Protect the company's information, access, and digital integrity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}
