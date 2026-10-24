import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/Store/Zustand";

const AddContact = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const addContact = useUser((state: any) => state.addContact);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [nameError, setNameError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(t("fullNameRequired"));
      return;
    }

    await addContact({ name, phone, note });
    setName("");
    setPhone("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-100 dark:border-[#223247] bg-white dark:bg-[#182232] p-5 sm:p-7 shadow-2xl transition-all">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t("addContact")}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Поле: Полное имя */}
          <div>
            <div className="relative">
              <input type="text" placeholder=" " value={name} onChange={(e) => { setName(e.target.value); setNameError(""); }} className={`peer w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all duration-200 bg-transparent ${nameError ? "border-red-500 text-red-500" : "border-slate-300 dark:border-[#27374d] text-slate-800 dark:text-white focus:border-blue-500"}`}/>
              <label className="pointer-events-none absolute left-3.5 -top-2.5 bg-white dark:bg-[#182232] px-1 text-xs font-medium text-slate-400 peer-focus:text-blue-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs transition-all select-none">
                {t("fullName")}
              </label>
            </div>
            {nameError && (
              <p className="mt-1.5 pl-1 text-xs text-red-500 font-medium">
                {nameError}
              </p>
            )}
          </div>

          {/* Поле: Телефон */}
          <div className="relative">
            <input type="text" placeholder=" " value={phone} onChange={(e) => setPhone(e.target.value)} className="peer w-full rounded-xl border border-slate-300 dark:border-[#27374d] bg-transparent px-4 py-3.5 text-sm text-slate-800 dark:text-white outline-none transition-all duration-200 focus:border-blue-500"/>
            <label className="pointer-events-none absolute left-3.5 -top-2.5 bg-white dark:bg-[#182232] px-1 text-xs font-medium text-slate-400 peer-focus:text-blue-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs transition-all select-none">
              {t("phoneOptional")}
            </label>
          </div>

          {/* Поле: Заметки */}
          <div className="relative">
            <textarea rows={3} placeholder=" " value={note} onChange={(e) => setNote(e.target.value)} className="peer w-full resize-none rounded-xl border border-slate-300 dark:border-[#27374d] bg-transparent px-4 py-3.5 text-sm text-slate-800 dark:text-white outline-none transition-all duration-200 focus:border-blue-500"/>
            <label className="pointer-events-none absolute left-3.5 -top-2.5 bg-white dark:bg-[#182232] px-1 text-xs font-medium text-slate-400 peer-focus:text-blue-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs transition-all select-none">
              {t("notesOptional")}
            </label>
          </div>

          {/* Кнопки */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">{t("cancel")}</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 active:translate-y-px cursor-pointer">{t("create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
