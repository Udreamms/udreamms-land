import Link from 'next/link';
import Image from 'next/image';

const SimplifiedFooter = () => {
    return (
        <footer className="bg-black text-white py-12 border-t border-slate-900">
            <div className="container mx-auto px-6 max-w-4xl text-center">

                {/* Logo minimalista */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <img src="/assets/Logo Udreamms.png" alt="Udreamms" className="w-6 h-6" />
                        <span className="text-lg font-bold tracking-tight">Udreamms</span>
                    </div>
                </div>

                <p className="text-slate-600 text-sm mb-8">
                    Tu puente seguro a los Estados Unidos.
                </p>

                {/* Legal Links Only */}
                <div className="flex justify-center gap-6 text-xs text-slate-500 mb-8">
                    <Link href="/privacidad" className="hover:text-slate-300 transition-colors">Política de Privacidad</Link>
                    <Link href="/terminos" className="hover:text-slate-300 transition-colors">Términos y Condiciones</Link>
                </div>

                <div className="text-slate-700 text-[10px]">
                    © {new Date().getFullYear()} Udreamms LLC. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default SimplifiedFooter;
