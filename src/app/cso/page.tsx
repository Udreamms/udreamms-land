// src/app/cso/page.tsx
import { CsoSidebar } from '../../components/CsoSidebar';

export default function CsoPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <CsoSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Panel Principal de CSO</h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>
      </main>
    </div>
  );
}
