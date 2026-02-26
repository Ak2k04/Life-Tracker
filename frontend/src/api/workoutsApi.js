import axiosInstance from './axiosInstance';

export const workoutsApi = {
    getWorkouts: async (limit = 20, offset = 0) => {
        const res = await axiosInstance.get(`/workouts?limit=${limit}&offset=${offset}`);
        return res.data;
    },
    logWorkout: async (data) => {
        const res = await axiosInstance.post('/workouts', data);
        return res.data;
    },
    updateWorkout: async (id, data) => {
        const res = await axiosInstance.put(`/workouts/${id}`, data);
        return res.data;
    },
    deleteWorkout: async (id) => {
        const res = await axiosInstance.delete(`/workouts/${id}`);
        return res.data;
    },
    getAnalytics: async () => {
        const res = await axiosInstance.get('/workouts/analytics');
        return res.data;
    }
};
