import { useEffect, useState } from "react";
import { Plus, MoreVertical, HandCoins, SquarePen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/Store/Zustand";
import AddContact from "@/components/AddContact";
import EditContact from "@/components/EditContact";
import DeleteContact from "@/components/DeleteContact";

const Contacts = () => {
  const { t } = useTranslation();
  const { contacts, getContacts } = useUser((state: any) => state);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getContacts();
  }, []);

  const filteredContacts =
    contacts?.filter(
      (user: any) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="pt-2">
      {/* Верхняя панель */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("contactsTitle")}
        </h1>

        <button type="button" onClick={() => setIsAddOpen(true)} className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:translate-y-px cursor-pointer">
          <Plus className="size-4" />
          <span>{t("addContact")}</span>
        </button>
      </div>

      {/* Карточка таблицы */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#101824] p-3.5 sm:p-5 shadow-xs">
        {/* Инпут поиска */}
        <div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchContacts")} className="w-full rounded-xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0b131f]/60 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500"/>
        </div>

        {/* Обертка таблицы для мобильных */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <div className="min-w-[580px]">
            {/* Шапка таблицы */}
            <div className="mt-5 grid grid-cols-12 rounded-xl border border-slate-200/60 dark:border-[#1e293b] bg-slate-100/70 dark:bg-[#0b131f] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <div className="col-span-3 border-r border-slate-200 dark:border-[#1e293b] pr-3">
                {t("fullName")}
              </div>
              <div className="col-span-2 border-r border-slate-200 dark:border-[#1e293b] px-3">
                {t("phone")}
              </div>
              <div className="col-span-3 border-r border-slate-200 dark:border-[#1e293b] px-3">
                {t("netTotal")}
              </div>
              <div className="col-span-3 border-r border-slate-200 dark:border-[#1e293b] px-3">
                {t("notes")}
              </div>
              <div className="col-span-1 pl-3 text-right">{t("actions")}</div>
            </div>

            {/* Список контактов */}
            {filteredContacts.length === 0 ? (
              <div className="py-20 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                {t("noContactsFound")}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#1e293b]">
                {filteredContacts.map((contact: any) => (
                  <div key={contact.id} className="grid grid-cols-12 items-center px-4 py-4 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <div className="col-span-3 pr-3 font-medium text-slate-800 dark:text-slate-200">
                      {contact.name}
                    </div>
                    <div className="col-span-2 px-3 text-slate-500 dark:text-slate-400">
                      {contact.phone || "-"}
                    </div>
                    <div className="col-span-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {contact.netTotal || "0 TJS"}
                    </div>
                    <div className="col-span-3 px-3 text-slate-500 dark:text-slate-400 truncate">
                      {contact.note || "-"}
                    </div>
                    <div className="col-span-1 pl-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer">
                          <MoreVertical className="size-4 ml-auto" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-2xl border border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#16202e] p-1.5 shadow-xl">
                          <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                            <HandCoins className="size-4 text-slate-600 dark:text-slate-300" />
                            <span>{t("addDebt")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingContact(contact)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                            <SquarePen className="size-4 text-slate-600 dark:text-slate-300" />
                            <span>{t("edit")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(contact.id)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30">
                            <Trash2 className="size-4 text-red-500" />
                            <span>{t("delete")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалки операций */}
      <AddContact isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditContact contact={editingContact} onClose={() => setEditingContact(null)}/>
      <DeleteContact id={deleteId} onClose={() => setDeleteId(null)}/>
    </div>
  );
};

export default Contacts;
