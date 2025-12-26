import { Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold">
                <span className="text-primary">Udreamms</span>
              </div>
            </div>
            <p className="text-foreground/80 leading-relaxed max-w-md">
              Tu aliado estratégico para estudiar inglés en USA. Te acompañamos en cada etapa de tu aventura americana, desde la preparación hasta tu éxito en Estados Unidos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-foreground/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/destinos" className="hover:text-primary transition-colors">Destinos</Link>
              </li>
              <li>
                <Link href="/brochures" className="hover:text-primary transition-colors">Brochures</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contáctanos</h4>
            <div className="space-y-3 text-foreground/80 text-sm">
              <div>
                <a href="mailto:info@udreamms.com" className="text-primary hover:underline">
                  info@udreamms.com
                </a>
              </div>
              <div className="pt-2">
                <div>Teléfono: +1 650 784 0581</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-foreground/60 text-sm">
              © 2025 Udreamms. Todos los derechos reservados.
            </div>
            <div className="text-foreground/60 text-sm">
              udreamms.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;