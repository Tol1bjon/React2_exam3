import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search,
    ChevronDown,
    ArrowUpDown,
    SlidersHorizontal,
    CircleDollarSign,
    MoreVertical,
    SquarePen,
    RotateCcw,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddDebtModal from '@/components/AddDebtModal';
import { useUser } from '@/Store/Zustand';

const folderOptions = ['All Folders', 'Долги'];

const Archive = () => {
    const { t } = useTranslation();
    const debts = useUser((state: any) => state.debts);
    const getDebts = useUser((state: any) => state.getDebts);
    const storeContacts = useUser((state: any) => state.contacts);
    const getContacts = useUser((state: any) => state.getContacts);
    const reopenDebt = useUser((state: any) => state.reopenDebt);

    const [selectedContact, setSelectedContact] = useState('All Contacts');
    const [selectedFolder, setSelectedFolder] = useState('All Folders');
    const [search, setSearch] = useState('');
    const [editingDebt, setEditingDebt] = useState<any | null>(null);

    useEffect(() => {
        getDebts();
        if (getContacts) getContacts();
    }, []);

    // Список контактов для выпадающего списка
    const contactOptions = ['All Contacts', ...new Set((storeContacts || []).map((c: any) => c.name).filter(Boolean))];

    // Фильтрация закрытых долгов
    const closedDebts = (debts || [])
        .filter((d: any) => d.status === 'paid' || d.status === 'closed')
        .filter((d: any) => {
            const contactName = d.name || d.contact?.name || d.contact_name || storeContacts?.find((c: any) => c.id === d.contact_id)?.name || '';
            const matchesSearch = contactName.toLowerCase().includes(search.toLowerCase());
            const matchesContact = selectedContact === 'All Contacts' || contactName === selectedContact;
            return matchesSearch && matchesContact;
        });

    const handleReopen = async (id: any) => {
        if (reopenDebt) {
            await reopenDebt(id);
            if (getDebts) await getDebts();
        }
    };

    return (
        <div className="pt-2">
            {/* Top Bar */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-2xl">
                    {t('archive')}
                </h1>
            </div>

            {/* Archive Container */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-3.5 sm:p-6 shadow-sm">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3.5 sm:left-4 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('searchByName') + "..."}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    />
                </div>

                {/* Filters Row */}
                <div className="mt-3.5 sm:mt-4 flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center">
                    {/* All Contacts Select */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-1 items-center justify-between rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 cursor-pointer">
                            <span>{selectedContact === 'All Contacts' ? t('allContacts') : selectedContact}</span>
                            <ChevronDown className="size-4 text-slate-400 dark:text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={6} className="w-[var(--anchor-width)] min-w-48 rounded-2xl border-0 bg-white dark:bg-[#16202e] p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-[#1e293b] z-50">
                            {contactOptions.map((c: any) => (
                                <DropdownMenuItem key={c} onClick={() => setSelectedContact(c)} className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm transition-all duration-150 ${c === selectedContact ? 'bg-blue-50 dark:bg-blue-900/40 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                                    {c === 'All Contacts' ? t('allContacts') : c}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* All Folders Select */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-1 items-center justify-between rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 cursor-pointer">
                            <span>{selectedFolder === 'All Folders' ? t('allFolders') : selectedFolder}</span>
                            <ChevronDown className="size-4 text-slate-400 dark:text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={6} className="w-[var(--anchor-width)] min-w-48 rounded-2xl border-0 bg-white dark:bg-[#16202e] p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-[#1e293b] z-50">
                            {folderOptions.map((f) => (
                                <DropdownMenuItem key={f} onClick={() => setSelectedFolder(f)} className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm transition-all duration-150 ${f === selectedFolder ? 'bg-blue-50 dark:bg-blue-900/40 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                                    {f === 'All Folders' ? t('allFolders') : f}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button type="button" aria-label={t('filter')} className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 cursor-pointer">
                            <SlidersHorizontal className="size-4" />
                        </button>
                        <button type="button" aria-label={t('sort')} className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 cursor-pointer">
                            <ArrowUpDown className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Table Container for mobile */}
                <div className="overflow-x-auto">
                    <div className="min-w-[620px]">
                        {/* Table Header Row */}
                        <div className="mt-5 grid grid-cols-12 rounded-xl bg-slate-50/80 dark:bg-[#0b131f]/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <div className="col-span-4 border-r border-slate-200/60 dark:border-[#1e293b] pr-2">
                                {t('fullName')}
                            </div>
                            <div className="col-span-3 border-r border-slate-200/60 dark:border-[#1e293b] px-3">
                                {t('amount')}
                            </div>
                            <div className="col-span-3 border-r border-slate-200/60 dark:border-[#1e293b] px-3">
                                {t('progress')}
                            </div>
                            <div className="col-span-2 pl-3">
                                {t('description')}
                            </div>
                        </div>

                        {/* Список закрытых долгов */}
                        {closedDebts.length === 0 ? (
                            <div className="py-20 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                                {t('noDebtsFound')}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-[#1e293b]/60">
                                {closedDebts.map((debt: any) => {
                                    const isOwe = debt.direction === 'i_owe_them' || debt.type === 'borrowed' || debt.type === 'owe';
                                    const total = Number(debt.amount) || 0;
                                    const paid = Number(debt.paid_amount || debt.paidAmount || 0);
                                    const isFullyPaid = paid >= total && total > 0;
                                    const remaining = isFullyPaid ? 0 : total - paid;
                                    const formattedAmount = `${isOwe ? '-' : '+'}${remaining.toLocaleString('ru-RU')} TJS`;
                                    const progressPercent = debt.progress !== undefined ? debt.progress : (isFullyPaid ? 100 : (total > 0 ? Math.round((paid / total) * 100) : 0));
                                    const progressText = `${paid.toLocaleString('ru-RU')} / ${total.toLocaleString('ru-RU')}`;
                                    const contactName = debt.name || debt.contact?.name || debt.contact_name || storeContacts?.find((c: any) => c.id === debt.contact_id)?.name || 'Контакт';

                                    return (
                                        <div key={debt.id} className="grid grid-cols-12 items-center px-4 py-4 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                            {/* Полное имя + Бейдж Closed + Направление */}
                                            <div className="col-span-4 flex items-center gap-3 pr-2 min-w-0">
                                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isOwe ? 'bg-red-500/10 text-red-500 dark:bg-red-500/15' : 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15'}`}>
                                                    <CircleDollarSign className="size-5" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {contactName}
                                                        </span>
                                                        <span className="rounded-md bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                                            {t('closed')}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                                        {isOwe ? t('iOwe') : t('owesMe')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Сумма */}
                                            <div className="col-span-3 px-3 flex flex-col justify-center">
                                                 <span className={`font-bold tracking-tight ${isOwe ? 'text-red-500' : 'text-emerald-500'}`}>
                                                     {formattedAmount}
                                                 </span>
                                                 {isFullyPaid && (
                                                     <span className="text-xs text-slate-400 dark:text-slate-500">
                                                         {t('total')}: {total.toLocaleString('ru-RU')}
                                                     </span>
                                                 )}
                                             </div>

                                            {/* Прогресс */}
                                            <div className="col-span-3 px-3 flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <span>{progressText}</span>
                                                    <span className={`font-semibold ${progressPercent === 100 ? (isOwe ? 'text-red-500' : 'text-emerald-500') : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                        {progressPercent}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${isOwe ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Описание + Меню действий */}
                                            <div className="col-span-2 pl-3 flex items-center justify-between min-w-0">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                                                    {debt.description || debt.comment || '-'}
                                                </span>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer shrink-0">
                                                        <MoreVertical className="size-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-2xl border border-slate-100 dark:border-[#223247] bg-white dark:bg-[#182232] p-1.5 shadow-xl z-50">
                                                        <DropdownMenuItem onClick={() => setEditingDebt(debt)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                                                            <SquarePen className="size-4 text-slate-600 dark:text-slate-300" />
                                                            <span>{t('edit')}</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleReopen(debt.id)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-blue-500 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/30">
                                                            <RotateCcw className="size-4 text-blue-500 dark:text-blue-400" />
                                                            <span>{t('reopenDebt')}</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Модалка редактирования */}
            <AddDebtModal
                isOpen={Boolean(editingDebt)}
                onClose={() => setEditingDebt(null)}
                edit={editingDebt}
            />
        </div>
    );
};

export default Archive;
