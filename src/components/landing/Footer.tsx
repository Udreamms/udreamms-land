import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left Section */}
          <div className="md:col-span-1">
            <p className="text-white text-2xl font-medium tracking-tight">Haciendo que Udreamms sea útil para todos</p>
            <div className="mt-8">
              <img src="/icons/new-icon-udreamms.png" alt="Udreamms Logo" className="w-16 h-auto opacity-80 mb-4" />
              <p className="text-gray-500 text-sm">
                Tu puente seguro a los Estados Unidos.
                <br />
                Visa, Estudios, Vida.
              </p>
            </div>
          </div>

          {/* Programas Educativos / Visas */}
          <div className="mb-24">
            <h4 className="font-medium mb-3 text-sm text-slate-200">Visas y Programas</h4>
            <ul className="text-gray-400 space-y-2 text-sm mb-4">
              <li>
                <Link href="/visas/student" className="hover:text-white transition-colors">Visa de Estudiante (F-1)</Link>
              </li>
              <li>
                <Link href="/visas/tourist" className="hover:text-white transition-colors">Visa de Turismo (B1/B2)</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">Cursos de Inglés</Link>
              </li>
            </ul>

            <h4 className="font-medium mt-16 mb-3 text-sm text-slate-200">Confianza y Legal</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Transparencia en Visas</Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">Soporte al Estudiante</Link>
              </li>
            </ul>
          </div>

          {/* Tu Vida en USA - CONECTADO A SERVICIOS */}
          <div className="mb-24">
            <h4 className="font-medium mb-3 text-sm text-slate-200">Ecosistema de Llegada</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Vivienda Segura</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Apertura de Cuenta Bancaria</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Sim Card y Móvil</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Transporte y Aeropuerto</Link>
              </li>
            </ul>

            {/* Sobre Udreamms */}
            <h4 className="font-medium mt-16 mb-3 text-sm text-slate-200">Sobre Udreamms</h4>
            <ul className="text-gray-400 space-y-2 text-sm mt-auto">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Nuestra Historia</Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-white transition-colors">Programa de Afiliados</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contáctanos</Link>
              </li>
              <li className="pt-4">
                <span className="text-gray-400 block">📞 +1 650 784 0581</span>
                <span className="text-gray-400 block">✉️ udreamms@gmail.com</span>
                <span className="text-gray-400 block">📍 Salt Lake City, Utah</span>
              </li>
            </ul>
          </div>

          {/* Oportunidades y Destinos */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-slate-200">Comunidad</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/destinos" className="hover:text-white transition-colors">Destinos Top en USA</Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-white transition-colors">Universidades Aliadas</Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors">Testimonios Reales</Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors font-medium text-white">Portal de Cliente</Link>
              </li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-slate-200">Síguenos</h4>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/udreamms/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/f.jpg" alt="Facebook" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://www.instagram.com/_udreamms/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/i.jpg" alt="Instagram" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://wa.me/13858882799?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/w.jpg" alt="Whatsapp" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://x.com/udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/x.jpg" alt="X" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://www.youtube.com/@udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/y.jpg" alt="YouTube" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://www.tiktok.com/@udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/t.jpg" alt="TikTok" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="items-center flex mt-20 flex-col md:flex-row gap-4">
          <Link href="/" className="text-white text-lg font-medium hover:text-white transition-colors tracking-tight">Udreamms</Link>
          <div className="flex justify-center space-x-6 w-full flex-wrap">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs">Acerca de Udreamms</Link>
            <Link href="/visas/student" className="text-gray-400 hover:text-white transition-colors text-xs">Visa Estudiante</Link>
            <Link href="/visas/tourist" className="text-gray-400 hover:text-white transition-colors text-xs">Visa Turismo</Link>
            <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-xs">Privacidad</Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-xs">Términos</Link>
          </div>
          <div className="text-gray-600 text-[10px] w-full text-center md:text-right">
            © {new Date().getFullYear()} Udreamms LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;