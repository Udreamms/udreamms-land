// src/app/cso/connection/page.tsx
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ConnectionPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-neutral-800 p-6 rounded-full">
            <MessageCircle size={48} className="text-neutral-500" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No Tienes Canales Conectados</h2>
        <p className="mt-2 max-w-sm text-neutral-400">
            Puedes conectar todas tus cuentas de mensajería empresarial en un solo lugar. Estas cuentas se llaman canales. Conectemos un canal.
        </p>
        <Button className="mt-6">Conectar canal</Button>
    </div>
  );
}
