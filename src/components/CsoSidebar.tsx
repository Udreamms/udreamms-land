
// src/components/CsoSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart, Users, DollarSign, Target, ArrowLeft, MessageSquare, Cog, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export function CsoSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`bg-neutral-900 text-gray-300 flex flex-col space-y-4 p-4 transition-width duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : 'flex'}`}>
            <BarChart className="w-5 h-5" />
            <span className="font-semibold">CSO Dashboard</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li>
            <Link href="/cso" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <BarChart className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>Sales Analytics</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <Users className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>Team Performance</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <DollarSign className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>Revenue</span>
            </Link>
          </li>
          <li>
            <Link href="#" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <Target className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>Sales Goals</span>
            </Link>
          </li>
          <li>
            <Link href="/cso/whatsapp" className={`flex items-center p-2 bg-neutral-700 rounded-md text-white text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <MessageSquare className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>WhatsApp</span>
            </Link>
          </li>
           <li>
            <Link href="/cso/automation" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
              <Cog className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>Automation</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <Link href="/dashboard" className={`flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm ${isCollapsed ? 'justify-center' : ''}`}>
          <ArrowLeft className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
          <span className={isCollapsed ? 'hidden' : 'block'}>Back to Main Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
