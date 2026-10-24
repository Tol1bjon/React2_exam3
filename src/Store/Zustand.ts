import { axiosRequest } from "@/lib/Tokens";
import { create } from "zustand";

export const useUser = create((set) => ({
    user: null,

    getMe: async() => {
        try {
            const { data } = await axiosRequest.get('/api/users/me')
            const userPayments = JSON.parse(localStorage.getItem(`payments_${data?.id}`) || '[]');
            set({ user: data, payments: userPayments })
        } catch (error) {
            console.log(error)
        }
    },

    updateUser: async(update: any) => {
        try {
            const { data } = await axiosRequest.patch('/api/users/me', update)
            set({ user: data })
        } catch (error) {
            console.log(error)
        }
    },


    // Contacts
    contacts: [],

    getContacts: async() => {
        try {
            const { data } = await axiosRequest.get('/api/contacts')
            set({ contacts: data })
        } catch (error) {
            console.log(error)
        }
    },

    addContact: async(newContact: any) => {
        try {
            const { data } = await axiosRequest.post('/api/contacts', newContact)
            set((state: any) => ({ contacts: [...state.contacts, data] }))
            return data;
        } catch (error) {
            console.log(error)
        }
    },

    deleteContact: async(id: any) => {
        try {
            await axiosRequest.delete(`/api/contacts/${id}`)
            set((state: any) => ({ contacts: state.contacts.filter((user: any) => user.id != id) }))
        } catch (error) {
            console.log(error)
        }
    },

    editContact: async(id: any, updateUser: any) => {
        try {
            const { data } = await axiosRequest.patch(`/api/contacts/${id}`, updateUser)
            set((state: any) => ({ contacts: state.contacts.map((user: any) => user.id == id ? data : user)}))
        } catch (error) {
            console.log(error)
        }
    },


    // Debts
    debts: [],

    getDebts: async() => {
        try {
            const { data } = await axiosRequest.get('/api/debts')
            set({ debts: data })
        } catch (error) {
            console.log(error)
        }
    },

    addDebts: async(newDebts: any) => {
        try {
            const { data } = await axiosRequest.post('/api/debts', newDebts)
            set((state: any) => ({ debts: [...state.debts, data] }))
            return data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    closeDebt: async(id: any) => {
        try {
            await axiosRequest.patch(`/api/debts/${id}`, { status: 'paid' })
            set((state: any) => ({ debts: state.debts.filter((user: any) => user.id != id) }))
        } catch (error) {
            console.log(error)
        }
    },

    editDebt: async(id: any, updateUser: any) => {
        try {
            const { data } = await axiosRequest.patch(`/api/debts/${id}`, updateUser)
            set((state: any) => ({ debts: state.debts.map((user: any) => user.id == id ? data : user)}))
        } catch (error) {
            console.log(error)
        }
    },

    reopenDebt: async(id: any) => {
        try {
            const { data } = await axiosRequest.patch(`/api/debts/${id}`, { status: 'pending' })
            set((state: any) => ({
                debts: state.debts.map((item: any) => item.id == id ? { ...item, status: 'pending' } : item)
            }))
            return data;
        } catch (error) {
            console.log(error)
        }
    },


    // Payment
    payments: [],
    
    addPayment: async(debtId: any, paymentData: any, contactName?: string, direction?: string) => {
        try {
            const { data } = await axiosRequest.post(`/api/debts/${debtId}/payments`, paymentData);
            set((state: any) => {
                const userId = state.user?.id || 'guest';
                const newPaymentItem = {
                    ...(data || {}),
                    id: data?.id || String(Date.now()),
                    amount: paymentData.amount,
                    note: paymentData.note,
                    contact_name: contactName || 'Контакт',
                    direction: direction || 'they_owe_me',
                    created_at: data?.created_at || new Date().toISOString()
                };
                const updatedPayments = [newPaymentItem, ...state.payments];
                localStorage.setItem(`payments_${userId}`, JSON.stringify(updatedPayments));

                // Обновляем долг и его прогресс оплаты
                const updatedDebts = state.debts.map((d: any) => {
                    if (d.id === debtId) {
                        const prevPaid = Number(d.paid_amount || d.paidAmount || 0);
                        const newPaid = prevPaid + Number(paymentData.amount || 0);
                        const total = Number(d.amount) || 0;
                        const isClosed = newPaid >= total;
                        return {
                            ...d,
                            paid_amount: newPaid,
                            status: isClosed ? 'paid' : 'partial'
                        };
                    }
                    return d;
                });
                return { payments: updatedPayments, debts: updatedDebts };
            });
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}));