'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Cpu,
    Globe,
    LineChart,
    Scale,
    Shield,
    Users,
    Landmark,
    Lightbulb,
    Heart
} from 'lucide-react';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as any }
    }
};

const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 0.3,
        transition: { duration: 1.5, ease: "easeInOut" as any, delay: 0.5 }
    }
};

interface OrgNodeProps {
    href: string;
    icon: any;
    title: string;
    subtitle: string;
    color: string;
    isMain?: boolean;
}

const OrgNode = ({ href, icon: Icon, title, subtitle, color, isMain }: OrgNodeProps) => (
    <Link href={href}>
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`
        relative flex flex-col items-center justify-center text-center p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer group bg-neutral-900/50
        ${isMain ? 'w-64 h-40 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'w-56 h-36 border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}
      `}
        >
            <div className={`
        mb-3 p-3 rounded-xl bg-black/50 ring-1 ring-white/10 shadow-inner group-hover:ring-${color}-500/50 transition-all
      `}>
                <Icon className={`w-6 h-6 text-${color}-400 group-hover:text-${color}-300 transition-colors`} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-1">{title}</h3>
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest group-hover:text-neutral-300">{subtitle}</p>

            {/* Decorative Glow */}
            <div className={`absolute inset-0 rounded-2xl bg-${color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10`} />
        </motion.div>
    </Link>
);

export default function SuiteDashboard() {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-blue-500/30">

            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                className="relative z-10 max-w-7xl mx-auto px-4 py-20 flex flex-col items-center min-h-screen"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <motion.div className="text-center mb-16" variants={itemVariants}>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Autonomous Enterprise
                    </h1>
                    <p className="text-neutral-400 text-sm uppercase tracking-[0.2em] font-medium">Organizational Structure</p>
                </motion.div>

                {/* ORGANIGRAM TREE STRUCTURE */}
                <div className="flex flex-col items-center w-full gap-12 relative">

                    {/* LEVEL 1: BOARD */}
                    <div className="relative z-20">
                        <OrgNode
                            href="/suite/board"
                            icon={Landmark}
                            title="Board of Directors"
                            subtitle="Governance & Oversight"
                            color="slate"
                            isMain
                        />
                        {/* Connecting Line Down */}
                        <div className="absolute left-1/2 top-full h-12 w-px bg-gradient-to-b from-white/20 to-transparent transform -translate-x-1/2"></div>
                    </div>

                    {/* LEVEL 2: CEO */}
                    <div className="relative z-20">
                        {/* Connecting Line Up */}
                        <div className="absolute left-1/2 bottom-full h-12 w-px bg-gradient-to-t from-white/20 to-transparent transform -translate-x-1/2"></div>

                        <OrgNode
                            href="/suite/ceo"
                            icon={Briefcase}
                            title="CEO"
                            subtitle="Chief Executive Officer"
                            color="blue"
                            isMain
                        />
                        {/* Connecting Lines to Subordinates */}
                        <div className="absolute left-1/2 top-full h-12 w-px bg-white/10 transform -translate-x-1/2"></div>
                        {/* Horizontal Branch Bar */}
                        <div className="absolute top-[calc(100%+3rem)] left-1/2 w-[90%] md:w-[85%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-1/2"></div>
                    </div>

                    {/* LEVEL 3: C-SUITE ROW 1 (Strategy & Ops) */}
                    <div className="flex flex-wrap justify-center gap-8 w-full relative z-20 pt-8">
                        {/* Vertical Connectors for this row would ideally be handled by SVG or individual divs, 
                 but for simplicity in this flex layout, we assume visual connection via the horizontal bar above */}

                        <OrgNode href="/suite/coo" icon={Globe} title="COO" subtitle="Operations" color="emerald" />
                        <OrgNode href="/suite/cfo" icon={LineChart} title="CFO" subtitle="Finance" color="amber" />
                        <OrgNode href="/suite/clo" icon={Scale} title="CLO" subtitle="Legal" color="slate" />
                    </div>

                    {/* LEVEL 3: C-SUITE ROW 2 (Product & Tech) */}
                    <div className="flex flex-wrap justify-center gap-8 w-full relative z-20">
                        <OrgNode href="/suite/cto" icon={Cpu} title="CTO" subtitle="Technology" color="purple" />
                        <OrgNode href="/suite/cpo" icon={Lightbulb} title="CPO" subtitle="Product" color="indigo" />
                        <div className="w-full md:w-auto flex justify-center gap-8">
                            <OrgNode href="/suite/cmo" icon={Users} title="CMO" subtitle="Marketing" color="pink" />
                            <OrgNode href="/suite/chro" icon={Heart} title="CHRO" subtitle="Human Resources" color="rose" />
                        </div>
                    </div>

                </div>

            </motion.div>
        </div>
    );
}
