import Link from 'next/link';
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left Section */}
          <div className="md:col-span-1">
            <p className="text-white text-2xl"><strong>Haciendo que Udreamms sea útil para todos</strong></p>
          </div>

          {/* Products and Responsibility */}
          <div className="mb-24">
            <h4 className="font-semibold mb-3 text-sm">Productos</h4>
            <ul className="text-gray-400 space-y-2 text-sm mb-4">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Descubre cómo la IA puede ser útil, desde el trabajo hasta la vida cotidiana</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para el conocimiento</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para la creatividad</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para la productividad</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para estudiantes</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para experimentar</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Explorar productos</Link>
              </li>
            </ul>

            <h4 className="font-semibold mt-16 mb-3 text-sm">Responsabilidad</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Estamos construyendo e implementando la IA de manera responsable</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Responsabilidad y seguridad</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Política</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Construyendo para todos</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors mb-20">Impacto social</Link>
              </li>
            </ul>
          </div>

          {/* Build */}
          <div className="mb-24">
            <h4 className="font-semibold mb-3 text-sm">Construir</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Comience a construir con modelos y herramientas de IA de vanguardia</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Empezar a construir</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Codifica con asistencia de IA</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Aproveche los marcos y las herramientas</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Construye con la IA de Google</Link>
              </li>
            </ul>

            {/* About */}
            <h4 className="font-semibold mt-16 mb-3 text-sm">Acerca de</h4>
            <ul className="text-gray-400 space-y-2 text-sm mt-auto">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Estamos comprometidos a mejorar la vida de tantas personas como sea posible</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Por qué la IA</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Nuestro viaje de IA</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Principios de la IA</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Para organizaciones</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Aprenda habilidades de IA</Link>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Investigación</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Abordar los problemas más desafiantes de la informática</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Salud</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Ciencia</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Sostenibilidad</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Explorar más investigación</Link>
              </li>
            </ul>
          </div>

          {/* Síganos */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Síganos</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/f.jpg" alt="Facebook" width={32} height={32} /></Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/i.jpg" alt="Instagram" width={32} height={32} /></Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/w.jpg"  alt="Whatsapp" width={32} height={32} /></Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/x.jpg" alt="X" width={32} height={32} /></Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/y.jpg" alt="YouTube" width={32} height={32} /></Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors"><Image src="/assets/t.jpg" alt="TikTok" width={32} height={32} /></Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className=" items-center flex mt-20">
          <span className="text-white text-lg">Udreamms</span>
          {/* Centered About Links */}
          <div className="flex justify-center space-x-3 w-full">
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors text-xs">Acerca de Udreamms</Link>
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors text-xs">Productos de Udreamms</Link>
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors text-xs">Privacidad</Link>
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors text-xs">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;