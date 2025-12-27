import { Mail, Calculator, Download } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  onGetQuote?: () => void;
}

const TopBar = ({ onGetQuote }: TopBarProps) => {
  return (
    // CAMBIO: bg-primary -> bg-black
    <div className="bg-black text-white py-3 border-b border-white/10 hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <Link 
            href="/contact" 
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Mail className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            <span className="text-sm font-medium hidden sm:inline">Contacta a un Asesor</span>
          </Link>
          
          <button 
            onClick={onGetQuote}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Calculator className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            <span className="text-sm font-medium hidden sm:inline">Obtén una Cuota</span>
          </button>
          
          <Link 
            href="/brochures"
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Download className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            <span className="text-sm font-medium hidden sm:inline">Descarga un Brochure</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
