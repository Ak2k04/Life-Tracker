import axiosInstance from './axiosInstance';

export const authApi = {
    register: async (data) => {
        const res = await axiosInstance.post('/auth/register', data);
        return res.data;
    },
    login: async (data) => {
        const res = await axiosInstance.post('/auth/login', data);
        return res.data;
    },
    forgotPassword: async (data) => {
        const res = await axiosInstance.post('/auth/forgot-password', data);
        return res.data;
    },
    verifyOtp: async (data) => {
        const res = await axiosInstance.post('/auth/verify-otp', data);
        return res.data;
    },
    validateResetLink: async (token, uid) => {
        const res = await axiosInstance.get(`/auth/reset-password/validate?token=${token}&uid=${uid}`);
        return res.data;
    },
    resetPassword: async (data) => {
        const res = await axiosInstance.post('/auth/reset-password', data);
        return res.data;
    },
};
