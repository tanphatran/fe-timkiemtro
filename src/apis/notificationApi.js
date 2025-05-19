// src/apis/notificationApi.js
import axiosClient from './axiosClient';

// src/apis/notificationApi.js
const notificationApi = {
    getNotifications: (page = 0, size = 10) => {
        return axiosClient.get('/notifications', { params: { page, size } });
    },

    markAsRead: (notificationId) => {
        return axiosClient.post(`/notifications/${notificationId}/read`);
    },

    markAllAsRead: () => {
        return axiosClient.post('/notifications/mark-all-read');
    }
};

export default notificationApi;