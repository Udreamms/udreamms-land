"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function SimplifiedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-center relative">
        <Link href="/" className="flex items-center gap-3 z-50 shrink-0 group">
           <div className="w-9 h-9 relative transition-transform duration-300 group-hover:scale-110">
              <img src="/assets/Logo Udreamms.png" alt="Udreamms" className="object-contain w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
           </div>
           <span className="text-xl font-bold tracking-tight text-white transition-colors">Udreamms</span>
        </Link>
      </div>
    </header>
  );
}
