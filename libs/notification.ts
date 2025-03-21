import axios from 'axios';
import { NotificationGroup, NotificationResponse } from './types/notification';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get all notifications with pagination
export const getAllNotifications = async (page: number = 1, limit: number = 10) => {
  const response = await axios.get<NotificationResponse>(
    `${API_URL}/notifications?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async () => {
  const response = await axios.get<NotificationResponse>(
    `${API_URL}/notifications/unread`
  );
  return response.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const response = await axios.get<{ count: number }>(
    `${API_URL}/notifications/unread/count`
  );
  return response.data;
};

// Get notifications by group
export const getNotificationsByGroup = async (
  group: NotificationGroup,
  page: number = 1,
  limit: number = 10
) => {
  const response = await axios.get<NotificationResponse>(
    `${API_URL}/notifications/group/${group}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Mark single notification as read
export const markAsRead = async (notificationId: string) => {
  const response = await axios.put(
    `${API_URL}/notifications/${notificationId}/read`
  );
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await axios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
  return response.data;
};

// API endpoints as a single object
export const notificationApi = {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadCount,
  getNotificationsByGroup,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};