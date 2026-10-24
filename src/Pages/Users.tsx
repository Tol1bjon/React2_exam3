import { Home, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';

const Users = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-2">
            <h1 className="mb-6 text-xl font-bold tracking-tight text-slate-800 dark:text-white md:text-2xl">
                {t('usersTitle')}
            </h1>

            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-8 text-center shadow-sm">
                <div className="relative mb-4 flex size-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition-all duration-200 hover:-translate-y-1">
                    <span className="text-4xl select-none">✨</span>
                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                        <Sparkles className="size-3.5" />
                    </span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>✨ {t('comingSoon')}</span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
                    {t('noUsersYet')}
                </h2>

                <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    {t('usersPlaceholderDesc')}
                </p>

                <NavLink to="/home" className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 cursor-pointer">
                    <Home className="size-4" />
                    <span>{t('backToDashboard')}</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Users;
