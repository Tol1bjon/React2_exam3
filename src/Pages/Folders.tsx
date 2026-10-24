import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Folders = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-2">
            {/* Top Bar */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white md:text-2xl">
                    {t('foldersTitle')}
                </h1>

                <button type="button" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 cursor-pointer">
                    <Plus className="size-4" />
                    <span>{t('addFolder')}</span>
                </button>
            </div>
        </div>
    );
};

export default Folders;
