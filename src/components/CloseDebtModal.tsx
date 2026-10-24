import { useUser } from '@/Store/Zustand';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CloseDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
    debt?: any;
    onConfirm?: (debt?: any) => void;
}

const CloseDebtModal = ({ isOpen, onClose, debt }: CloseDebtModalProps) => {
    const closeDebt = useUser((state: any) => state.closeDebt)

    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            await closeDebt(debt?.id);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-[#223247] bg-white dark:bg-[#182232] p-6 shadow-2xl">
                {/* Заголовок с иконкой */}
                <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500 dark:bg-red-600 dark:text-white">
                        <Trash2 className="size-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                        {t('closeDebt', 'Close Debt')}
                    </h2>
                </div>

                {/* Текст подтверждения */}
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    {t('confirmCloseDebt', 'Are you sure you want to close this debt?')}
                </p>

                {/* Кнопки действий */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                        {t('cancel', 'Cancel')}
                    </button>
                    <button type="button" onClick={handleConfirm} className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:translate-y-px">
                        {t('markAsClosed', 'Mark As Closed')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseDebtModal;
