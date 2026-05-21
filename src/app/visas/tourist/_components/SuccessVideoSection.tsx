"use client";

import { useState, useRef } from "react";
import { FadeIn } from "./Animations";
import { Volume2, VolumeX } from "lucide-react";

export default function SuccessVideoSection() {
    const [isMuted, setIsMuted] = useState(true);
    const videoId = "fzrRzLDcm0c";

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: nextMute ? 'mute' : 'unMute', args: [] }),
                '*'
            );
        }
    };

    const getEmbedUrl = () => {
        let params = `autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&controls=0&mute=1&enablejsapi=1`;
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    };

    return (
        <div className="w-full bg-white py-12">
            <FadeIn className="max-w-[calc(100%-150px)] mx-auto relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-black aspect-video group cursor-pointer">
                {/* YouTube Embed */}
                <iframe
                    ref={iframeRef}
                    key="success-video"
                    onLoad={() => {
                        if (!isMuted && iframeRef.current?.contentWindow) {
                            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
                        }
                    }}
                    src={getEmbedUrl()}
                    className="w-full h-full block"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    frameBorder="0"
                />

                {/* Overlay for Toggling Sound */}
                <div
                    className="absolute inset-0 bg-transparent z-10"
                    onClick={toggleMute}
                />

                {/* Sound Indicator Icon */}
                <div className="absolute bottom-10 right-10 z-20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </div>
                </div>

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </FadeIn>
        </div>
    );
}
