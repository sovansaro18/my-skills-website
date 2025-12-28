// Abstracted notification API calls
import axios from 'axios';

const API_URL = '/api/notifications';

export const getNotifications = async (token: string) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

export const markAllAsRead = async (token: string) => {
  return axios.put(`${API_URL}/mark-all-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const markAsRead = async (id: string, token: string) => {
  return axios.put(`${API_URL}/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const createNotification = async (data: any, token: string) => {
  return axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
};
