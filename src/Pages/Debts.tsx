import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Download,
    CircleDollarSign,
    Search,
    ChevronDown,
    SlidersHorizontal,
    ArrowUpDown,
    MoreVertical,
    Calendar,
    SquarePen,
    CheckCircle2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddDebtModal from '@/components/AddDebtModal';
import CloseDebtModal from '@/components/CloseDebtModal';
import DebtStatsCards from '@/components/DebtStatsCards';
import { useUser } from '@/Store/Zustand';

const folders = ['All Folders', 'Долги'];

const Debts = () => {
    const [editDebtOpen, setEditDebtOpen] = useState(null)
    const [isDebtsOpen, setIsDebtsOpen] = useState(false);
    const [closingDebt, setClosingDebt] = useState(null);
    const { t } = useTranslation();
    const [selectedContact, setSelectedContact] = useState('All Contacts');
    const [selectedFolder, setSelectedFolder] = useState('All Folders');
    const [search, setSearch] = useState('');

    const { debts, getDebts, contacts, getContacts } = useUser((state: any) => state);

    useEffect(() => {
        getDebts();
        getContacts();
    }, []);

    const contactOptions = ['All Contacts', ...new Set((contacts || []).map((c: any) => c.name).filter(Boolean))];

    const filteredDebts = (debts || [])
        .filter((user: any) => user.status !== 'paid' && user.status !== 'closed')
        .filter((user: any) => {
            const contactName = user.name || user.contact?.name || user.contact_name || contacts?.find((c: any) => c.id === user.contact_id)?.name || '';
            return contactName.toLowerCase().includes(search.toLowerCase());
        });

    return (
        <div className="pt-2">
            {/* Header with Title and Action Buttons */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white md:text-2xl">
                    Adl 5:8
                </h1>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#162232] px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-0 cursor-pointer">
                        <Download className="size-4" />
                        <span>{t('export')}</span>
                    </button>

                    <button type="button" onClick={() => setIsDebtsOpen(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 cursor-pointer">
                        <CircleDollarSign className="size-4" />
                        <span>{t('quickPayment')}</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <DebtStatsCards debts={debts} />

            {/* Debts Table Container */}
            <div className="mt-6 rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-5 sm:p-6 shadow-sm">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchByName') + "..."} className="w-full rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 py-3 pl-12 pr-4 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" />
                </div>

                {/* Filters Row */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* All Contacts Select */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-1 items-center justify-between rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 cursor-pointer">
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
                        <DropdownMenuTrigger className="flex flex-1 items-center justify-between rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 cursor-pointer">
                            <span>{selectedFolder === 'All Folders' ? t('allFolders') : selectedFolder}</span>
                            <ChevronDown className="size-4 text-slate-400 dark:text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={6} className="w-[var(--anchor-width)] min-w-48 rounded-2xl border-0 bg-white dark:bg-[#16202e] p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-[#1e293b] z-50">
                            {folders.map((f) => (
                                <DropdownMenuItem key={f} onClick={() => setSelectedFolder(f)} className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm transition-all duration-150 ${f === selectedFolder ? 'bg-blue-50 dark:bg-blue-900/40 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                                    {f === 'All Folders' ? t('allFolders') : f}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2">
                        <button type="button" aria-label={t('filter')} className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 cursor-pointer">
                            <SlidersHorizontal className="size-4" />
                        </button>
                        <button type="button" aria-label={t('sort')} className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:translate-y-0 cursor-pointer">
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
                            <div className="col-span-2 border-r border-slate-200/60 dark:border-[#1e293b] px-3">
                                {t('amount')}
                            </div>
                            <div className="col-span-3 border-r border-slate-200/60 dark:border-[#1e293b] px-3">
                                {t('progress')}
                            </div>
                            <div className="col-span-3 pl-3">
                                {t('dueDate')}
                            </div>
                        </div>

                        {filteredDebts.length === 0 ? (
                            <div className="py-20 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                                {t('noDebtsFound')}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-[#1e293b]">
                                {filteredDebts.map((debt: any) => {
                                    const isOwe = debt.direction === 'i_owe_them' || debt.type === 'borrowed' || debt.type === 'owe';
                                    const total = Number(debt.amount) || 0;
                                    const paid = Number(debt.paid_amount || debt.paidAmount || 0);
                                    const remaining = Math.max(0, total - paid);
                                    const formattedAmount = `${isOwe ? '-' : '+'}${remaining.toLocaleString('ru-RU')} TJS`;
                                    const progressPercent = debt.progress !== undefined ? debt.progress : (total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0);
                                    const contactName = debt.name || debt.contact?.name || debt.contact_name || contacts?.find((c: any) => c.id === debt.contact_id)?.name || 'Контакт';

                                    return (
                                        <div key={debt.id} className="grid grid-cols-12 items-center px-4 py-4 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                            {/* Полное имя + Аватар */}
                                            <div className="col-span-4 flex items-center gap-3 pr-2 min-w-0">
                                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isOwe ? 'bg-red-500/10 text-red-500 dark:bg-red-500/15' : 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15'}`}>
                                                    <CircleDollarSign className="size-5" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                                                        {contactName}
                                                    </span>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                        {debt.description || debt.comment || '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Сумма */}
                                            <div className={`col-span-2 px-3 font-bold tracking-tight ${isOwe ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {formattedAmount}
                                            </div>

                                            {/* Прогресс */}
                                            <div className="col-span-3 px-3">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`text-xs font-semibold text-right ${isOwe ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {progressPercent}%
                                                    </span>
                                                    <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                        <div className={`h-full rounded-full ${isOwe ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${progressPercent}%` }}/>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Дата погашения + Меню действий */}
                                            <div className="col-span-3 pl-3 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    <Calendar className="size-3.5 shrink-0" />
                                                    <span className="truncate">
                                                        {debt.dueDate || '23 окт. 2026 г. – 30 окт. 2027 г.'}
                                                    </span>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer">
                                                        <MoreVertical className="size-4 ml-auto" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52 rounded-2xl border border-slate-100 dark:border-[#223247] bg-white dark:bg-[#182232] p-1.5 shadow-xl z-50">
                                                        <DropdownMenuItem onClick={() => setEditDebtOpen(debt)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                                                            <SquarePen className="size-4 text-slate-600 dark:text-slate-300" />
                                                            <span>{t('edit')}</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => setClosingDebt(debt)}
                                                            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                                                            <CheckCircle2 className="size-4 text-emerald-500" />
                                                            <span>{t('markAsClosed')}</span>
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

            <AddDebtModal isOpen={isDebtsOpen || Boolean(editDebtOpen)} onClose={() => { setIsDebtsOpen(false); setEditDebtOpen(null); }} edit={editDebtOpen} />
            <CloseDebtModal isOpen={Boolean(closingDebt)} onClose={() => setClosingDebt(null)} debt={closingDebt} />
        </div>
    );
};

export default Debts;
