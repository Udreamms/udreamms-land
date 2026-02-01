"use client";

import { FadeIn } from "./Animations";

export default function SuccessVideoSection() {
    return (
        <div className="w-full bg-black py-12">
            <FadeIn className="max-w-[calc(100%-40px)] md:max-w-6xl mx-auto relative overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(234,179,8,0.3)] bg-zinc-900 border border-yellow-500/30">
                {/* Placeholder video concept */}
                <div className="aspect-video w-full bg-neutral-800 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <video
                        src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FStadium_Cheering.mp4?alt=media&token=placeholder" // Hypothetical
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                        onError={(e) => e.currentTarget.style.display = 'none'} // Hide if fails
                    />
                    {/* Fallback overlay if video fails or acts as poster */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                        <h3 className="text-4xl md:text-6xl font-black italic text-white mb-4 drop-shadow-2xl">
                            VIVE LA PASIÓN <span className="text-yellow-500">EN VIVO</span>
                        </h3>
                        <p className="text-xl text-gray-300 max-w-2xl font-light">
                            Siente el rugido del estadio. Nosotros nos encargamos del papeleo.
                        </p>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
