'use client';

import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { AreaAdministrationContent } from '../../../components/AreaAdministrationContent';

export default function AreaAdministrationPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <AreaAdministrationContent />
    </div>
  );
}
