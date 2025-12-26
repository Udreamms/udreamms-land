import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import PreApplicationForm from "./PreApplicationForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreApplication, setShowPreApplication] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleApplyClick = () => {
    setShowPreApplication(true);
    setIsMobileMenuOpen(false);
  };

  const textColorClass = isScrolled ? "text-foreground" : "text-white";
  const hoverColorClass = "hover:text-primary";

  const buttonBaseClass = `hidden md:flex items-center gap-2 rounded-full px-6 font-semibold transition-all duration-300 border-0 ${
    !isScrolled 
      ? "text-white hover:bg-white/20" 
      : "text-foreground hover:bg-black/5 hover:text-primary"
  }`;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-card/95 backdrop-blur shadow-md" 
          : "bg-transparent"
      }`}
    >
      {/* CAMBIO: Quitamos 'container mx-auto' y usamos 'w-full' con paddings laterales mayores (px-6 md:px-12) */}
      <div className={`w-full px-6 md:px-12 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="flex items-center justify-between">
          
          {/* GRUPO IZQUIERDO */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
              <img 
                src="/assets/Logo Udreamms.png" 
                alt="Udreamms Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className={isScrolled ? "text-primary" : "text-white"}>Udreamms</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center font-medium transition-colors outline-none ${textColorClass} ${hoverColorClass}`}>
                  Cursos
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      Inglés Intensivo Presencial
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      Inglés Online
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      TOEFL Preparación
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      IELTS Program
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      Inglés de Negocios
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses" className="cursor-pointer">
                      Inglés Intercultural
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/destinos" className={`font-medium transition-colors ${textColorClass} ${hoverColorClass}`}>
                Destinos
              </Link>
              <Link href="/faqs" className={`font-medium transition-colors ${textColorClass} ${hoverColorClass}`}>
                FAQs
              </Link>
              <Link href="/brochures" className={`font-medium transition-colors ${textColorClass} ${hoverColorClass}`}>
                Brochures
              </Link>
            </nav>
          </div>
          
          {/* GRUPO DERECHO */}
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="lg"
                className={buttonBaseClass}
              >
                Administrar
              </Button>
            </Link>
            
            <Button 
              variant="ghost"
              size="lg"
              onClick={handleApplyClick}
              className={buttonBaseClass}
            >
              Aplica Ahora
            </Button>
            
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-3 rounded-full transition-colors shadow-soft ${
                isScrolled 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-white/10 text-white backdrop-blur hover:bg-white/20"
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-card absolute left-0 right-0 px-4 shadow-xl animate-in slide-in-from-top-5">
            <nav className="flex flex-col space-y-4 pt-4">
              <div className="space-y-2">
                <div className="text-foreground font-semibold">Cursos</div>
                <div className="pl-4 space-y-2">
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Inglés Intensivo Presencial
                  </Link>
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Inglés Online
                  </Link>
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    TOEFL Preparación
                  </Link>
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    IELTS Program
                  </Link>
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Inglés de Negocios
                  </Link>
                  <Link 
                    href="/courses" 
                    className="block text-foreground/80 hover:text-primary transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Inglés Intercultural
                  </Link>
                </div>
              </div>
              <Link 
                href="/destinos" 
                className="text-foreground font-medium hover:text-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                Destinos
              </Link>
              <Link 
                href="/faqs" 
                className="text-foreground font-medium hover:text-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                FAQs
              </Link>
              <Link 
                href="/brochures" 
                className="text-foreground font-medium hover:text-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                Brochures
              </Link>
              
              <Link href="/login" onClick={toggleMobileMenu}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full flex items-center justify-center gap-2 rounded-full"
                >
                   Administrar
                </Button>
              </Link>

              <Button 
                size="lg" 
                className="w-full mt-2 rounded-full bg-primary text-white hover:bg-primary/90"
                onClick={handleApplyClick}
              >
                Aplica Ahora
              </Button>
            </nav>
          </div>
        )}
      </div>

      {showPreApplication && (
        <PreApplicationForm onClose={() => setShowPreApplication(false)} />
      )}
    </header>
  );
};

export default Header;
