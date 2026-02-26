import axiosInstance from './axiosInstance';

export const habitsApi = {
    getHabits: async () => {
        const res = await axiosInstance.get('/habits');
        return res.data;
    },
    createHabit: async (data) => {
        const res = await axiosInstance.post('/habits', data);
        return res.data;
    },
    updateHabit: async (id, data) => {
        const res = await axiosInstance.put(`/habits/${id}`, data);
        return res.data;
    },
    deleteHabit: async (id) => {
        const res = await axiosInstance.delete(`/habits/${id}`);
        return res.data;
    },
    getCompletions: async (month) => {
        const res = await axiosInstance.get(`/habits/completions?month=${month}`);
        return res.data;
    },
    toggleCompletion: async (id, date) => {
        const res = await axiosInstance.post(`/habits/${id}/toggle`, { date });
        return res.data;
    },
    getAnalytics: async (range = 'monthly') => {
        const res = await axiosInstance.get(`/habits/analytics?range=${range}`);
        return res.data;
    }
};
