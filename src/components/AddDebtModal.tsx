import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  Calculator,
  Calendar,
  ChevronDown,
  Plus,
  ImagePlus,
  RotateCw,
  X,
} from "lucide-react";
import { useUser } from "@/Store/Zustand";
import { useTranslation } from "react-i18next";

const AddDebtModal = ({ isOpen, onClose, initialType = "owe", edit = null }: any) => {
  const { t } = useTranslation();
  const addDebts = useUser((state: any) => state.addDebts);
  const contacts = useUser((state: any) => state.contacts);
  const getContacts = useUser((state: any) => state.getContacts);
  const addContact = useUser((state: any) => state.addContact);
  const getDebts = useUser((state: any) => state.getDebts);
  const editDebt = useUser((state: any) => state.editDebt);
  const debts = useUser((state: any) => state.debts);
  const addPayment = useUser((state: any) => state.addPayment);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"owe" | "lent">(initialType);

  useEffect(() => {
    if (edit) {
      const contactName =
        edit.name ||
        edit.contact?.name ||
        edit.contact_name ||
        contacts?.find((c: any) => c.id === edit.contact_id)?.name ||
        "";
      setName(contactName);
      setAmount(edit.amount ? String(edit.amount) : "");
      setDueDate(edit.due_date || edit.dueDate || "");
      setDescription(edit.description || "");
      setType(edit.direction === "i_owe_them" || edit.type === "owe" ? "owe" : "lent");
    } else {
      setName("");
      setAmount("");
      setDueDate("");
      setDescription("");
      setType(initialType || "owe");
    }
  }, [edit, isOpen]);

  useEffect(() => {
    if (initialType) {
      setType(initialType);
    }
  }, [initialType, isOpen]);

  useEffect(() => {
    if (getContacts) getContacts();
  }, [isOpen]);

  if (!isOpen) return null;

  // Поиск существующего активного долга по имени контакта
  const existingDebt =
    !edit && name.trim()
      ? debts?.find((d: any) => {
          if (d.status === "paid" || d.status === "closed") return false;
          const contactName =
            d.name ||
            d.contact?.name ||
            d.contact_name ||
            contacts?.find((c: any) => c.id === d.contact_id)?.name ||
            "";
          return contactName.toLowerCase().trim() === name.toLowerCase().trim();
        })
      : null;

  const isExistingOwe =
    existingDebt &&
    (existingDebt.direction === "i_owe_them" || existingDebt.type === "owe");
  const totalDebt = Number(existingDebt?.amount) || 0;
  const paidDebt = Number(existingDebt?.paid_amount || existingDebt?.paidAmount || 0);
  const currentRemaining = Math.max(0, totalDebt - paidDebt);
  const payAmount = Number(amount) || 0;
  const newRemaining = Math.max(0, currentRemaining - payAmount);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name.trim() || !amount) {
      alert("Заполните имя и сумму!");
      return;
    }

    try {
      // Если это платеж по существующему долгу
      if (existingDebt && addPayment) {
        await addPayment(
          existingDebt.id,
          { amount: Number(amount), note: description },
          name,
          existingDebt.direction
        );
        if (getDebts) await getDebts();
        setName("");
        setAmount("");
        setDescription("");
        onClose();
        return;
      }

      // 1. Ищем существующий контакт по имени
      let targetContact = contacts?.find(
        (c: any) => c.name?.toLowerCase().trim() === name.trim().toLowerCase()
      );

      // 2. Если такого контакта еще нет — создаем его в базе
      if (!targetContact && addContact) {
        targetContact = await addContact({ name: name.trim(), phone: "", note: "" });
      }

      const contactId = targetContact?.id;

      if (!contactId) {
        alert("Не удалось определить контакт. Попробуйте еще раз.");
        return;
      }

      // 3. Отправляем долг с реальным UUID контакта
      const payload: any = {
        contact_id: contactId,
        amount: Number(amount),
        direction: type === "owe" ? "i_owe_them" : "they_owe_me",
      };

      if (dueDate) payload.dueDate = dueDate;
      if (description) payload.description = description;

      if (edit) {
        if (dueDate) payload.due_date = dueDate;
        await editDebt(edit.id, payload);
      } else {
        await addDebts(payload);
      }

      if (getDebts) await getDebts();

      setName("");
      setAmount("");
      setDueDate("");
      setDescription("");
      onClose();
    } catch (error: any) {
      console.error("Ошибка добавления долга:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Произошла ошибка при сохранении";
      alert(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-[#223247] bg-white dark:bg-[#15202b] p-4 sm:p-7 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
            <CircleDollarSign className="size-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {edit ? t("editDebt") : t("addDebt")}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 flex flex-col gap-3.5 sm:gap-4">
          {/* Поле Имя */}
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("personName")} *
            </label>
            <div className="relative">
              <input
                type="text"
                list="contacts-datalist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enterPersonName")}
                className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
              />
              {name && (
                <button
                  type="button"
                  onClick={() => setName("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <datalist id="contacts-datalist">
              {contacts?.map((c: any) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          {/* Баннер оплаты существующего долга */}
          {existingDebt && (
            <div className="rounded-2xl border border-red-200/80 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 p-3.5 sm:p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <RotateCw className="size-4 shrink-0" />
                <span>{t("paymentOnExistingDebt")}</span>
              </div>

              <div className="rounded-xl border border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 sm:p-3.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isExistingOwe ? t("youOweThem") : t("theyOweYou")}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {isExistingOwe ? "-" : "+"}
                    {currentRemaining.toLocaleString("ru-RU")}
                  </span>
                </div>

                {payAmount > 0 ? (
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t("newTotal")}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {isExistingOwe ? "-" : "+"}
                      {newRemaining.toLocaleString("ru-RU")}
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      -{payAmount.toLocaleString("ru-RU")}
                    </span>
                  </div>
                ) : (
                  <RotateCw className="size-4 text-slate-400" />
                )}
              </div>
            </div>
          )}

          {/* Если это платеж по существующему долгу — показываем только Amount и Note */}
          {existingDebt ? (
            <>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("amount")} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t("enterAmount")}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                  />
                  <Calculator className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("note")}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("enterNoteOptional")}
                  className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* Стандартные поля создания нового долга */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("amount")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={t("enterAmount")}
                      className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                    />
                    <Calculator className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("type")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex h-[42px] sm:h-[46px] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setType("owe")}
                      className={`flex-1 border text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-l-xl ${
                        type === "owe"
                          ? "bg-red-600 dark:bg-[#c5221f] text-white border-red-600 dark:border-[#c5221f]"
                          : "bg-transparent text-red-500 dark:text-red-400 border-red-300 dark:border-red-900/60"
                      }`}
                    >
                      {t("iOwe")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("lent")}
                      className={`flex-1 border text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-r-xl border-l-0 ${
                        type === "lent"
                          ? "bg-emerald-600 dark:bg-[#059669] text-white border-emerald-600 dark:border-[#059669]"
                          : "bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/60"
                      }`}
                    >
                      {t("owesMe")}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("folder")}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span>{t("none")}</span>
                    <ChevronDown className="size-4 text-slate-400" />
                  </div>
                  <button
                    type="button"
                    className="flex size-10 shrink-0 items-center justify-center text-blue-500 hover:text-blue-400 cursor-pointer"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("dueDateLabel")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder={t("selectDueDateOptional")}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                  />
                  <Calendar className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("description")}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("enterDescription")}
                  className="w-full rounded-xl border border-slate-200 dark:border-[#26354a] bg-white dark:bg-[#111923] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("photo")}
                </label>
                <div className="flex h-16 sm:h-20 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-[#26354a] bg-transparent text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600">
                  <ImagePlus className="size-4 sm:size-5" />
                  <span>{t("addPhoto")}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-2 flex items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs sm:text-sm font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 cursor-pointer"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;
