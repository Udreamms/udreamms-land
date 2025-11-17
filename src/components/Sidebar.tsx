import Link from 'next/link';
import {
  Menu, Search, Home, Briefcase, Bot, Inbox, Settings, Trash2, ChevronDown,
  Heart, Wrench, Package, Megaphone, Landmark, Scale, BarChart, User, Database, Users, Code
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <aside className={`bg-neutral-900 text-gray-300 flex flex-col space-y-4 transition-all duration-300 ${isCollapsed ? 'w-20 p-2' : 'w-72 p-4'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <button onClick={toggleSidebar} className="p-2 hover:bg-neutral-700 rounded-md">
                <Menu className="w-5 h-5" />
            </button>
            {!isCollapsed && (
            <>
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">Sovereign</span>
            </>
            )}
        </div>
        {!isCollapsed && <ChevronDown className="w-5 h-5" />}
      </div>

      <nav>
        <ul>
          <li>
            <Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm">
              <Search className="w-4 h-4 mr-3" /> {!isCollapsed && 'Search'}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-2 bg-neutral-700 rounded-md text-white text-sm">
              <Home className="w-4 h-4 mr-3" /> {!isCollapsed && 'Home'}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm">
              <Briefcase className="w-4 h-4 mr-3" /> {!isCollapsed && 'Meetings'} {!isCollapsed && <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-md">New</span>}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm">
              <Bot className="w-4 h-4 mr-3" /> {!isCollapsed && 'Notion AI'}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm">
              <Inbox className="w-4 h-4 mr-3" /> {!isCollapsed && 'Inbox'} {!isCollapsed && <span className="ml-auto text-xs bg-red-600 text-white px-2 rounded-full">53</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="space-y-2 pt-4">
        {!isCollapsed && <h3 className="text-sm px-2 text-gray-500">Team Spaces</h3>}
        <ul>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Home className="w-4 h-4 mr-3" /> {!isCollapsed && 'Sovereign HQ'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Heart className="w-4 h-4 mr-3" /> {!isCollapsed && 'CEM (Customer Experience...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Wrench className="w-4 h-4 mr-3" /> {!isCollapsed && 'COO (Chief Operating...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Package className="w-4 h-4 mr-3" /> {!isCollapsed && 'CPO (Chief Product Officer)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Megaphone className="w-4 h-4 mr-3" /> {!isCollapsed && 'CMO (Chief Marketing...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Landmark className="w-4 h-4 mr-3" /> {!isCollapsed && 'CFO (Chief Financial...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Scale className="w-4 h-4 mr-3" /> {!isCollapsed && 'CLO (Chief Legal Officer)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><BarChart className="w-4 h-4 mr-3" /> {!isCollapsed && 'CSO (Chief Sales Officer)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><User className="w-4 h-4 mr-3" /> {!isCollapsed && 'CEO (Chief Executive...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Database className="w-4 h-4 mr-3" /> {!isCollapsed && 'CIO (Chief Information...)'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Users className="w-4 h-4 mr-3" /> {!isCollapsed && 'CHRO (Chief Human...)'}</Link></li>
          <li><Link href="/cto" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Code className="w-4 h-4 mr-3" /> {!isCollapsed && 'CTO (Chief Technology...)'}</Link></li>
        </ul>
      </div>

      <div className="mt-auto space-y-2">
        <ul>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Settings className="w-4 h-4 mr-3" /> {!isCollapsed && 'Settings'}</Link></li>
          <li><Link href="#" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Trash2 className="w-4 h-4 mr-3" /> {!isCollapsed && 'Trash'}</Link></li>
        </ul>
      </div>
    </aside>
  );
}
