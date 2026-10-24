import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
    Pencil,
    Users,
    Contact,
    ChevronRight,
    Sun,
    Moon,
    LogOut,
} from 'lucide-react';
import { useUser } from '@/Store/Zustand';
import { axiosRequest, removeToken, logoutUser } from '@/lib/Tokens';

const Profile = () => {
    const updateUser = useUser((state: any) => state.updateUser)
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const user = useUser((state: any) => state.user);
    const getMe = useUser((state: any) => state.getMe);

    const [isEditing, setIsEditing] = useState(() => Boolean(location.state?.edit));
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        if (getMe) getMe();
    }, []);




    // edit
    const handleEdit = async() => {
        if(!editName.trim()){
            alert("Имя не может быть пустым!")
            return
        }

        try {
            await updateUser({
                name: editName.trim(),
                email: editEmail.trim(),
            })
            setIsEditing(false)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (location.state?.edit !== undefined) {
            setIsEditing(Boolean(location.state.edit));
        }
    }, [location.state]);

    useEffect(() => {
        if (user) {
            setEditName(user.name || '');
            setEditEmail(user.email || '');
        }
    }, [user]);

    // Переключение темы
    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Смена языка
    const currentLang = i18n.language;
    const changeLang = (code: string) => {
        const target = code === 'TJ' ? 'tg' : code === 'RU' ? 'ru' : 'en';
        i18n.changeLanguage(target);
        localStorage.setItem('app_language', target);
    };

    // Выход из системы
    const handleLogout = () => {
        logoutUser();
    };

    const avatarUrl =
        user?.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Tolibjon'}`;

    return (
        <div className="mx-auto max-w-4xl pt-2 pb-12">
            <h1 className="mb-6 text-xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-2xl">
                {t('profile')}
            </h1>

            {/* Карточка пользователя */}
            <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-6 sm:p-8 text-center shadow-xs">
                {/* Аватар */}
                <div className="mb-3 flex size-20 sm:size-24 items-center justify-center overflow-hidden rounded-full bg-sky-200 dark:bg-sky-500/20 ring-4 ring-blue-500/30">
                    <img src={avatarUrl} alt="avatar" className="size-full object-cover" />
                </div>

                {!isEditing ? (
                    /* Режим просмотра */
                    <>
                        <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                                {user?.name || 'Tolibjon'}
                            </span>
                            <button type="button" onClick={() => setIsEditing(true)} aria-label="Edit Profile" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">
                                <Pencil className="size-4" />
                            </button>
                        </div>

                        <span className="mt-2 inline-block rounded-full bg-blue-600 px-3.5 py-0.5 text-xs font-semibold text-white shadow-xs">
                            {user?.role || t('roleOwner')}
                        </span>
                    </>
                ) : (
                    /* Режим редактирования данных */
                    <div className="mt-2 flex w-full max-w-sm flex-col gap-4 text-left animate-in fade-in duration-150">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3.5 bg-white dark:bg-[#131d2b] px-1 text-xs font-medium text-slate-400 dark:text-slate-400">
                                {t('username')}
                            </label>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-[#26354a] bg-transparent px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500 transition"/>
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3.5 bg-white dark:bg-[#131d2b] px-1 text-xs font-medium text-slate-400 dark:text-slate-400">
                                {t('email')}
                            </label>
                            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-[#26354a] bg-transparent px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500 transition"/>
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-3">
                            <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl border border-slate-300 dark:border-[#26354a] px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                                {t('cancel')}
                            </button>
                            <button type="button" onClick={handleEdit} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition cursor-pointer">
                                {t('save')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Карточки навигации: Пользователи и Контакты */}
            <div className="mt-4 flex flex-col gap-3">
                <NavLink to="/home/users" className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-4 sm:p-5 shadow-xs transition hover:bg-slate-50/50 dark:hover:bg-slate-800/20 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3.5">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                            <Users className="size-5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                                {t('users')}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                {t('manageUsersAndRoles')}
                            </span>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400" />
                </NavLink>

                <NavLink to="/home/contacts" className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-4 sm:p-5 shadow-xs transition hover:bg-slate-50/50 dark:hover:bg-slate-800/20 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3.5">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            <Contact className="size-5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                                {t('contacts')}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                {t('viewAndManageContacts')}
                            </span>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400" />
                </NavLink>
            </div>

            {/* Секция: Настройки */}
            <div className="mt-6">
                <h2 className="mb-3 text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                    {t('settings')}
                </h2>

                <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-4 sm:p-6 shadow-xs">
                    {/* Переключатель темы: Тёмный режим */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <Sun className="size-5 text-amber-500 fill-amber-500" />
                            ) : (
                                <Moon className="size-5 text-slate-600 dark:text-slate-300 fill-slate-600 dark:fill-slate-300" />
                            )}
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {t('darkMode')}
                            </span>
                        </div>

                        <button type="button" role="switch" aria-checked={isDark} onClick={toggleTheme} className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isDark ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <span className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`}/>
                        </button>
                    </div>

                    <div className="my-5 border-t border-slate-100 dark:border-[#1e293b]" />

                    {/* Выбор языка */}
                    <div>
                        <div className="mb-3.5 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                            <span className="flex size-6 items-center justify-center rounded-md bg-blue-500/10 text-xs font-bold text-blue-500">
                                文
                            </span>
                            <span>{t('language')}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => changeLang('GB')}
                                className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${
                                    currentLang === 'en'
                                        ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#0b131f]/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                <span className="text-xs">GB</span>
                                <span>English</span>
                            </button>

                            <button type="button" onClick={() => changeLang('RU')} className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${currentLang === 'ru' ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold' : 'border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#0b131f]/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                                <span className="text-xs">RU</span>
                                <span>Русский</span>
                            </button>

                            <button type="button" onClick={() => changeLang('TJ')} className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${currentLang === 'tg' ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold' : 'border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#0b131f]/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                                <span className="text-xs">TJ</span>
                                <span>Тоҷикӣ</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Кнопка выхода */}
                <button type="button" onClick={handleLogout} className="mt-4 sm:mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/70 bg-transparent py-3.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30 active:translate-y-px cursor-pointer">
                    <LogOut className="size-4" />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default Profile;
