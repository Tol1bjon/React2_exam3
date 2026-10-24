import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/Store/Zustand";

const DeleteContact = ({ id, onClose }: any) => {
  const { t } = useTranslation();
  const deleteContact = useUser((state: any) => state.deleteContact);

  if (!id) return null;

  const handleDelete = async () => {
    await deleteContact(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 dark:border-[#223247] bg-white dark:bg-[#141d2b] p-6 shadow-2xl transition-all">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
            <Trash2 className="size-5 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("confirmDelete")}
          </h2>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t("confirmDeleteContactDesc")}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{t("cancel")}</button>
          <button type="button" onClick={handleDelete} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700 active:translate-y-px cursor-pointer">{t("delete")}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteContact;
