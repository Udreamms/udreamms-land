import { Mail, Calculator, Download } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  onGetQuote?: () => void;
}

const TopBar = ({ onGetQuote }: TopBarProps) => {
  return (
    <div className="bg-primary text-primary-foreground py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <Link 
            href="/contact" 
            className="flex items-center gap-2 hover:text-primary-glow transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Contacta a un Asesor</span>
          </Link>
          
          <button 
            onClick={onGetQuote}
            className="flex items-center gap-2 hover:text-primary-glow transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Obtén una Cuota</span>
          </button>
          
          <Link 
            href="/brochures"
            className="flex items-center gap-2 hover:text-primary-glow transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Descarga un Brochure</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
