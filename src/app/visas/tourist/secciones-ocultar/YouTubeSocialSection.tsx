"use client";

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z" fill="currentColor" />
        <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="white" />
    </svg>
);

export default function YouTubeSocialSection() {
    return (
        <section className="py-24 md:py-32 bg-transparent overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,0,0.05),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,0,0,0.03),transparent_50%)]" />

            <div className="container px-4 relative z-10 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-full mb-6 shadow-2xl animate-pulse">
                            <YouTubeIcon className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
                            ¡Síguenos en YouTube!
                        </h2>
                        <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
                            Descubre consejos, testimonios y guías completas sobre cómo obtener tu visa y vivir el sueño americano.
                            ¡Dí adiós a las dudas!
                        </p>
                    </div>

                    <a
                        href="https://www.youtube.com/@udreamms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-red-600 text-white rounded-full shadow-xl shadow-red-600/20 hover:scale-105 transition-all hover:bg-red-500 group"
                    >
                        <YouTubeIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Suscríbete Ahora
                    </a>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Tips de Visa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse [animation-delay:0.3s]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Testimonios</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse [animation-delay:0.6s]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Guías VIP</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
