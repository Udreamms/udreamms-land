import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left Section */}
          <div className="md:col-span-1">
            <p className="text-white text-2xl"><strong>Haciendo que Udreamms sea útil para todos</strong></p>
          </div>

          {/* Programas Educativos */}
          <div className="mb-24">
            <h4 className="font-semibold mb-3 text-sm">Programas Educativos</h4>
            <ul className="text-gray-400 space-y-2 text-sm mb-4">
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">Inglés Intensivo (Presencial)</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">Inglés Online (Desde casa)</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">Preparación TOEFL & IELTS</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">Inglés de Negocios</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Simulación de Entrevista Consular</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Asesoría para Visa F1 y B1/B2</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">Explorar todos los cursos</Link>
              </li>
            </ul>

            <h4 className="font-semibold mt-16 mb-3 text-sm">Confianza y Legal</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Transparencia en Visas (No somos Gobierno)</Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Nuestro Compromiso Ético</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-primary transition-colors">Soporte al Estudiante Internacional</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Aviso Legal Importante</Link>
              </li>
            </ul>
          </div>

          {/* Tu Vida en USA */}
          <div className="mb-24">
            <h4 className="font-semibold mb-3 text-sm">Tu Vida en USA</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Encuentra tu Vivienda / Homestay</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Seguro Médico Estudiantil</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Cuenta Bancaria en EE. UU.</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Planes de Celular y Conectividad</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Movilidad (Autos, Scooters, Bus)</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Empieza tu viaje hoy</Link>
              </li>
            </ul>

            {/* Sobre Udreamms */}
            <h4 className="font-semibold mt-16 mb-3 text-sm">Sobre Udreamms</h4>
            <ul className="text-gray-400 space-y-2 text-sm mt-auto">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Nuestra Historia y Misión</Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-primary transition-colors">Programa de Afiliados (Gana con nosotros)</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Trabaja con el equipo</Link>
              </li>
              <li>
                <span className="text-gray-400">📞 +1 385 888 2799</span>
              </li>
              <li>
                <span className="text-gray-400">✉️ udreamms@gmail.com</span>
              </li>
              <li>
                <span className="text-gray-400">📍 Salt Lake City, Utah</span>
              </li>
            </ul>
          </div>

          {/* Oportunidades y Destinos */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Oportunidades y Destinos</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="/destinos" className="hover:text-primary transition-colors">Destinos en Estados Unidos (Utah, etc.)</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Becas y Oportunidades Laborales</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Viajes y Aventuras (Turismo)</Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-primary transition-colors">Universidades Aliadas</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-primary transition-colors">Testimonios de Estudiantes</Link>
              </li>
              <li>
                <Link href="/destinos" className="hover:text-primary transition-colors">Ver mapa de destinos</Link>
              </li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Síguenos</h4>
            <ul className="text-gray-400 space-y-4 text-sm">
              <li>
                <a href="https://www.facebook.com/udreamms/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/f.jpg" alt="Facebook" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
              <li>
                <a href="https://www.instagram.com/udreamms/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/i.jpg" alt="Instagram" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/JTQ2ZVfqv3J9CRm5ydG8t3?mode=r_t" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/w.jpg"  alt="Whatsapp" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
              <li>
                <a href="https://x.com/udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/x.jpg" alt="X" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
              <li>
                <a href="https://www.youtube.com/@udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/y.jpg" alt="YouTube" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@udreamms" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/t.jpg" alt="TikTok" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className=" items-center flex mt-20">
          <Link href="/" className="text-white text-lg font-bold hover:text-primary transition-colors">Udreamms</Link>
          <div className="flex justify-center space-x-3 w-full">
            <Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-xs">Acerca de Udreamms</Link>
            <Link href="/courses" className="text-gray-400 hover:text-primary transition-colors text-xs">Programas</Link>
            <Link href="/privacidad" className="text-gray-400 hover:text-primary transition-colors text-xs">Privacidad</Link>
            <Link href="/terminos" className="text-gray-400 hover:text-primary transition-colors text-xs">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;