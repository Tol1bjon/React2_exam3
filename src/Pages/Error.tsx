import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Home, Bug } from 'lucide-react';

interface ErrorProps {
    error?: Error;
    onRetry?: () => void;
}

type Phase =
    | 'wave'
    | 'typing'
    | 'crash'
    | 'coffee_break'
    | 'whiteboard'
    | 'rubber_duck'
    | 'eureka'
    | 'fixing';

const PHASE_TIMINGS: Record<Phase, number> = {
    wave: 2500,
    typing: 3500,
    crash: 3000,
    coffee_break: 4000,
    whiteboard: 4000,
    rubber_duck: 3500,
    eureka: 3000,
    fixing: 4000,
};

const NEXT_PHASE: Record<Phase, Phase> = {
    wave: 'typing',
    typing: 'crash',
    crash: 'coffee_break',
    coffee_break: 'whiteboard',
    whiteboard: 'rubber_duck',
    rubber_duck: 'eureka',
    eureka: 'fixing',
    fixing: 'typing',
};

const GLOW_COLORS: Record<Phase, string> = {
    wave: '#38BDF8',
    typing: '#38BDF8',
    crash: '#EF4444',
    coffee_break: '#F97316',
    whiteboard: '#818CF8',
    rubber_duck: '#FBBF24',
    eureka: '#FACC15',
    fixing: '#10B981',
};

const STATUS_INFO: Record<Phase, { text: string; pill: string; dot: string; label: string }> = {
    wave: {
        label: '👋 Hello',
        text: 'Issue detected, developer on the line!',
        pill: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        dot: 'bg-blue-400',
    },
    typing: {
        label: '💻 Coding',
        text: 'Writing code in the zone... 🎧',
        pill: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
        dot: 'bg-sky-400',
    },
    crash: {
        label: '💥 Bug!',
        text: 'BOOM! 500 Error in production! 💥',
        pill: 'border-red-500/40 bg-red-500/15 text-red-400',
        dot: 'bg-red-500',
    },
    coffee_break: {
        label: '☕ Coffee',
        text: 'Getting a dose of caffeine to ponder... ☕',
        pill: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        dot: 'bg-amber-400',
    },
    whiteboard: {
        label: '📋 Board',
        text: 'Mapping out the architecture on the whiteboard... 📋',
        pill: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
        dot: 'bg-indigo-400',
    },
    rubber_duck: {
        label: '🦆 Duck',
        text: 'Rubber duck method: explaining the bug to the duck... 🦆',
        pill: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
        dot: 'bg-yellow-400',
    },
    eureka: {
        label: '💡 Eureka',
        text: 'Eureka! Found where the memory leak is! 💡',
        pill: 'border-yellow-400/40 bg-yellow-400/15 text-yellow-200',
        dot: 'bg-yellow-300',
    },
    fixing: {
        label: '⚡ Fix',
        text: 'Writing a hotfix at hyperspeed... ⚡',
        pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        dot: 'bg-emerald-400',
    },
};

const PHASE_BADGES: Record<Phase, { text: string; color: string; pos: string }[]> = {
    wave: [
        { text: '>_ git status', color: 'border-sky-500/30 bg-sky-500/10 text-sky-300', pos: 'left-2 top-2' },
        { text: '👋 Hello!', color: 'border-blue-500/30 bg-blue-500/10 text-blue-200', pos: 'right-4 top-4' },
    ],
    typing: [
        { text: 'compiling...', color: 'border-sky-500/30 bg-sky-500/10 text-sky-300', pos: 'left-2 top-2' },
        { text: '⚡ HMR ready', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300', pos: 'right-4 top-4' },
    ],
    crash: [
        { text: '💥 500 Internal Panic', color: 'border-red-500/40 bg-red-500/20 text-red-200 font-bold', pos: 'left-2 top-2' },
        { text: '❌ undefined is not a function', color: 'border-rose-500/40 bg-rose-500/20 text-rose-200 font-bold', pos: 'right-2 top-4' },
        { text: '🚨 CALL ON-CALL DEV', color: 'border-red-600/40 bg-red-600/20 text-red-300', pos: 'left-6 bottom-4' },
    ],
    coffee_break: [
        { text: '☕ Coffee = sanity', color: 'border-amber-500/30 bg-amber-500/10 text-amber-200', pos: 'left-2 top-2' },
        { text: 'Staring at code...', color: 'border-orange-500/30 bg-orange-500/10 text-orange-200', pos: 'right-4 top-4' },
    ],
    whiteboard: [
        { text: 'A -> B -> NULL??', color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200', pos: 'left-2 top-2' },
        { text: '📋 Where is the race condition?!', color: 'border-purple-500/30 bg-purple-500/10 text-purple-200', pos: 'right-4 top-4' },
    ],
    rubber_duck: [
        { text: '🦆 Quack! (Did you check null?)', color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200', pos: 'left-2 top-2' },
        { text: '"Look duck, here is the state..."', color: 'border-amber-500/30 bg-amber-500/10 text-amber-200', pos: 'right-4 top-4' },
    ],
    eureka: [
        { text: '💡 user?.profile?.id !!', color: 'border-yellow-400/40 bg-yellow-400/20 text-yellow-100 font-bold', pos: 'left-2 top-2' },
        { text: '✨ IT WAS THAT SIMPLE!', color: 'border-amber-400/40 bg-amber-400/20 text-amber-100 font-bold', pos: 'right-4 top-4' },
    ],
    fixing: [
        { text: '✓ Patch applied', color: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 font-bold', pos: 'left-2 top-2' },
        { text: '✓ 42/42 tests passed', color: 'border-teal-500/30 bg-teal-500/15 text-teal-200', pos: 'right-4 top-4' },
        { text: '🚀 Deploying hotfix...', color: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300', pos: 'left-6 bottom-4' },
    ],
};

const ALL_PHASES: Phase[] = [
    'wave',
    'typing',
    'crash',
    'coffee_break',
    'whiteboard',
    'rubber_duck',
    'eureka',
    'fixing',
];

const Error: React.FC<ErrorProps> = ({ error, onRetry }) => {
    const { t } = useTranslation();
    const [phase, setPhase] = useState<Phase>('wave');

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase(NEXT_PHASE[phase]);
        }, PHASE_TIMINGS[phase]);
        return () => clearTimeout(timer);
    }, [phase]);

    const glow = GLOW_COLORS[phase];
    const status = STATUS_INFO[phase];
    const badges = PHASE_BADGES[phase];

    // Coordinated torso offsets so arms & head never detach
    const torsoX = phase === 'crash' ? 8 : phase === 'coffee_break' ? 10 : phase === 'whiteboard' ? -10 : 0;
    const torsoY = phase === 'crash' ? -4 : phase === 'coffee_break' ? 2 : phase === 'whiteboard' ? -2 : 0;
    const torsoRotate =
        phase === 'crash'
            ? 4
            : phase === 'coffee_break'
            ? 5
            : phase === 'whiteboard'
            ? -5
            : phase === 'rubber_duck'
            ? 3
            : 0;

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        window.location.href = '/home';
    };

    return (
        <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Dynamic Background Light synced with current phase */}
            <motion.div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]" animate={{ backgroundColor: glow }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
            <div className="pointer-events-none absolute top-1/3 -right-20 h-[380px] w-[380px] rounded-full bg-purple-600/10 blur-[120px]" />

            {/* Subtle grid pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px', }} />

            {/* Red flash shockwave on Crash phase */}
            <AnimatePresence>
                {phase === 'crash' && (
                    <motion.div className="pointer-events-none absolute inset-0 z-20 bg-red-600/25 mix-blend-screen" initial={{ opacity: 0.7 }} animate={{ opacity: [0.7, 0.1, 0.4, 0.05] }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} />
                )}
            </AnimatePresence>

            <div className="relative flex w-full max-w-xl flex-col items-center text-center">
                {/* 3D Antigravity Expanded Scene */}
                <motion.div className="relative mb-2 flex h-[38vh] max-h-[310px] min-h-[185px] w-full items-center justify-center" animate={phase === 'crash' ? { x: [-7, 7, -5, 5, -2, 2, 0], y: [-2, 2, -1, 1, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Floating Badges */}
                    <AnimatePresence mode="popLayout">
                        {badges.map((badge, idx) => (
                            <motion.div key={`${phase}-${idx}`} className={`absolute ${badge.pos} hidden items-center rounded-xl border px-3 py-1 font-mono text-xs shadow-xl backdrop-blur-md sm:flex ${badge.color}`} initial={{ opacity: 0, y: 12, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.85 }} transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}> {badge.text} </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* SVG 3D Isometric Character & Expanded World */}
                    <svg viewBox="30 20 400 355" className="h-full w-auto select-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <linearGradient id="platformTop" x1="100" y1="290" x2="360" y2="350" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#1E293B" />
                                <stop offset="100%" stopColor="#0F172A" />
                            </linearGradient>

                            <linearGradient id="hoodie3D" x1="225" y1="145" x2="290" y2="252" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="35%" stopColor="#3B82F6" />
                                <stop offset="75%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>

                            <linearGradient id="hoodieArm" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="60%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>

                            <linearGradient id="deskTop" x1="120" y1="175" x2="270" y2="255" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#334155" />
                                <stop offset="100%" stopColor="#1E293B" />
                            </linearGradient>

                            <linearGradient id="lidBack" x1="160" y1="167" x2="210" y2="232" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#94A3B8" />
                                <stop offset="55%" stopColor="#64748B" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>

                            {/* Clean, Smooth, Appealing Memoji-Style Skin Gradient */}
                            <linearGradient id="skin3D" x1="224" y1="92" x2="272" y2="148" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FFF1E6" />
                                <stop offset="55%" stopColor="#FFD8BE" />
                                <stop offset="100%" stopColor="#F4B393" />
                            </linearGradient>

                            <linearGradient id="denimJeans" x1="200" y1="230" x2="270" y2="310" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#334155" />
                                <stop offset="40%" stopColor="#1E293B" />
                                <stop offset="100%" stopColor="#0F172A" />
                            </linearGradient>

                            <linearGradient id="sneakerSoleGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="70%" stopColor="#F1F5F9" />
                                <stop offset="100%" stopColor="#CBD5E1" />
                            </linearGradient>

                            <linearGradient id="headphoneGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#94A3B8" />
                                <stop offset="50%" stopColor="#F1F5F9" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>

                            <linearGradient id="bulbGlass" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FFFBEB" />
                                <stop offset="50%" stopColor="#FDE047" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>

                            <radialGradient id="faceLight" cx="0.5" cy="0.5" r="0.5">
                                <stop offset="0%" stopColor={glow} stopOpacity="0.55" />
                                <stop offset="100%" stopColor={glow} stopOpacity="0" />
                            </radialGradient>

                            <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="softBlur">
                                <feGaussianBlur stdDeviation="6" />
                            </filter>
                        </defs>

                        <style>{`
                            @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                            @keyframes steamRise { 0% { opacity: 0; transform: translateY(0) scaleX(0.8); } 50% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(-16px) scaleX(1.3); } }
                            @keyframes typeNear { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
                            @keyframes typeFar { 0%, 100% { transform: translateY(-2.5px); } 50% { transform: translateY(0); } }
                            @keyframes duckBob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(4deg); } }
                            @keyframes smokePuff { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 40% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(-25px) scale(1.6); } }
                            @keyframes waveArm { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-18deg); } }
                            .steam-1 { animation: steamRise 2.4s ease-out infinite; }
                            .steam-2 { animation: steamRise 2.8s ease-out 0.8s infinite; }
                            .anim-type-near { animation: typeNear 0.22s ease-in-out infinite; }
                            .anim-type-far { animation: typeFar 0.22s ease-in-out 0.11s infinite; }
                            .anim-type-fast-near { animation: typeNear 0.11s ease-in-out infinite; }
                            .anim-type-fast-far { animation: typeFar 0.11s ease-in-out 0.055s infinite; }
                            .anim-duck { animation: duckBob 2.6s ease-in-out infinite; transform-origin: 320px 225px; }
                            .smoke-1 { animation: smokePuff 1.6s ease-out infinite; }
                            .smoke-2 { animation: smokePuff 1.9s ease-out 0.5s infinite; }
                        `}</style>

                        {/* Floating Antigravity Platform Base */}
                        <g style={{ animation: 'floatSlow 4s ease-in-out infinite' }}>
                            <ellipse cx="230" cy="335" rx="160" ry="40" fill="#000" opacity="0.45" />
                            <path d="M 70 320 C 70 342, 142 360, 230 360 C 318 360, 390 342, 390 320 L 390 330 C 390 352, 318 370, 230 370 C 142 370, 70 352, 70 330 Z" fill="#090D16" />
                            <path d="M 70 320 C 70 342, 142 360, 230 360 C 318 360, 390 342, 390 320" stroke={glow} strokeWidth={phase === 'crash' ? 4 : 3} filter="url(#neonBlur)" style={{ transition: 'stroke 0.8s ease' }} />
                            <ellipse cx="230" cy="320" rx="160" ry="40" fill="url(#platformTop)" stroke="#334155" strokeWidth="1.5" />
                            <ellipse cx="230" cy="320" rx="110" ry="26" stroke={glow} strokeWidth="1" strokeDasharray="4 6" opacity="0.3" style={{ transition: 'stroke 0.8s ease' }} />

                            {/* Background: Floating Glass Whiteboard */}
                            <g id="glass-whiteboard" transform="translate(45, 90)">
                                <rect x="0" y="0" width="80" height="95" rx="6" fill="#1E293B" fillOpacity="0.45" stroke="#475569" strokeWidth="1.2" />
                                <rect x="3" y="3" width="74" height="89" rx="4" fill="#0F172A" fillOpacity="0.5" />
                                <rect x="25" y="-3" width="30" height="6" rx="2" fill="#38BDF8" fillOpacity="0.8" />
                                <g stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
                                    <rect x="10" y="14" width="22" height="12" rx="2" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" />
                                    <text x="14" y="22" fontSize="6" fill="#93C5FD" fontFamily="monospace">API</text>
                                    <line x1="32" y1="20" x2="44" y2="20" stroke="#38BDF8" />
                                    <polygon points="44,18 48,20 44,22" fill="#38BDF8" />
                                    <rect x="48" y="14" width="22" height="12" rx="2" fill="#818CF8" fillOpacity="0.15" stroke="#818CF8" />
                                    <text x="51" y="22" fontSize="6" fill="#C7D2FE" fontFamily="monospace">SRV</text>
                                    <line x1="59" y1="26" x2="59" y2="40" stroke="#818CF8" />
                                    <polygon points="57,40 59,44 61,40" fill="#818CF8" />
                                    <ellipse cx="59" cy="48" rx="12" ry="4" fill="#A855F7" fillOpacity="0.2" stroke="#A855F7" />
                                    <line x1="47" y1="48" x2="47" y2="58" stroke="#A855F7" />
                                    <line x1="71" y1="48" x2="71" y2="58" stroke="#A855F7" />
                                    <ellipse cx="59" cy="58" rx="12" ry="4" fill="#A855F7" fillOpacity="0.2" stroke="#A855F7" />
                                    {phase === 'whiteboard' ? (
                                        <g stroke="#F43F5E" strokeWidth="1.5">
                                            <circle cx="24" cy="48" r="8" fill="none" />
                                            <line x1="18" y1="42" x2="30" y2="54" />
                                            <line x1="30" y1="42" x2="18" y2="54" />
                                            <text x="14" y="74" fontSize="8" fill="#F43F5E" fontFamily="monospace" fontWeight="bold">BUG!</text>
                                        </g>
                                    ) : phase === 'eureka' || phase === 'fixing' ? (
                                        <g stroke="#10B981" strokeWidth="1.5">
                                            <circle cx="24" cy="50" r="8" fill="none" />
                                            <polyline points="20,50 23,54 28,46" stroke="#10B981" />
                                            <text x="12" y="74" fontSize="8" fill="#10B981" fontFamily="monospace" fontWeight="bold">FIXED</text>
                                        </g>
                                    ) : (
                                        <text x="12" y="74" fontSize="7" fill="#64748B" fontFamily="monospace">v2.4.1</text>
                                    )}
                                </g>
                            </g>

                            {/* Floating Side Table with Steaming Coffee Mug & Rubber Duck */}
                            <g id="side-table" transform="translate(315, 230)">
                                <ellipse cx="20" cy="52" rx="22" ry="7" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                                <line x1="20" y1="20" x2="20" y2="52" stroke="#334155" strokeWidth="3" />
                                <ellipse cx="20" cy="20" rx="24" ry="9" fill="url(#deskTop)" stroke="#475569" strokeWidth="1" />
                                <ellipse cx="20" cy="20" rx="18" ry="6" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />

                                {phase !== 'coffee_break' && (
                                    <g id="mug-on-table" transform="translate(14, 2)">
                                        <rect x="0" y="4" width="12" height="13" rx="2.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                                        <ellipse cx="6" cy="4" rx="6" ry="2.5" fill="#78350F" />
                                        <path d="M 12 6 C 16 6, 16 13, 12 13" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                                        <path d="M 4 1 Q 6 -4 4 -8" stroke="#E2E8F0" strokeWidth="1" fill="none" className="steam-1" />
                                        <path d="M 8 0 Q 10 -5 8 -9" stroke="#E2E8F0" strokeWidth="1" fill="none" className="steam-2" />
                                    </g>
                                )}
                                <g id="rubber-duck" className={phase === 'rubber_duck' ? 'anim-duck' : undefined} transform="translate(4, -8)">
                                    <ellipse cx="14" cy="18" rx="8" ry="5.5" fill="#FACC15" />
                                    <circle cx="10" cy="12" r="5" fill="#FACC15" />
                                    <polygon points="5,11 1,13 5,14" fill="#F97316" />
                                    <circle cx="8.5" cy="11" r="0.9" fill="#0F172A" />
                                    <path d="M 12 16 Q 16 15 18 18" stroke="#EAB308" strokeWidth="1.2" fill="none" />
                                    {phase === 'rubber_duck' && (
                                        <circle cx="10" cy="14" r="14" fill="#FACC15" opacity="0.25" filter="url(#softBlur)" />
                                    )}
                                </g>
                            </g>

                            {/* Chair: Base & Backrest */}
                            <g id="chair-base">
                                <rect x="255" y="262" width="6" height="38" rx="2" fill="#1E293B" />
                                <ellipse cx="258" cy="302" rx="30" ry="8" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                                <circle cx="230" cy="305" r="3.5" fill="#334155" />
                                <circle cx="286" cy="305" r="3.5" fill="#334155" />
                                <circle cx="258" cy="311" r="3.5" fill="#334155" />
                            </g>

                            <path
                                d="M 252 150 C 252 143, 258 141, 264 144 L 292 160 C 297 163, 299 168, 299 174 L 298 241 C 298 247, 293 249, 289 246 L 256 226 C 253 224, 252 220, 252 216 Z"
                                fill="#1E293B"
                                stroke="#334155"
                                strokeWidth="1.2"
                            />
                            <polygon points="221.8,249 259.6,271 259.6,278 221.8,256" fill="#0F172A" />
                            <polygon points="259.6,271 294.4,251 294.4,258 259.6,278" fill="#1E293B" />
                            <polygon points="221.8,249 256.6,229 294.4,251 259.6,271" fill="#334155" stroke="#475569" strokeWidth="1" />

                            {/* Seated Legs & Modern Sneakers */}
                            <g id="leg-far">
                                <path d="M 248 236 L 210 258 C 205 261, 204 268, 208 271 L 220 274 C 224 274, 228 271, 230 268 L 260 248 Z" fill="url(#denimJeans)" />
                                <path d="M 207 263 L 219 266 L 217 302 L 206 300 Z" fill="#0F172A" />
                                <g id="sneaker-far">
                                    <path d="M 194 316 L 220 310 L 221 315 L 194 319 Z" fill="url(#sneakerSoleGrad)" />
                                    <path d="M 206 300 L 217 302 L 220 310 L 194 316 C 190 316, 190 311, 193 308 L 204 300 Z" fill="#1E293B" />
                                    <path d="M 200 307 L 210 305 M 202 310 L 212 308" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" />
                                </g>
                            </g>

                            <g id="leg-near">
                                <path d="M 268 247 C 265 240, 244 254, 226 268 C 222 271, 223 277, 227 280 L 238 283 C 243 283, 248 279, 251 276 L 278 256 C 282 253, 276 248, 268 247 Z" fill="url(#denimJeans)" />
                                <path d="M 226 274 L 238 277 L 237 312 L 224 310 Z" fill="url(#denimJeans)" />
                                <line x1="224" y1="310" x2="237" y2="312" stroke="#475569" strokeWidth="2" />
                                <g id="sneaker-near">
                                    <path d="M 213 325 L 243 318 L 244 324 L 214 329 Z" fill="url(#sneakerSoleGrad)" />
                                    <path d="M 224 310 L 237 312 L 243 318 L 213 325 C 209 325, 209 320, 212 316 L 222 310 Z" fill="#0F172A" />
                                    <path d="M 216 321 Q 224 318 236 315" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
                                    <path d="M 218 316 L 226 313 M 220 318 L 228 315" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
                                </g>
                            </g>

                            {/* UPPER BODY: FAR ARM + TORSO + CLEAN 3D HEAD */}
                            <motion.g
                                id="upper-body"
                                animate={{ x: torsoX, y: torsoY, rotate: torsoRotate }}
                                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                                style={{ transformOrigin: '255px 240px' }}
                            >
                                {/* Clean Capsule Far Arm (Attached to Torso so it never detaches!) */}
                                <g id="far-arm">
                                    {phase === 'crash' ? (
                                        <g>
                                            <path d="M 238 164 Q 216 146 226 120" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" fill="none" />
                                            <circle cx="226" cy="118" r="6" fill="url(#skin3D)" />
                                        </g>
                                    ) : phase === 'whiteboard' ? (
                                        <g>
                                            <path d="M 238 164 Q 190 156 142 148" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" fill="none" />
                                            <circle cx="139" cy="148" r="6" fill="url(#skin3D)" />
                                            <rect x="127" y="145" width="12" height="4" rx="2" fill="#F43F5E" />
                                        </g>
                                    ) : (
                                        <g className={phase === 'fixing' ? 'anim-type-fast-far' : phase === 'typing' ? 'anim-type-far' : undefined}>
                                            <path d="M 238 164 Q 218 184 202 200" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" fill="none" />
                                            <circle cx="200" cy="201" r="5.5" fill="url(#skin3D)" />
                                        </g>
                                    )}
                                </g>

                                {/* Developer Hoodie Torso */}
                                <g id="torso">
                                    <path d="M 240 148 C 246 138, 274 138, 282 148 C 288 156, 282 168, 268 167 C 252 166, 240 158, 240 148 Z" fill="#1D4ED8" />
                                    <path d="M 230 158 C 236 146, 256 148, 268 156 L 284 165 C 292 171, 294 180, 292 192 L 290 248 C 278 256, 256 250, 242 238 L 234 196 C 228 182, 228 168, 230 158 Z" fill="url(#hoodie3D)" />
                                    <path d="M 242 238 L 290 248 L 289 254 L 242 244 Z" fill="#1E3A8A" />
                                    <path d="M 240 208 C 246 200, 266 202, 276 208 L 278 238 C 266 244, 248 240, 240 234 Z" fill="#1D4ED8" opacity="0.7" />
                                    <path d="M 246 162 Q 245 174 244 184" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                    <path d="M 256 164 Q 255 176 254 186" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                </g>

                                {/* CLEAN, APPEALING 3D MASCOT HEAD (Apple Memoji / Figma Style) */}
                                <motion.g id="head" animate={{
                                        rotate:
                                            phase === 'wave'
                                                ? 0
                                                : phase === 'typing'
                                                ? -8
                                                : phase === 'crash'
                                                ? 10
                                                : phase === 'coffee_break'
                                                ? 4
                                                : phase === 'whiteboard'
                                                ? -12
                                                : phase === 'rubber_duck'
                                                ? 10
                                                : phase === 'eureka'
                                                ? 5
                                                : -10,
                                    }} transition={{ type: 'spring', stiffness: 140, damping: 14 }} style={{ transformOrigin: '254px 148px' }}>
                                    {/* Smooth Neck */}
                                    <rect x="247" y="138" width="16" height="16" rx="6" fill="url(#skin3D)" />
                                    <path d="M 247 142 Q 255 147 263 142" stroke="#E09F7D" strokeWidth="2" fill="none" opacity="0.5" />

                                    {/* Clean, Smooth Rounded-Squircle Head Base (NO lumpy jaw or dirty beard!) */}
                                    <rect x="225" y="94" width="46" height="50" rx="21" fill="url(#skin3D)" />

                                    {/* Subtle Warm Cheek Blush */}
                                    <ellipse cx="231" cy="129" rx="4" ry="2.5" fill="#F43F5E" opacity="0.22" />
                                    <ellipse cx="255" cy="129" rx="4" ry="2.5" fill="#F43F5E" opacity="0.22" />

                                    {/* Cute Minimalist 3D Nose Button */}
                                    <path d="M 239 124 Q 236 127 239 129" stroke="#D98A6C" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                                    {/* Clean Ear */}
                                    <circle cx="270" cy="123" r="6" fill="url(#skin3D)" />
                                    <circle cx="270" cy="123" r="2.5" fill="#E09F7D" opacity="0.4" />

                                    {/* Modern Stylized Swept Hair */}
                                    <path d="M 223 113 C 221 95, 238 85, 258 87 C 272 89, 278 101, 275 117 C 273 108, 267 102, 258 100 C 245 98, 234 102, 227 110 Z" fill="#0F172A" />
                                    {/* Front Hair Tuft / Swoop */}
                                    <path d="M 226 104 C 232 94, 248 92, 258 98 C 246 99, 235 103, 226 104 Z" fill="#1E293B" />
                                    <path d="M 235 94 Q 247 90 258 94" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" fill="none" />

                                    {/* Sleek Over-Ear Wireless Headphones */}
                                    <g id="wireless-headphones">
                                        <path d="M 240 90 C 253 83, 269 87, 273 102" stroke="url(#headphoneGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                                        <line x1="272" y1="101" x2="271" y2="115" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
                                        <rect x="264" y="112" width="13" height="21" rx="6.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(6 270 122)" />
                                        <rect x="267" y="116" width="7" height="13" rx="3.5" fill={glow} opacity="0.4" transform="rotate(6 270 122)" style={{ transition: 'fill 0.6s ease' }}/>
                                    </g>

                                    {/* Clean, Expressive Mascot Eyes & Mouth per Phase */}
                                    {phase === 'wave' && (
                                        <g id="face-wave">
                                            <path d="M 229 112 Q 234 109 238 112" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <path d="M 245 112 Q 250 109 254 112" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <circle cx="234" cy="120" r="2.4" fill="#0F172A" />
                                            <circle cx="249" cy="120" r="2.4" fill="#0F172A" />
                                            <circle cx="235" cy="119" r="0.9" fill="#FFF" />
                                            <circle cx="250" cy="119" r="0.9" fill="#FFF" />
                                            <path d="M 235 133 Q 241 138 247 133" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                        </g>
                                    )}

                                    {phase === 'typing' && (
                                        <g id="face-typing">
                                            <line x1="229" y1="113" x2="238" y2="113" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="245" y1="113" x2="254" y2="113" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="233" cy="120" r="2.3" fill="#0F172A" />
                                            <circle cx="248" cy="120" r="2.3" fill="#0F172A" />
                                            <circle cx="234" cy="119" r="0.8" fill="#FFF" />
                                            <circle cx="249" cy="119" r="0.8" fill="#FFF" />
                                            <path d="M 237 134 Q 241 136 245 134" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                        </g>
                                    )}

                                    {phase === 'crash' && (
                                        <g id="face-crash">
                                            <line x1="228" y1="110" x2="237" y2="113" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
                                            <line x1="245" y1="113" x2="254" y2="110" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
                                            <circle cx="234" cy="120" r="3.6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
                                            <circle cx="249" cy="120" r="3.6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
                                            <circle cx="234" cy="120" r="1.5" fill="#0F172A" />
                                            <circle cx="249" cy="120" r="1.5" fill="#0F172A" />
                                            <ellipse cx="241" cy="135" rx="3.5" ry="4.5" fill="#0F172A" />
                                            <path d="M 221 114 C 219 119, 219 122, 221 123 C 223 124, 225 120, 222 114 Z" fill="#38BDF8" />
                                        </g>
                                    )}

                                    {phase === 'coffee_break' && (
                                        <g id="face-coffee">
                                            <path d="M 230 119 Q 234 122 238 119" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <path d="M 245 119 Q 249 122 253 119" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <circle cx="241" cy="134" r="2" fill="#0F172A" />
                                        </g>
                                    )}

                                    {phase === 'whiteboard' && (
                                        <g id="face-whiteboard">
                                            <line x1="229" y1="111" x2="238" y2="114" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M 245 113 Q 250 109 254 112" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <circle cx="232" cy="120" r="2.3" fill="#0F172A" />
                                            <circle cx="247" cy="120" r="2.3" fill="#0F172A" />
                                            <line x1="237" y1="134" x2="245" y2="134" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                                        </g>
                                    )}

                                    {phase === 'rubber_duck' && (
                                        <g id="face-duck">
                                            <path d="M 229 111 Q 234 108 238 111" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <path d="M 245 111 Q 250 108 254 111" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <circle cx="235" cy="120" r="2.4" fill="#0F172A" />
                                            <circle cx="250" cy="120" r="2.4" fill="#0F172A" />
                                            <ellipse cx="241" cy="134" rx="2.5" ry="3" fill="#0F172A" />
                                        </g>
                                    )}

                                    {phase === 'eureka' && (
                                        <g id="face-eureka">
                                            <path d="M 228 109 Q 234 105 239 109" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <path d="M 245 109 Q 250 105 255 109" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <circle cx="234" cy="119" r="2.8" fill="#0F172A" />
                                            <circle cx="249" cy="119" r="2.8" fill="#0F172A" />
                                            <circle cx="235" cy="118" r="1.1" fill="#FFF" />
                                            <circle cx="250" cy="118" r="1.1" fill="#FFF" />
                                            <path d="M 234 132 Q 241 141 248 132 Z" fill="#0F172A" />
                                        </g>
                                    )}

                                    {phase === 'fixing' && (
                                        <g id="face-fixing">
                                            <line x1="229" y1="114" x2="238" y2="116" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
                                            <line x1="245" y1="116" x2="254" y2="114" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
                                            <circle cx="233" cy="120" r="2.3" fill="#0F172A" />
                                            <circle cx="248" cy="120" r="2.3" fill="#0F172A" />
                                            <path d="M 235 133 Q 241 138 247 133" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                        </g>
                                    )}

                                    {/* Sleek Rectangular Glasses with Cyan/Screen Glare */}
                                    <g id="modern-glasses">
                                        <rect x="226" y="114" width="15" height="11" rx="3" stroke="#0F172A" strokeWidth="2" fill={glow} fillOpacity={phase === 'wave' ? 0.1 : 0.28} style={{ transition: 'fill 0.6s ease' }}/>
                                        <rect x="243" y="114" width="15" height="11" rx="3" stroke="#0F172A" strokeWidth="2" fill={glow} fillOpacity={phase === 'wave' ? 0.1 : 0.28} style={{ transition: 'fill 0.6s ease' }}/>
                                        <line x1="241" y1="119" x2="243" y2="119" stroke="#0F172A" strokeWidth="2" />
                                        <line x1="258" y1="118" x2="266" y2="120" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="228" y1="116" x2="232" y2="122" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
                                        <line x1="245" y1="116" x2="249" y2="122" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
                                    </g>
                                </motion.g>

                                {/* Screen Light Aura onto Chest/Face */}
                                <ellipse cx="242" cy="150" rx="34" ry="44" fill="url(#faceLight)" style={{ mixBlendMode: 'screen' }}/>
                            </motion.g>

                            {/* Floating Desk */}
                            <g id="desk">
                                <polygon points="121,197.5 225,257.5 225,265.5 121,205.5" fill="#0F172A" />
                                <polygon points="225,257.5 269,232.5 269,240.5 225,265.5" fill="#1E293B" />
                                <polygon points="121,197.5 165,172.5 269,232.5 225,257.5" fill="url(#deskTop)" stroke="#475569" strokeWidth="1" />
                                <polyline points="121,205.5 225,265.5 269,240.5" stroke={glow} strokeWidth="1.5" opacity="0.8" filter="url(#neonBlur)" style={{ transition: 'stroke 0.8s ease' }}/>
                            </g>

                            {/* Laptop Base */}
                            <g id="laptop-base">
                                <polygon points="165.5,206 210.7,232 210.7,235 165.5,209" fill="#334155" />
                                <polygon points="210.7,232 238.5,216 238.5,219 210.7,235" fill="#475569" />
                                <polygon points="165.5,206 193.3,190 238.5,216 210.7,232" fill="#94A3B8" />
                                <polygon points="200,200 228,216 222,219.5 194,203.5" fill="#1E293B" opacity="0.8" />
                            </g>

                            {/* Light rays from laptop screen towards programmer */}
                            <polygon points="160.5,167 205.7,193 262,175 236,108" fill={glow} opacity={phase === 'crash' ? 0.45 : 0.25} style={{ mixBlendMode: 'screen', transition: 'fill 0.8s ease, opacity 0.5s ease' }}/>

                            {/* Laptop Lid (Back Cover faces viewer, screen faces programmer) */}
                            <g id="laptop-lid">
                                <polygon points="160.5,167 205.7,193 210.7,232 165.5,206" fill="url(#lidBack)" stroke="#CBD5E1" strokeWidth="1" strokeLinejoin="round" />
                                <line x1="161" y1="166" x2="206" y2="192" stroke={glow} strokeWidth={phase === 'crash' ? 3.5 : 2} strokeLinecap="round" filter="url(#neonBlur)" style={{ transition: 'stroke 0.8s ease' }}/>
                                <ellipse cx="185.6" cy="199.5" rx="7" ry="5.5" transform="rotate(30 185.6 199.5)" fill={glow} opacity="0.85" filter="url(#neonBlur)" style={{ transition: 'fill 0.8s ease' }}/>
                                <ellipse cx="185.6" cy="199.5" rx="3" ry="2.4" transform="rotate(30 185.6 199.5)" fill="#F8FAFC" />

                                {phase === 'crash' && (
                                    <g id="crash-smoke" fill="#EF4444">
                                        <circle cx="185" cy="180" r="6" className="smoke-1" opacity="0.6" />
                                        <circle cx="198" cy="170" r="8" className="smoke-2" opacity="0.5" />
                                        <circle cx="175" cy="175" r="4" className="smoke-1" opacity="0.7" />
                                    </g>
                                )}
                            </g>

                            {/* CLEAN CAPSULE NEAR ARM (Synced with torso movement, over desk) */}
                            <motion.g id="near-arm" animate={{ x: torsoX, y: torsoY, rotate: torsoRotate }} transition={{ type: 'spring', stiffness: 120, damping: 15 }} style={{ transformOrigin: '255px 240px' }}>
                                {phase === 'wave' && (
                                    <g>
                                        <line x1="274" y1="175" x2="296" y2="168" stroke="url(#hoodieArm)" strokeWidth="13" strokeLinecap="round" />
                                        <g style={{ animation: 'waveArm 0.55s ease-in-out infinite', transformOrigin: '296px 168px' }}>
                                            <line x1="296" y1="168" x2="306" y2="132" stroke="url(#hoodieArm)" strokeWidth="12" strokeLinecap="round" />
                                            {/* Cute Rounded Waving Hand + Thumb */}
                                            <circle cx="307" cy="124" r="6.5" fill="url(#skin3D)" />
                                            <circle cx="301" cy="126" r="3" fill="url(#skin3D)" />
                                        </g>
                                    </g>
                                )}

                                {(phase === 'typing' || phase === 'fixing') && (
                                    <g className={phase === 'fixing' ? 'anim-type-fast-near' : 'anim-type-near'}>
                                        <path d="M 274 175 Q 272 204 232 214" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        <circle cx="229" cy="215" r="5.5" fill="url(#skin3D)" />
                                    </g>
                                )}

                                {phase === 'crash' && (
                                    <g>
                                        <path d="M 274 175 Q 294 148 268 122" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        <circle cx="266" cy="120" r="6" fill="url(#skin3D)" />
                                    </g>
                                )}

                                {phase === 'coffee_break' && (
                                    <g>
                                        <path d="M 274 175 Q 290 190 264 144" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        {/* Steaming Mug in Hand */}
                                        <rect x="248" y="133" width="12" height="13" rx="2.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                                        <ellipse cx="254" cy="133" rx="6" ry="2" fill="#78350F" />
                                        <circle cx="262" cy="141" r="5.5" fill="url(#skin3D)" />
                                    </g>
                                )}

                                {phase === 'whiteboard' && (
                                    <g>
                                        {/* Classic Thinking Pose: Hand on Chin */}
                                        <path d="M 274 175 Q 282 195 246 144" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        <circle cx="244" cy="142" r="5.5" fill="url(#skin3D)" />
                                    </g>
                                )}

                                {phase === 'rubber_duck' && (
                                    <g>
                                        <path d="M 274 175 Q 298 192 316 202" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        <circle cx="318" cy="203" r="5.5" fill="url(#skin3D)" />
                                    </g>
                                )}

                                {phase === 'eureka' && (
                                    <motion.g initial={{ scale: 0.85, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                                        <path d="M 274 175 Q 296 166 298 130" stroke="url(#hoodieArm)" strokeWidth="12.5" strokeLinecap="round" fill="none"/>
                                        <circle cx="298" cy="126" r="5.5" fill="url(#skin3D)" />
                                        <line x1="298" y1="126" x2="298" y2="114" stroke="url(#skin3D)" strokeWidth="4" strokeLinecap="round" />
                                    </motion.g>
                                )}
                            </motion.g>

                            {/* Eureka 3D Lightbulb pop above head */}
                            <AnimatePresence>
                                {phase === 'eureka' && (
                                    <motion.g id="eureka-bulb" initial={{ scale: 0, y: 15, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0, y: -10, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
                                        <g stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round">
                                            <line x1="252" y1="42" x2="252" y2="34" />
                                            <line x1="268" y1="48" x2="274" y2="42" />
                                            <line x1="274" y1="62" x2="282" y2="62" />
                                            <line x1="236" y1="48" x2="230" y2="42" />
                                            <line x1="230" y1="62" x2="222" y2="62" />
                                        </g>
                                        <circle cx="252" cy="62" r="22" fill="#FDE047" opacity="0.4" filter="url(#softBlur)" />
                                        <path
                                            d="M 252 50 C 259 50, 264 55, 264 61 C 264 66, 260 69, 258 72 L 246 72 C 244 69, 240 66, 240 61 C 240 55, 245 50, 252 50 Z"
                                            fill="url(#bulbGlass)"
                                            stroke="#F59E0B"
                                            strokeWidth="1.2"
                                        />
                                        <rect x="246.5" y="72" width="11" height="6" rx="2" fill="#94A3B8" />
                                        <circle cx="248" cy="56" r="2" fill="#FFFFFF" opacity="0.9" />
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </g>
                    </svg>
                </motion.div>

                {/* Status indicator pill synced with storytelling phase */}
                <div className={`mb-2.5 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-medium backdrop-blur-md transition-colors duration-700 ${status.pill}`}>
                    <span className="relative flex size-2">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status.dot}`} />
                        <span className={`relative inline-flex size-2 rounded-full ${status.dot}`} />
                    </span>
                    <AnimatePresence mode="wait">
                        <motion.span key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                            {status.text}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Heading */}
                <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                    Oops! Something went wrong
                </h1>

                {/* Subtitle */}
                <p className="mb-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                    Don't worry, our developer has already spotted the issue and is writing a hotfix right now.
                </p>

                {/* Optional Developer error message */}
                {error?.message && (
                    <div className="mb-4 w-full max-w-md overflow-hidden rounded-xl border border-red-500/20 bg-red-950/20 p-2.5 text-left font-mono text-xs text-red-300 backdrop-blur-md">
                        <div className="flex items-center gap-2 font-semibold text-red-400">
                            <Bug className="size-3.5" />
                            <span>Error:</span>
                        </div>
                        <p className="mt-1 truncate opacity-85">{error.message}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <button type="button" onClick={handleRetry} className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4),0_4px_0_0_#1d4ed8] transition-all duration-150 hover:-translate-y-0.5 hover:from-blue-400 hover:to-blue-500 active:translate-y-1">
                        <RotateCcw className="size-4 transition-transform duration-300 group-hover:-rotate-180" />
                        <span>{t('tryAgain')}</span>
                    </button>

                    <button type="button" onClick={handleGoHome} className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-2.5 text-sm font-semibold text-slate-200 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.5),0_4px_0_0_#0f172a] backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:translate-y-1">
                        <Home className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                        <span>{t('backToHome')}</span>
                    </button>
                </div>

                {/* Interactive Phase Switcher Bar (For testing any animation phase on click) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-1.5 backdrop-blur-md">
                    {ALL_PHASES.map((p) => (
                        <button key={p} type="button" onClick={() => setPhase(p)} className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${phase === p ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
                            {STATUS_INFO[p].label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Error;