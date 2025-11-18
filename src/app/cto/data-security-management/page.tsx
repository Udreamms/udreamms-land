'use client';

import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DataSecurityManagementContent } from '../../../components/DataSecurityManagementContent';

export default function DataSecurityManagementPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <DataSecurityManagementContent />
    </div>
  );
}
