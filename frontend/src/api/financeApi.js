import axiosInstance from './axiosInstance';

export const financeApi = {
    getIncome: async () => {
        const res = await axiosInstance.get('/finance/income');
        return res.data;
    },
    addIncome: async (data) => {
        const res = await axiosInstance.post('/finance/income', data);
        return res.data;
    },
    updateIncome: async (id, data) => {
        const res = await axiosInstance.put(`/finance/income/${id}`, data);
        return res.data;
    },
    deleteIncome: async (id) => {
        const res = await axiosInstance.delete(`/finance/income/${id}`);
        return res.data;
    },

    getExpenses: async () => {
        const res = await axiosInstance.get('/finance/expenses');
        return res.data;
    },
    addExpense: async (data) => {
        const res = await axiosInstance.post('/finance/expenses', data);
        return res.data;
    },
    updateExpense: async (id, data) => {
        const res = await axiosInstance.put(`/finance/expenses/${id}`, data);
        return res.data;
    },
    deleteExpense: async (id) => {
        const res = await axiosInstance.delete(`/finance/expenses/${id}`);
        return res.data;
    },

    getSummary: async (month) => {
        const query = month ? `?month=${month}` : '';
        const res = await axiosInstance.get(`/finance/summary${query}`);
        return res.data;
    }
};
