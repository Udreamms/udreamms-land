import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useState } from "react";
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleApplyClick = () => {
    setShowPreApplication(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-card shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
              <img 
                src="/assets/logo-udreamms.png" 
                alt="Udreamms Logo" 
                className="w-10 h-10"
              />
              <div>
                <span className="text-primary">Udreamms</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-foreground font-medium hover:text-primary transition-colors outline-none">
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
            <Link href="/destinos" className="text-foreground font-medium hover:text-primary transition-colors">
              Destinos
            </Link>
            <Link href="/faqs" className="text-foreground font-medium hover:text-primary transition-colors">
              FAQs
            </Link>
            <Link href="/brochures" className="text-foreground font-medium hover:text-primary transition-colors">
              Brochures
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                size="lg"
                className="hidden md:flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Plataforma
              </Button>
            </Link>
            <Button 
              size="lg"
              onClick={handleApplyClick}
              className="hidden md:block bg-primary text-white hover:bg-primary/90"
            >
              Aplica Ahora
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-soft"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
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
                  className="w-full flex items-center justify-center gap-2"
                >
                   <User className="h-4 w-4" />
                   Plataforma
                </Button>
              </Link>

              <Button 
                size="lg" 
                className="w-full mt-2 bg-primary text-white hover:bg-primary/90"
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
