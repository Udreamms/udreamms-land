// src/app/cso/page.tsx
import { CsoSidebar } from '../../components/CsoSidebar';

export default function CsoPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <CsoSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Panel Principal de CSO</h1>
        <p className="mt-2 text-neutral-400">Selecciona una opción del menú lateral para comenzar.</p>
      </main>
    </div>
  );
}
