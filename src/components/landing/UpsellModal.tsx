import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2 } from "lucide-react";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export const UpsellModal = ({ isOpen, onClose, total }: UpsellModalProps) => {
  const handleBookPurchase = () => {
    // Aquí iría la lógica de compra del libro
    window.open("https://udreamms.com", "_blank");
  };

  const handleMainPurchase = () => {
    // Aquí iría la lógica de compra principal
    window.open("https://udreamms.com", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            ¡Excelente! Tu inversión total es de ${total}
          </DialogTitle>
          <DialogDescription className="text-base">
            Elige cómo quieres proceder con tu sueño americano
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-6">
          <div className="space-y-4 p-6 rounded-lg border-2 border-primary bg-primary/5">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold">Servicio Completo</h3>
            <p className="text-sm text-muted-foreground">
              Nos encargamos de todo el proceso por ti. Solo relájate y prepárate para tu viaje.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Aplicación completa a la escuela</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Preparación para entrevista consular</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Documentación completa</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Soporte 24/7</span>
              </li>
            </ul>
            <Button onClick={handleMainPurchase} className="w-full" size="lg">
              Continuar con ${total}
            </Button>
          </div>

          <div className="space-y-4 p-6 rounded-lg border-2 border-border">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Guía DIY</h3>
              <div className="inline-block mt-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                OFERTA ESPECIAL
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Aprende a hacer el proceso tú mismo con nuestra guía completa.
            </p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-accent">$29.99</span>
                <span className="text-sm text-muted-foreground line-through">$49.99</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ahorra ${total - 29.99} y hazlo por tu cuenta
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Guía paso a paso completa</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Plantillas de documentos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Videos instructivos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Acceso de por vida</span>
              </li>
            </ul>
            <Button onClick={handleBookPurchase} variant="outline" className="w-full" size="lg">
              Obtener la Guía
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
