'use client';

import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { InnovationAutomationContent } from '../../../components/InnovationAutomationContent';

export default function InnovationAutomationPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <InnovationAutomationContent />
    </div>
  );
}
