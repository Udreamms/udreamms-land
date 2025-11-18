'use client';

import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { CtoContent } from '../../components/CtoContent';

export default function CtoPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <CtoContent />
    </div>
  );
}
