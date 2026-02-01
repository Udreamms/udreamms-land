"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// Typewriter Effect Component
export const TypewriterText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    const [displayText, setDisplayText] = useState('');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let currentIndex = 0;

        if (isInView) {
            const startTimeout = setTimeout(() => {
                const typeChar = () => {
                    if (currentIndex < text.length) {
                        setDisplayText(prev => prev + text.charAt(currentIndex));
                        currentIndex++;
                        timeoutId = setTimeout(typeChar, 40);
                    }
                };
                typeChar();
            }, delay);

            return () => {
                clearTimeout(startTimeout);
                clearTimeout(timeoutId);
            };
        }
    }, [text, delay, isInView]);

    return (
        <span ref={ref} className={`${className}`}>
            {displayText}
            <span className="inline-block w-[2px] h-[1em] bg-current ml-1 animate-pulse align-middle" />
        </span>
    );
};

// Reusable FadeIn Component
export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// Reusable ScaleIn Component
export const ScaleIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);
