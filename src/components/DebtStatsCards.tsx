import { useEffect } from 'react';
import { Wallet, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/Store/Zustand';

interface DebtStatsCardsProps {
    debts?: any[];
}

const DebtStatsCards = ({ debts: customDebts }: DebtStatsCardsProps) => {
    const { t } = useTranslation();
    const storeDebts = useUser((state: any) => state.debts);
    const getDebts = useUser((state: any) => state.getDebts);

    useEffect(() => {
        if (!customDebts && getDebts) {
            getDebts();
        }
    }, [customDebts]);

    const debts = customDebts || storeDebts || [];
    const activeDebts = debts.filter((d: any) => d.status !== 'paid' && d.status !== 'closed');

    const totalOwesMe = activeDebts
        ?.filter((d: any) => d.type === 'lent' || d.type === 'owes_me' || d.direction === 'they_owe_me')
        ?.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0) || 0;

    const totalIOwe = activeDebts
        ?.filter((d: any) => d.type === 'borrowed' || d.type === 'owe' || d.direction === 'i_owe_them')
        ?.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0) || 0;

    const netTotal = totalOwesMe - totalIOwe;

    const stats = [
        {
            id: 'net-total',
            label: 'Net Total',
            value: netTotal,
            currency: 'TJS',
            icon: Wallet,
            iconBg: 'bg-amber-100/80 dark:bg-[#332a15] text-amber-500 dark:text-amber-400',
            valueColor: 'text-amber-500 dark:text-amber-400',
            cardClass: 'col-span-2 md:col-span-1 border-2 border-emerald-400/80 dark:border-emerald-500/50 bg-white dark:bg-[#131d2b] shadow-sm',
        },
        {
            id: 'owes-me',
            label: 'Owes Me',
            value: totalOwesMe,
            currency: 'TJS',
            icon: CreditCard,
            iconBg: 'bg-emerald-100/80 dark:bg-[#132a24] text-emerald-500 dark:text-emerald-400',
            valueColor: 'text-emerald-500 dark:text-emerald-400',
            cardClass: 'col-span-1 border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] shadow-sm',
        },
        {
            id: 'i-owe',
            label: 'I Owe',
            value: totalIOwe,
            currency: 'TJS',
            icon: CreditCard,
            iconBg: 'bg-rose-100/80 dark:bg-[#2f181c] text-red-500 dark:text-rose-400',
            valueColor: 'text-red-500 dark:text-rose-400',
            cardClass: 'col-span-1 border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] shadow-sm',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 md:gap-5">
            {stats.map(({ id, value, currency, icon: Icon, iconBg, valueColor, cardClass }) => (
                <div key={id} className={`flex items-center justify-between rounded-3xl p-3.5 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cardClass}`}>
                    <div className={`flex size-11 sm:size-14 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                        <Icon className="size-5 sm:size-6" />
                    </div>

                    <div className="flex flex-col items-end text-right">
                        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            {id === 'net-total' ? t('netTotal') : id === 'owes-me' ? t('owesMe') : t('iOwe')}
                        </span>
                        <div className="mt-1 flex items-baseline gap-1 sm:gap-1.5">
                            <span className={`text-xl sm:text-2xl font-bold ${valueColor}`}>{value}</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{currency}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DebtStatsCards;
