// src/app/cso/automation/page.tsx
import { CsoSidebar } from '../../../components/CsoSidebar';
import { CsoAutomationContent } from '../../../components/CsoAutomationContent';

export default function CsoAutomationPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <CsoSidebar />
      <CsoAutomationContent />
    </div>
  );
}
