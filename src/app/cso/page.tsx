// src/app/cso/page.tsx
import { CsoSidebar } from '../../components/CsoSidebar';
import KanbanView from '../../components/KanbanView';

export default function CsoPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <CsoSidebar />
      <KanbanView />
    </div>
  );
}
