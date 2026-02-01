"use client";

import { FadeIn } from "./Animations";

export default function SuccessVideoSection() {
    return (
        <div className="w-full bg-white py-12">
            <FadeIn className="max-w-[calc(100%-150px)] mx-auto relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-black">
                <video
                    src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block scale-[1.08] origin-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/40 via-transparent to-abyss/20 pointer-events-none" />
            </FadeIn>
        </div>
    );
}
