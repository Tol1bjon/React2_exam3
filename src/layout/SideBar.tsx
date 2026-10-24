import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
    Archive,
    Banknote,
    ChevronRight,
    Folder,
    LayoutGrid,
    LogIn,
    Scale,
    UserRound,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { axiosRequest, removeToken, logoutUser } from '@/lib/Tokens';
import { useUser } from '@/Store/Zustand';

type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
};

const links: NavItem[] = [
    { to: '/home', label: 'Dashboard', icon: LayoutGrid },
    { to: 'debts', label: 'Debts', icon: Banknote },
    { to: 'archive', label: 'Archive', icon: Archive },
    { to: 'contacts', label: 'Contacts', icon: Users },
    { to: 'folders', label: 'Folders', icon: Folder },
    { to: 'users', label: 'Users', icon: UserRound },
];

const mobileLinks: NavItem[] = [
    { to: '/home', label: 'Dashboard', icon: LayoutGrid },
    { to: 'debts', label: 'Debts', icon: Banknote },
    { to: 'folders', label: 'Folders', icon: Folder },
    { to: 'archive', label: 'Archive', icon: Archive },
    { to: 'users', label: 'Users', icon: UserRound },
];

type SideBarProps = {
    isOpen: boolean;
};

const SideBar = ({ isOpen }: SideBarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useUser((state: any) => state.user);
    const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Tolibjon'}`;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Текст плавно исчезает при сворачивании, иконки остаются на месте
    const labelClass = cn(
        'whitespace-nowrap transition-all duration-300',
        isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'
    );






    // LOG OUT
    const handleLogout = () => {
        setIsMenuOpen(false);
        logoutUser();
    };

    return (
        <>
            {/* Desktop */}
            <aside className={cn('sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white dark:bg-[#0b131f] border-r border-slate-200 dark:border-[#1e293b] transition-[width] duration-300 ease-in-out md:flex', isOpen ? 'w-64' : 'w-[76px]')}>
                <div className="flex h-[72px] items-center px-5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform duration-300 hover:-translate-y-0.5">
                        <Scale className="size-5" />
                    </div>
                </div>

                <p className={cn('px-6 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400', labelClass)}>Adl 5:8</p>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} end={to === '/home' || to === '/'} title={isOpen ? undefined : label} className={({ isActive }) => cn('group flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:translate-y-px', isActive ? 'bg-blue-50 dark:bg-[#162232] text-blue-600 dark:text-sky-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white')}>
                            <Icon className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                            <span className={labelClass}>{t(label.toLowerCase())}</span>
                        </NavLink>
                    ))}
                </nav>

                <div ref={menuRef} className="relative border-t border-slate-200 dark:border-[#1e293b] p-3">
                    {/* Выпадающее меню (как на скриншоте) */}
                    {isMenuOpen && user && (
                        <div className="absolute bottom-[calc(100%+8px)] right-3 z-50 flex w-36 flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#16202e] p-1.5 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.18),0_4px_12px_rgba(15,23,42,0.06)]">
                            <button type="button" onClick={handleLogout} className="flex w-full cursor-pointer items-center justify-start rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white">
                                {t('logout')}
                            </button>
                            <button type="button" onClick={() => { setIsMenuOpen(false); navigate('/home/profile'); }} className="flex w-full cursor-pointer items-center justify-start rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white">
                                {t('profile')}
                            </button>
                        </div>
                    )}

                    {user ? (
                        <div title={isOpen ? undefined : user.name} onClick={() => setIsMenuOpen((prev) => !prev)} className="group flex w-full items-center justify-between overflow-hidden rounded-2xl p-1.5 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img src={avatarUrl} alt="avatar" className="size-10 shrink-0 rounded-full bg-sky-100 object-cover" />
                                <div className={cn('flex flex-col text-left overflow-hidden', labelClass)}>
                                    <span className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs text-slate-400 dark:text-slate-500">
                                        {t('owner')}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className={cn('size-4 shrink-0 text-slate-400 transition-transform duration-200', isMenuOpen ? '-rotate-90' : 'group-hover:translate-x-0.5', labelClass)} />
                        </div>
                    ) : (
                        <NavLink to="/login_and_register">
                            <button type="button" title={isOpen ? undefined : t('login')} className="group flex w-full items-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0">
                                <LogIn className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                                <span className={labelClass}>{t('login')}</span>
                            </button>
                        </NavLink>
                    )}
                </div>
            </aside>

            {/* Mobile */}
            <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-slate-200/60 bg-white/60 dark:bg-[#0b131f]/90 border border-slate-200/60 dark:border-[#1e293b] p-2 shadow-lg backdrop-blur-xl md:hidden">
                {mobileLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} end={to === '/home' || to === '/'} aria-label={label} className={({ isActive }) => cn('flex size-11 items-center justify-center rounded-xl transition-all duration-200 active:translate-y-0.5', isActive ? '-translate-y-1 bg-blue-50 dark:bg-[#162232] text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:-translate-y-0.5 hover:text-slate-900 dark:hover:text-white')}>
                        <Icon className="size-6" />
                    </NavLink>
                ))}
            </nav>
        </>
    );
}

export default SideBar;
