import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
    Bell,
    ExternalLink,
    Lock,
    LogOut,
    Menu,
    Moon,
    Pencil,
    RotateCw,
    Scale,
    Settings,
    Sun,
    User,
    Users,
    X,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { axiosRequest, removeToken, logoutUser } from '@/lib/Tokens';
import { useUser } from '@/Store/Zustand';

const languages = [
    { code: 'EN', label: 'English', flag: 'gb' },
    { code: 'RU', label: 'Русский', flag: 'ru' },
    { code: 'TJ', label: 'Тоҷикӣ', flag: 'tj' },
];

type HeaderProps = {
    onToggle: () => void;
};

const Header = ({ onToggle }: HeaderProps) => {
    const [fullScreen, setFullScreen] = useState(false)
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const user = useUser((state: any) => state.user);
    const userName = user?.name;
    const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Tolibjon'}`;


    // fullscreen
    const FullScreenEkran = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleFull = () => {
            setFullScreen(Boolean(document.fullscreenElement))
        }

        document.addEventListener('fullscreenchange', handleFull)
        return () => document.removeEventListener('fullscreenchange', handleFull)
    }, [])



    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'setting'>('profile');
    const [activeProfileItem, setActiveProfileItem] = useState<'edit' | 'view' | 'social'>('view');
    
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as 'light' | 'dark' | 'auto') || 'light';
    });
    
    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    const applyTheme = (mode: 'light' | 'dark' | 'auto') => {
        setTheme(mode);
        localStorage.setItem('theme', mode);
        const root = document.documentElement;

        if (mode === 'dark') {
            root.classList.add('dark');
        } else if (mode === 'light') {
            root.classList.remove('dark');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    useEffect(() => {
        const saved = (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'light';
        applyTheme(saved);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsProfileOpen(false);
        logoutUser();
    };

    return (
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between bg-white/70 dark:bg-[#0b131f]/90 px-4 backdrop-blur-md md:px-8 border-b border-slate-100 dark:border-[#1e293b] transition-colors duration-200">
            {/* Левая часть: кнопка меню и логотип для мобильных */}
            <div className="flex items-center gap-2">
                <button type="button" onClick={onToggle} aria-label={t('toggleSidebar')} className="flex size-9 sm:size-10 items-center justify-center rounded-xl text-slate-500 dark:text-slate-300 dark:bg-[#162232] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:translate-y-0 hidden md:flex cursor-pointer"><Menu className="size-5" /></button>

                <div className="flex items-center gap-2 md:hidden">
                    <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        <Scale className="size-5" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Adl 5:8
                    </span>
                </div>
            </div>

            {/* Правая часть: элементы управления и профиль */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* 1. Кнопка смены языка */}
                <DropdownMenu>
                    <DropdownMenuTrigger aria-label={t('language')} className="flex size-9 items-center justify-center rounded-xl bg-slate-200/80 dark:bg-[#162232] text-slate-700 dark:text-slate-300 transition hover:bg-slate-300/80 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"><span className="text-xs font-bold leading-none">文</span></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="w-44 rounded-xl border-0 bg-white dark:bg-[#162232] p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-[#1e293b] z-50">
                        {languages.map(({ code, label, flag }) => (
                            <DropdownMenuItem key={code} onClick={() => { const targetLang = code === 'TJ' ? 'tg' : code === 'RU' ? 'ru' : 'en'; i18n.changeLanguage(targetLang); localStorage.setItem('app_language', targetLang);}}className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 transition-all duration-150 focus:translate-x-0.5 focus:bg-blue-50 dark:focus:bg-slate-800 focus:text-blue-600 dark:focus:text-sky-400">
                                <img src={'https://flagcdn.com/w40/' + flag + '.png'} alt="" className="h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ring-slate-200 dark:ring-slate-700"/>
                                {label}
                                <span className="text-xs text-slate-400">({code})</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>


                {/* 2. Кнопка обновления со счетчиком 9 */}
                <button type="button" aria-label={t('sync')} className="relative flex size-9 items-center justify-center rounded-xl text-[#06b6d4] transition hover:bg-cyan-50 dark:hover:bg-cyan-950/40 cursor-pointer"><RotateCw className="size-5 stroke-[2.2]" /><span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#22d3ee] text-[10px] font-bold text-white shadow-xs">9</span></button>

                {/* 3. Кнопка колокольчика со счетчиком 2 и выпадающим окном */}
                <div className="relative" ref={notificationsRef}>
                    <button type="button" aria-label={t('notifications')} onClick={() => {setIsNotificationsOpen((prev) => !prev);setIsProfileOpen(false);}} className={cn('relative flex size-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',isNotificationsOpen && 'bg-slate-100 dark:bg-slate-800')}>
                        <Bell className="size-5 fill-slate-700 dark:fill-slate-200 stroke-slate-700 dark:stroke-slate-200" />
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
                            2
                        </span>
                    </button>

                    {/* Выпадающее окно уведомлений */}
                    {isNotificationsOpen && (
                        <div className="absolute -right-20 sm:right-0 top-[calc(100%+12px)] z-50 w-[calc(100vw-32px)] max-w-[340px] rounded-3xl border border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#16202e] p-4 sm:p-5 shadow-[0_20px_50px_rgba(15,23,42,0.14),0_4px_12px_rgba(15,23,42,0.06)] animate-in fade-in zoom-in-95 duration-150">
                            {/* Шапка уведомлений */}
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('notifications')}</h3>
                                <button type="button" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">{t('markAllRead')}</button>
                            </div>

                            {/* Список уведомлений */}
                            <div className="flex flex-col gap-3">
                                {/* 1. {t('overdueDebt')} */}
                                <div className="flex items-center gap-3.5 rounded-2xl bg-[#edf3ff] dark:bg-[#2563eb] p-4 transition hover:bg-[#e4edff] dark:hover:bg-[#1d4ed8] cursor-pointer">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-xs">
                                        <X className="size-5 stroke-[2.5]" />
                                    </div>
                                    <div className="flex flex-col text-left overflow-hidden">
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                                            {t('overdueDebt')}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-blue-100/90 font-medium mt-1">
                                            {t('overdueDebtDesc')}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. {t('actionNeeded')} */}
                                <div className="flex items-center gap-3.5 rounded-2xl bg-[#edf3ff] dark:bg-[#2563eb] p-4 transition hover:bg-[#e4edff] dark:hover:bg-[#1d4ed8] cursor-pointer">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs">
                                        <div className="flex size-5 items-center justify-center rounded-full bg-white text-blue-500 font-bold text-xs leading-none">
                                            !
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left overflow-hidden">
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                                            {t('actionNeeded')}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-blue-100/90 font-medium mt-1 truncate">
                                            {t('actionNeededDesc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Кнопка полноэкранного режима */}
                <button
                    type="button"
                    onClick={FullScreenEkran}
                    title={t('fullscreen')}
                    aria-label={t('fullscreen')}
                    className="flex size-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                    <ExternalLink className="size-5" />
                </button>

                {/* 5. Аватарка с выпадающим меню (Profile / Setting) */}
                <div className="relative ml-1" ref={profileRef}>
                    <button type="button" onClick={() => { setIsProfileOpen((prev) => !prev); setIsNotificationsOpen(false); }} className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-sky-400 focus:outline-none cursor-pointer">
                        <img src={avatarUrl} alt="avatar" className="size-full rounded-full bg-sky-100 dark:bg-sky-400/20 object-cover" />
                    </button>

                    {/* Выпадающее окно профиля */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[calc(100vw-32px)] max-w-[320px] rounded-3xl border border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#16202e] p-4 sm:p-5 shadow-[0_20px_50px_rgba(15,23,42,0.14),0_4px_12px_rgba(15,23,42,0.06)] animate-in fade-in zoom-in-95 duration-150">
                            {/* Шапка попапа: Аватарка, Имя, Статус, Кнопка выхода */}
                            <div className="flex items-center justify-between pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 shrink-0 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-400/20">
                                        <img src={avatarUrl} alt="avatar" className="size-full object-cover" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                            {userName}
                                        </h4>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                            {t('owner')}
                                        </span>
                                    </div>
                                </div>

                                <button type="button" onClick={handleLogout} title={t('logout')} className="flex size-9 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 cursor-pointer">
                                    <LogOut className="size-5 stroke-[2]" />
                                </button>
                            </div>

                            {/* Табы: Profile и Setting */}
                            <div className="relative flex border-b border-slate-100 dark:border-[#1e293b]">
                                <button type="button" onClick={() => setActiveTab('profile')} className={cn('flex flex-1 items-center justify-center gap-2 pb-3 text-sm font-medium transition-colors relative cursor-pointer', activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
                                    <User className="size-4" />
                                    <span>{t('profile')}</span>
                                    {activeTab === 'profile' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>

                                <button type="button" onClick={() => setActiveTab('setting')} className={cn('flex flex-1 items-center justify-center gap-2 pb-3 text-sm font-medium transition-colors relative cursor-pointer', activeTab === 'setting' ? 'text-blue-600 dark:text-blue-400 font-semibold': 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
                                    <Settings className="size-4" />
                                    <span>{t('setting')}</span>
                                    {activeTab === 'setting' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>
                            </div>

                            {/* Контент табов */}
                            {activeTab === 'profile' ? (
                                /* Вкладка Profile */
                                <div className="mt-3.5 flex flex-col gap-1 text-left">
                                    <button type="button" onClick={() => { setActiveProfileItem('edit'); setIsProfileOpen(false); navigate('/home/profile', { state: { edit: true } }); }} className={cn("flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition cursor-pointer", activeProfileItem === 'edit' ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/40": "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white")}>
                                        <Pencil className={cn("size-4", activeProfileItem === 'edit' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                                        <span>{t('editProfile')}</span>
                                    </button>

                                    <button type="button" onClick={() => { setActiveProfileItem('view'); setIsProfileOpen(false); navigate('/home/profile', { state: { edit: false } }); }} className={cn("flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition cursor-pointer", activeProfileItem === 'view' ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/40": "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white")}>
                                        <User className={cn("size-4", activeProfileItem === 'view' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                                        <span>{t('viewProfile')}</span>
                                    </button>

                                    <button type="button" onClick={() => setActiveProfileItem('social')} className={cn("flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition cursor-pointer", activeProfileItem === 'social' ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/40": "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white")}>
                                        <Users className={cn("size-4", activeProfileItem === 'social' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                                        <span>{t('socialProfile')}</span>
                                    </button>

                                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer">
                                        <LogOut className="size-4 text-slate-400 dark:text-slate-500" />
                                        <span>{t('logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                /* Вкладка Setting */
                                <div className="mt-3.5 flex flex-col text-left">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                                        {t('themeMode')}
                                    </p>

                                    {/* 3 кнопки тем: Light, Dark, Auto */}
                                    <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                                        <button type="button" onClick={() => applyTheme('light')} className={cn('flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition cursor-pointer', theme === 'light' ? 'border-2 border-blue-500 bg-white dark:bg-[#131a24] shadow-xs': 'border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131a24] hover:bg-slate-50 dark:hover:bg-slate-800/60')}>
                                            <Sun className="size-5 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t('light')}</span>
                                        </button>

                                        <button type="button" onClick={() => applyTheme('dark')} className={cn('flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition cursor-pointer', theme === 'dark' ? 'border-2 border-blue-500 bg-white dark:bg-[#131a24] shadow-xs': 'border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131a24] hover:bg-slate-50 dark:hover:bg-slate-800/60')}>
                                            <Moon className="size-5 text-slate-900 dark:text-sky-400 fill-slate-900 dark:fill-sky-400" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{t('dark')}</span>
                                        </button>

                                        <button type="button" onClick={() => applyTheme('auto')} className={cn('flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition cursor-pointer', theme === 'auto' ? 'border-2 border-blue-500 bg-white dark:bg-[#131a24] shadow-xs': 'border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131a24] hover:bg-slate-50 dark:hover:bg-slate-800/60')}>
                                            <Settings className="size-5 text-slate-800 dark:text-slate-300" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{t('auto')}</span>
                                        </button>
                                    </div>

                                    {/* Пункты Support и Privacy Center */}
                                    <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-[#1e293b] pt-2">
                                        <button type="button" className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                                            <div className="flex size-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold leading-none">
                                                24
                                            </div>
                                            <span>{t('support')}</span>
                                        </button>

                                        <button type="button" className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                                            <Lock className="size-4 text-slate-500 dark:text-slate-400" />
                                            <span>{t('privacyCenter')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
