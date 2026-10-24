import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDollarSign, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddDebtModal from '@/components/AddDebtModal';

const AddButton = () => {
    const { t } = useTranslation();
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtType, setDebtType] = useState<"owe" | "lent">("owe");

    const handleOpen = (type: "owe" | "lent") => {
        setDebtType(type);
        setIsDebtModalOpen(true);
    };

    const actions = [
        { type: 'owe' as const, label: t('iOwe'), color: 'text-red-500', delay: 'group-hover:delay-75 group-focus-within:delay-75' },
        { type: 'lent' as const, label: t('owesMe'), color: 'text-emerald-500', delay: '' },
    ];

    return (
        <>
            <div className="group pointer-events-none fixed bottom-24 right-5 z-40 flex flex-col items-end md:bottom-8 md:right-8">
                {actions.map(({ type, label, color, delay }) => (
                    <div key={label} className={cn('pb-3 opacity-0 transition-all duration-200 translate-y-3','group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100','group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100',delay)}>
                        <button
                            type="button"
                            onClick={() => handleOpen(type)}
                            className="group/item flex items-center gap-3 pr-1 cursor-pointer"
                        >
                            <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-md ring-1 ring-slate-200 transition-all duration-200 group-hover/item:-translate-x-1 group-hover/item:text-slate-900">{label}</span>
                            <span className={cn('flex size-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-200 transition-all duration-200 group-hover/item:-translate-y-0.5 group-hover/item:shadow-lg', color)}><CircleDollarSign className="size-6" /></span>
                        </button>
                    </div>
                ))}

                <button type="button" aria-label={t('add')} className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 active:translate-y-0 cursor-pointer"><Plus className="size-6 transition-transform duration-300 group-hover:rotate-45 group-focus-within:rotate-45" /></button>
            </div>

            <AddDebtModal
                isOpen={isDebtModalOpen}
                initialType={debtType}
                onClose={() => setIsDebtModalOpen(false)}
            />
        </>
    );
}

export default AddButton;
