import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun,
    Moon,
    LogIn,
    ArrowRight,
    Languages,
    BookOpen,
    Users,
    WifiOff,
    BarChart3,
    ShieldCheck,
    Globe2,
    UserPlus,
    FileSpreadsheet,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react';

type LangCode = 'EN' | 'RU' | 'TJ';

interface LanguageOption {
    code: LangCode;
    targetLang: string;
    label: string;
    flag: React.ReactNode;
}

const LANGUAGES: LanguageOption[] = [
    {
        code: 'EN',
        targetLang: 'en',
        label: 'English',
        flag: (
            <svg viewBox="0 0 28 20" className="h-4 w-6 shrink-0 rounded-[4px] shadow-2xs">
                <rect width="28" height="20" fill="#012169" />
                <path d="M0 0L28 20M28 0L0 20" stroke="#FFF" strokeWidth="3.5" />
                <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="2" />
                <path d="M14 0V20M0 10H28" stroke="#FFF" strokeWidth="6" />
                <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="3.5" />
            </svg>
        ),
    },
    {
        code: 'RU',
        targetLang: 'ru',
        label: 'Русский',
        flag: (
            <svg viewBox="0 0 28 20" className="h-4 w-6 shrink-0 rounded-[4px] border border-slate-200/60 shadow-2xs dark:border-slate-700/60">
                <rect width="28" height="6.67" fill="#FFFFFF" />
                <rect y="6.67" width="28" height="6.67" fill="#0039A6" />
                <rect y="13.33" width="28" height="6.67" fill="#D52B1E" />
            </svg>
        ),
    },
    {
        code: 'TJ',
        targetLang: 'tg',
        label: 'Тоҷикӣ',
        flag: (
            <svg viewBox="0 0 28 20" className="h-4 w-6 shrink-0 rounded-[4px] shadow-2xs">
                <rect width="28" height="5.7" fill="#CC0000" />
                <rect y="5.7" width="28" height="8.6" fill="#FFFFFF" />
                <rect y="14.3" width="28" height="5.7" fill="#006600" />
                <circle cx="14" cy="10.3" r="1.8" fill="#F8C300" />
                <path d="M11.5 9.2C12.5 8 15.5 8 16.5 9.2" stroke="#F8C300" strokeWidth="0.9" fill="none" strokeLinecap="round" />
            </svg>
        ),
    },
];

const FEATURE_PILLS = [
    'Offline-First',
    'Multi-Language',
    'Real-Time Sync',
    'Secure',
];

const FEATURES_LIST = [
    {
        icon: <BookOpen className="size-5 text-blue-500" />,
        bgIcon: 'bg-blue-500/10',
        title: 'Debt Ledger',
        description: 'Record every transaction with precision. Track who owes you and whom you owe — all in one clean interface.',
    },
    {
        icon: <Users className="size-5 text-emerald-500" />,
        bgIcon: 'bg-emerald-500/10',
        title: 'Contact Manager',
        description: 'Organize your contacts with detailed profiles. Link debts directly to people for instant clarity.',
    },
    {
        icon: <WifiOff className="size-5 text-amber-500" />,
        bgIcon: 'bg-amber-500/10',
        title: 'Offline-First',
        description: 'Works without internet. Your data is stored locally and syncs automatically when you reconnect.',
    },
    {
        icon: <BarChart3 className="size-5 text-rose-500" />,
        bgIcon: 'bg-rose-500/10',
        title: 'Analytics',
        description: 'Visual dashboards showing your debt trends, payment history, and outstanding balances at a glance.',
    },
    {
        icon: <ShieldCheck className="size-5 text-purple-500" />,
        bgIcon: 'bg-purple-500/10',
        title: 'Secure & Private',
        description: 'JWT authentication, encrypted storage, and role-based access keep your financial data protected.',
    },
    {
        icon: <Globe2 className="size-5 text-cyan-500" />,
        bgIcon: 'bg-cyan-500/10',
        title: 'Multi-Language',
        description: 'Use DebtBook in English, Russian, or Tajik. Seamlessly switch languages without losing context.',
    },
];

const STATS_LIST = [
    { value: '10K+', label: 'Active Users', sub: 'managing debts daily' },
    { value: '50K+', label: 'Debts Tracked', sub: 'across all accounts' },
    { value: '99.9%', label: 'Uptime', sub: 'reliable & always on' },
    { value: '3', label: 'Languages', sub: 'EN · RU · TG' },
];

const STEPS_LIST = [
    {
        number: '01',
        title: 'Create Account',
        description: 'Sign up in seconds. No credit card needed. Your data stays on your device with optional cloud sync.',
        icon: <UserPlus className="size-4 text-blue-500" />,
    },
    {
        number: '02',
        title: 'Add Your Debts',
        description: 'Record debts with contacts, amounts, dates, and notes. Organize them into folders for easy access.',
        icon: <FileSpreadsheet className="size-4 text-blue-500" />,
    },
    {
        number: '03',
        title: 'Track Progress',
        description: 'Monitor payments, view analytics, and get insights on your financial relationships over time.',
        icon: <TrendingUp className="size-4 text-blue-500" />,
    },
    {
        number: '04',
        title: 'Stay Organized',
        description: 'Mark debts as settled, export reports, and maintain a clear record of all your transactions.',
        icon: <CheckCircle2 className="size-4 text-blue-500" />,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring' as const,
            stiffness: 110,
            damping: 16,
        },
    },
};

const Home: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isDark, setIsDark] = useState(true);
    const [langOpen, setLangOpen] = useState(false);

    const getLangCode = (lng: string): LangCode => {
        if (lng.startsWith('ru')) return 'RU';
        if (lng.startsWith('tg') || lng.startsWith('tj')) return 'TJ';
        return 'EN';
    };

    const [selectedLang, setSelectedLang] = useState<LangCode>(() => getLangCode(i18n.language || 'en'));
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedLang(getLangCode(i18n.language || 'en'));
    }, [i18n.language]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectLanguage = (item: LanguageOption) => {
        setSelectedLang(item.code);
        setLangOpen(false);
        i18n.changeLanguage(item.targetLang);
        try {
            localStorage.setItem('app_language', item.targetLang);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] transition-colors duration-500 selection:bg-blue-500/20 selection:text-blue-500 dark:bg-[#050814] dark:text-white">
                
                {/* Фоновая квадратная сетка */}
                <div className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{
                        backgroundImage: isDark
                            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
                            : 'linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                    }}/>

                {/* Фоновые градиентные свечения */}
                <div className="pointer-events-none absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[140px] transition-opacity duration-500 dark:bg-blue-600/15" />
                <div className="pointer-events-none absolute top-[30%] left-10 h-[360px] w-[360px] rounded-full bg-amber-500/5 blur-[130px] transition-opacity duration-500 dark:bg-amber-500/10" />

                {/* ================= ШАПКА (NAVBAR) ================= */}
                <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-10 md:px-16">
                    <a href="#top" onClick={(e) => e.preventDefault()} className="group flex items-center gap-3 focus:outline-none">
                        <div className="flex size-10 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:bg-white">
                            <svg viewBox="0 0 36 36" className="size-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6V22M11 10H25M11 10L8 17H14L11 10ZM25 10L22 17H28L25 10Z" stroke="#0F766E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 17C8 18.5 9.3 19.5 11 19.5C12.7 19.5 14 18.5 14 17M22 17C22 18.5 23.3 19.5 25 19.5C26.7 19.5 28 18.5 28 17" stroke="#0F766E" strokeWidth="1.5"/>
                                <text x="18" y="29" textAnchor="middle" className="fill-[#0F172A] text-[6.5px] font-extrabold tracking-tighter">Adl 5:8</text>
                            </svg>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors dark:text-white">Adl 5:8
                        </span>
                    </a>

                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        {/* Селект языков */}
                        <div ref={dropdownRef} className="relative">
                            <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => setLangOpen((prev) => !prev)} className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all ${langOpen ? 'bg-slate-200/80 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'}`}>
                                <Languages className="size-4 stroke-[2]" />
                                <span className="hidden sm:inline">{selectedLang}</span>
                            </motion.button>

                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }} transition={{ duration: 0.18, ease: 'easeOut' }} className="absolute right-0 mt-2.5 w-48 origin-top-right rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)]">
                                        <div className="flex flex-col gap-0.5">
                                            {LANGUAGES.map((item) => {
                                                const isSelected = selectedLang === item.code;
                                                return (
                                                    <button
                                                        key={item.code}
                                                        type="button"
                                                        onClick={() => handleSelectLanguage(item)}
                                                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${isSelected ? 'bg-slate-100/90 font-semibold text-slate-900 dark:bg-slate-800/80 dark:text-white' : 'font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40'}`}
                                                    >
                                                        {item.flag}
                                                        <span className="tracking-tight">{item.label}</span>
                                                        <span className="ml-auto text-xs font-normal text-slate-400 dark:text-slate-500">({item.code})</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Переключатель темы */}
                        <motion.button type="button" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }} onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-xs backdrop-blur-md transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
                            <AnimatePresence mode="wait" initial={false}>
                                {isDark ? (
                                    <motion.span key="moon" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                                        <Moon className="size-4 fill-sky-400 text-sky-400" />
                                    </motion.span>
                                ) : (
                                    <motion.span key="sun" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                                        <Sun className="size-4 fill-amber-500 text-amber-500" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <NavLink to="/login_and_register">
                            <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/90">
                                <LogIn className="size-3.5 text-slate-600 dark:text-slate-300" />
                                <span>Login</span>
                            </motion.button>
                        </NavLink>
                    </div>
                </motion.header>

                {/* ================= ГЛАВНЫЙ КОНТЕНТ (HERO) ================= */}
                <motion.main variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-6 text-center sm:px-8 w-full max-w-7xl">
                    {/* Бейдж */}
                    <motion.div variants={itemVariants} className="mb-7">
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-slate-600 uppercase shadow-2xs backdrop-blur-md transition-colors dark:border-blue-500/20 dark:bg-slate-900/90 dark:text-slate-300">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
                            </span>
                            <span>{t('smartDebtManagement')}</span>
                        </div>
                    </motion.div>

                    {/* Заголовок */}
                    <motion.h1 variants={itemVariants} className="max-w-4xl text-4xl leading-[1.12] font-extrabold tracking-tight sm:text-6xl md:text-[68px]">
                        <span className="block text-[#0F172A] transition-colors dark:text-white">{t('heroTitle1')}</span>
                        <span className="mt-1 block bg-linear-to-r from-[#2563EB] via-[#4F86F7] to-[#D97706] bg-clip-text text-transparent dark:from-[#3B82F6] dark:via-[#60A5FA] dark:to-[#F59E0B]">{t('heroTitle2')}</span>
                    </motion.h1>

                    {/* Подзаголовок */}
                    <motion.p variants={itemVariants} className="mt-6 max-w-xl text-sm leading-relaxed font-normal text-slate-500 sm:text-base md:text-[17px] md:leading-7 dark:text-slate-400">
                        {t('heroSubtitle')}
                    </motion.p>

                    {/* Кнопки */}
                    <motion.div variants={itemVariants} className="mt-9 flex w-full max-w-xs flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row sm:gap-7">
                        <NavLink to="/login_and_register" className="w-full sm:w-auto">
                            <motion.button type="button" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="group relative flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-4px_rgba(37,99,235,0.45)] transition-all hover:bg-[#1D4ED8] hover:shadow-[0_16px_36px_-4px_rgba(37,99,235,0.65)] sm:w-auto dark:bg-[#3B82F6] dark:shadow-[0_12px_34px_-4px_rgba(59,130,246,0.5)] dark:hover:bg-[#2563EB]">
                                <span>{t('getStartedFree')}</span>
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </motion.button>
                        </NavLink>

                        <NavLink to="/login_and_register">
                            <motion.button type="button" whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} className="cursor-pointer py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                {t('createAccount')}
                            </motion.button>
                        </NavLink>
                    </motion.div>

                    {/* Плашки преимуществ */}
                    <motion.div variants={itemVariants} className="mt-12 flex max-w-md flex-wrap items-center justify-center gap-2.5 sm:max-w-none">
                        {FEATURE_PILLS.map((pill) => (
                            <motion.span key={pill} whileHover={{ y: -2, scale: 1.04 }} transition={{ type: 'spring' as const, stiffness: 300, damping: 15 }} className="cursor-default rounded-lg border border-slate-200/90 bg-white/70 px-3.5 py-1.5 text-[11px] font-medium text-slate-500 shadow-2xs backdrop-blur-xs transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-slate-800/90 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200">
                                {pill}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* ================= СЕКЦИЯ FEATURES (Карточки) ================= */}
                    <section className="relative z-10 mx-auto mt-28 w-full max-w-6xl px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase dark:text-blue-400">
                                {t('featuresBadge')}
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                                <span className="text-slate-900 dark:text-white">{t('featuresTitle')}{' '}</span>
                                <span className="text-slate-400 dark:text-slate-500">{t('featuresSubtitle')}</span>
                            </h2>
                        </div>

                        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES_LIST.map((feat, index) => (
                                <motion.div key={feat.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-7 text-left shadow-xs backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/80">
                                    <div className={`flex size-11 items-center justify-center rounded-xl ${feat.bgIcon}`}>
                                        {feat.icon}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                                        {feat.title}
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        {feat.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ================= СЕКЦИЯ СТАТИСТИКИ (С разделителями) ================= */}
                    <section className="relative z-10 mx-auto mt-28 w-full max-w-5xl px-4 sm:px-6">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-0">
                            {STATS_LIST.map((stat, idx) => (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }} className={`flex flex-col items-center text-center px-4 ${idx !== 0 ? 'sm:border-l sm:border-slate-200/80 dark:sm:border-slate-800/80' : ''}`}>
                                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                        {stat.value}
                                    </span>
                                    <span className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {stat.label}
                                    </span>
                                    <span className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                        {stat.sub}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ================= СЕКЦИЯ HOW IT WORKS (4 шага) ================= */}
                    <section className="relative z-10 mx-auto mt-28 w-full max-w-6xl px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-xs font-bold tracking-widest text-[#D97706] uppercase dark:text-amber-400">
                                {t('howItWorksBadge')}
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                                <span className="text-slate-900 dark:text-white">{t('howItWorksTitle')}{' '}</span>
                                <span className="text-slate-400 dark:text-slate-500">{t('howItWorksSubtitle')}</span>
                            </h2>
                        </div>

                        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS_LIST.map((step, index) => (
                                <motion.div key={step.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-6 text-left shadow-xs backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/80">
                                    <div className="flex items-center justify-between">
                                        <span className="text-4xl font-extrabold tracking-tighter text-slate-200 transition-colors group-hover:text-blue-500/30 dark:text-slate-800 dark:group-hover:text-blue-400/30">
                                            {step.number}
                                        </span>
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/15">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ================= ФИНАЛЬНАЯ СЕКЦИЯ: READY TO TAKE CONTROL ================= */}
                    <section className="relative z-10 mx-auto mt-28 w-full max-w-5xl px-4 sm:px-6">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/60 px-6 py-16 text-center shadow-xl backdrop-blur-xl sm:px-12 sm:py-20 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent dark:from-blue-500/10" />

                            <h2 className="relative z-10 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[42px] dark:text-white">
                                {t('readyToTakeControl')}{' '}
                                <span className="block mt-1 text-slate-400 dark:text-slate-500">{t('ofYourFinances')}</span>
                            </h2>

                            <p className="relative z-10 mx-auto mt-4 max-w-md text-sm text-slate-500 sm:text-base dark:text-slate-400">
                                {t('readySubtitle')}
                            </p>

                            <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
                                <NavLink to="/login_and_register" className="w-full sm:w-auto">
                                    <motion.button type="button" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-4px_rgba(37,99,235,0.4)] transition-all hover:bg-[#1D4ED8] sm:w-auto dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]">
                                        <span>{t('startForFree')}</span>
                                        <ArrowRight className="size-4" />
                                    </motion.button>
                                </NavLink>

                                <NavLink to="/login_and_register" className="w-full sm:w-auto">
                                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 sm:w-auto dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                                        {t('signIn')}
                                    </motion.button>
                                </NavLink>
                            </div>
                        </motion.div>
                    </section>
                </motion.main>

                {/* ================= ФУТЕР (FOOTER) ================= */}
                <footer className="relative z-10 border-t border-slate-200/80 bg-white/40 pt-16 pb-12 transition-colors duration-500 dark:border-slate-800/80 dark:bg-slate-900/20">
                    <div className="mx-auto max-w-7xl px-5 sm:px-10 md:px-16">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 lg:gap-16">
                            
                            {/* Колонка бренда (Лого + Описание) */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-white">
                                        <svg viewBox="0 0 36 36" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6V22M11 10H25M11 10L8 17H14L11 10ZM25 10L22 17H28L25 10Z" stroke="#0F766E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            <text x="18" y="29" textAnchor="middle" className="fill-[#0F172A] text-[6.5px] font-extrabold tracking-tighter">
                                                Adl 5:8
                                            </text>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        Adl 5:8
                                    </span>
                                </div>
                                <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    A modern, offline-first debt management platform. Track, organize, and settle your financial records with confidence.
                                </p>
                            </div>

                            {/* Колонка Product */}
                            <div>
                                <h4 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    PRODUCT
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    <li><a href="#features" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Features</a></li>
                                    <li><a href="#dashboard" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Dashboard</a></li>
                                    <li><a href="#analytics" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Analytics</a></li>
                                    <li><a href="#contacts" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Contacts</a></li>
                                </ul>
                            </div>

                            {/* Колонка Company */}
                            <div>
                                <h4 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    COMPANY
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    <li><a href="#about" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">About</a></li>
                                    <li><a href="#blog" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Blog</a></li>
                                    <li><a href="#careers" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Careers</a></li>
                                    <li><a href="#press" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Press</a></li>
                                </ul>
                            </div>

                            {/* Колонка Support */}
                            <div>
                                <h4 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    SUPPORT
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    <li><a href="#docs" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Documentation</a></li>
                                    <li><a href="#help" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Help Center</a></li>
                                    <li><a href="#contact" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Contact</a></li>
                                    <li><a href="#status" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-900 dark:hover:text-white">Status</a></li>
                                </ul>
                            </div>

                        </div>

                        {/* Нижняя полоса футера (Копирайт и политика) */}
                        <div className="mt-14 flex flex-col items-center justify-between border-t border-slate-200/60 pt-8 sm:flex-row dark:border-slate-800/60">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                © {new Date().getFullYear()} DebtBook. All rights reserved.
                            </p>
                            <div className="mt-4 flex items-center gap-6 text-xs font-medium text-slate-400 sm:mt-0 dark:text-slate-500">
                                <a href="#privacy" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">Privacy</a>
                                <a href="#terms" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">Terms</a>
                                <a href="#cookies" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default Home;