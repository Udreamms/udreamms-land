
// src/components/CsoSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Users,
  DollarSign,
  Target,
  ArrowLeft,
  MessageSquare,
  Cog,
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Contact,
  Mic,
  Video,
  Send,
  Layout,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: "/cso", icon: BarChart, label: "Sales Analytics" },
  { href: "/cso/team", icon: Users, label: "Team Performance" },
  { href: "/cso/revenue", icon: DollarSign, label: "Revenue" },
  { href: "/cso/goals", icon: Target, label: "Sales Goals" },
  { href: "/cso/whatsapp", icon: MessageSquare, label: "Mailbox" },
  { href: "/cso/contacts", icon: Contact, label: "Contacts" },
  { href: "/cso/automation", icon: Cog, label: "Automation" },
  { href: "/cso/voice-center", icon: Mic, label: "Voice AI" },
  { href: "/cso/meet-agents", icon: Video, label: "Meet Agents" },
  { href: "/cso/campaigns", icon: Send, label: "Campaigns" },
  { href: "/cso/web-builder", icon: Layout, label: "Web Builder" },
  { href: "/cso/orchestrator", icon: Zap, label: "Orchestrator" },
];

import { useSidebar } from '@/components/SidebarContext'; // Import hook

export function CsoSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={`bg-neutral-950 border-r border-neutral-800 text-neutral-300 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-44'}`}>
        <div className={`flex items-center p-4 h-16 border-b border-neutral-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CSO Dash</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-neutral-800 text-neutral-400 hover:text-white">
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-grow p-2 flex flex-col">
          <ul className="space-y-1 flex-grow">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
                <div className={`flex items-center p-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-white/5 text-neutral-400 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
                  <span className={isCollapsed ? 'hidden' : 'block'}>{item.label}</span>
                </div>
              );

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>{linkContent}</Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={item.href}>{linkContent}</Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-4 border-t border-neutral-800/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className={`flex items-center p-2.5 hover:bg-white/5 rounded-lg text-xs text-neutral-400 hover:text-white transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-lg ${isCollapsed ? '' : 'mr-3'}`}>
                    N
                  </div>
                  <span className={isCollapsed ? 'hidden' : 'block'}>Back to Main</span>
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                  Back to Main
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </nav>


      </aside>
    </TooltipProvider>
  );
}
