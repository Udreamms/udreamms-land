import Link from 'next/link';
import { Share2, LayoutTemplate } from 'lucide-react';

interface CtoSidebarProps {
  isCollapsed: boolean;
}

export function CtoSidebar({ isCollapsed }: CtoSidebarProps) {
  return (
    <aside className={`bg-neutral-900 text-gray-300 flex flex-col space-y-4 transition-all duration-300 ${isCollapsed ? 'w-20 p-2' : 'w-72 p-4'}`}>
      <div className="space-y-2 pt-4">
        {!isCollapsed && <h3 className="text-l px-2 font-bold text-white">CTO Office</h3>}
        <ul>
          <li><Link href="/cto/channels" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><Share2 className="w-4 h-4 mr-3" /> {!isCollapsed && 'Channels'}</Link></li>
          <li><Link href="/cto/web-design" className="flex items-center p-2 hover:bg-neutral-700 rounded-md text-sm"><LayoutTemplate className="w-4 h-4 mr-3" /> {!isCollapsed && 'Web Design'}</Link></li>
        </ul>
      </div>
    </aside>
  );
}
