
"use client";
// src/components/CsoAutomationContent.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Clock, Users, FileText, Settings } from "lucide-react";
import { useRouter } from 'next/navigation';

export function CsoAutomationContent() {
  const router = useRouter();

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Quick Replies",
      description: "Create and manage message templates to respond faster to common questions.",
      action: "Manage Templates"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Chatbots",
      description: "Build and deploy chatbots to handle conversations automatically 24/7.",
      action: "Create New Bot"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Suggestions",
      description: "Enable AI-powered response suggestions based on the customer's messages.",
      action: "Configure AI"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Conversation Assignment",
      description: "Set up rules to automatically assign new conversations to specific team members.",
      action: "Set Rules"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Scheduled Messages",
      description: "Manage and view all messages that are scheduled to be sent in the future.",
      action: "View Schedule"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Workflow Rules",
      description: "Create advanced workflows, like adding a tag if a message contains a specific word.",
      action: "Define Workflows"
    }
  ];

  const handleCardClick = (title: string) => {
    if (title === "Chatbots") {
      router.push('/cso/automation/chatbots');
    }
  };

  return (
    <main className="flex-1 p-10 bg-neutral-900 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Automation Hub</h1>
        <p className="text-neutral-400 mt-2">
          Configure tools to streamline your communication and save time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="bg-neutral-800 border-neutral-700 text-white flex flex-col hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
            onClick={() => handleCardClick(feature.title)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </div>
              <CardDescription className="pt-2 text-neutral-400">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="outline" className="w-full bg-neutral-700 hover:bg-neutral-600">
                {feature.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
