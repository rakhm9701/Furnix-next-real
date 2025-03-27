// types/notification/index.ts

import { BoardArticle } from '../board-article/board-article';
import { Member } from '../member/member';
import { Product } from '../product/product';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	MENTION = 'MENTION',
}

export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationGroup {
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	MEMBER = 'MEMBER',
}

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc: string; // This is the field that TypeScript says doesn't exist
	authorId: string | Member;
	receiverId: string | Member;
	productId?: string | Product;
	articleId?: string | BoardArticle;
	createdAt: Date;
	updatedAt: Date;
}
export interface Notification {
	_id: string;

	notificationType: NotificationType;

	notificationTitle: string; // Add this line

	notificationDesc: string;

	notificationStatus: NotificationStatus;

	createdAt: Date;
}

export interface NotificationResponse {
	notifications: Notification[];
	total: number;
}

export interface NotificationCount {
	count: number;
}

// Request payload types
export interface MarkAsReadPayload {
	notificationId: string;
}

export interface GetNotificationsByGroupPayload {
	group: NotificationGroup;
	page?: number;
	limit?: number;
}
