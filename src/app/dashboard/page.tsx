"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Dashboard } from '../../components/Dashboard';

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <Dashboard />
    </div>
  );
}
