import React, { useEffect, useState } from 'react';
import { Stack, Popover, Box, PopoverOrigin } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { NotificationType, NotificationStatus, Notification } from '../../types/notification';
import { notificationListVar, notificationVar, userVar } from '../../../apollo/store';
import { useMutation, useReactiveVar, useQuery } from '@apollo/client';
import { READ_ALL_NOTIFICATION, READ_NOTIFICATION } from '../../../apollo/user/mutation';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

// MUI ikonkalarni import qilish
import NotificationsIcon from '@mui/icons-material/Notifications';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

const NotificationBell: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const user = useReactiveVar(userVar);
	const notifications = useReactiveVar(notificationVar);
	const notificationList = useReactiveVar(notificationListVar);
	const [readNotification] = useMutation(READ_NOTIFICATION);
	const [allReadNotification] = useMutation(READ_ALL_NOTIFICATION);
	const [isLoading, setIsLoading] = useState(false);

	// Notifikatsiyalarni yuklash - faqat bir so'rov ishlatamiz
	const { loading: getNotificationsLoading, refetch } = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
		skip: !user?._id,
		onCompleted: (data) => {
			if (data && data.getNotifications) {
				notificationListVar(data.getNotifications);
				notificationVar(data.getNotifications.length);
			}
		},
		onError: (error) => {
			console.error('Error fetching notifications:', error);
		},
	});

	// Komponenta yuklanganda notifikatsiyalarni yuklash
	useEffect(() => {
		if (user?._id) {
			refetch();
		}
	}, [user, refetch]);

	/** HANDLERS **/
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const readNotificationHandler = async (user: T, notificationId: string) => {
		try {
			if (!notificationId) return;
			if (!user._id) throw new Error('LOGIN FIRST');

			setIsLoading(true);

			// Mutatsiyani bajarish
			const { data } = await readNotification({
				variables: { input: notificationId },
				fetchPolicy: 'network-only',
			});

			if (data && data.notificationTargetProduct) {
				// Notifikatsiyalarni qayta yuklash
				await refetch();
				await sweetTopSmallSuccessAlert('success', 800);
			}
		} catch (err: any) {
			console.error('ERROR, readNotificationHandler', err);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setIsLoading(false);
		}
	};

	const allReadNotificationsHandler = async (user: T) => {
		try {
			if (!user._id) throw new Error('LOGIN FIRST');

			setIsLoading(true);

			// Mutatsiyani bajarish
			const { data } = await allReadNotification({
				variables: { input: user._id },
				fetchPolicy: 'network-only',
			});

			if (data && data.notificationsTargetProduct) {
				// Notifikatsiyalarni qayta yuklash
				await refetch();
				await sweetTopSmallSuccessAlert('success', 800);
			}
		} catch (err: any) {
			console.error('ERROR, allReadNotificationsHandler', err);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setIsLoading(false);
		}
	};

	const formatNotificationTime = (date: Date) => {
		try {
			return formatDistanceToNow(new Date(date), { addSuffix: true });
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Recently';
		}
	};

	// Ikonka renderini o'zgartirish - rasm o'rniga MUI ikonkalar
	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.LIKE:
				return <ThumbUpIcon fontSize="small" color="primary" />;
			case NotificationType.COMMENT:
				return <CommentIcon fontSize="small" color="primary" />;
			default:
				return <NotificationsIcon fontSize="small" color="primary" />;
		}
	};

	const anchorOrigin: PopoverOrigin = {
		vertical: 'bottom',
		horizontal: 'right',
	};

	const transformOrigin: PopoverOrigin = {
		vertical: 'top',
		horizontal: 'right',
	};

	const open = Boolean(anchorEl);

	return (
		<Stack sx={{ position: 'relative', cursor: 'pointer', marginRight: '10px' }}>
			<Stack
				className="icon-button"
				onClick={handleClick}
				style={{ position: 'relative', cursor: 'pointer', marginLeft: '10px', display: 'flex' }}
			>
				{/* Rasm o'rniga MUI ikonka ishlatish */}
				<NotificationsIcon style={{ width: 24, height: 24, color: 'white' }} />
				{notifications > 0 && (
					<Box
						sx={{
							position: 'absolute',
							top: -2,
							right: -2,
							width: 20,
							height: 20,
							borderRadius: '50%',
							backgroundColor: '#fc800a',
							color: 'white',
							fontSize: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold',
						}}
					>
						{notifications}
					</Box>
				)}
			</Stack>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				onClick={(e) => e.stopPropagation()}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
				disableScrollLock={true}
				slotProps={{
					paper: {
						sx: {
							marginTop: 1,
							width: 350,
							maxHeight: '80vh',
						},
					},
				}}
			>
				<Box sx={{ width: 350, maxHeight: 400, overflow: 'auto', p: 2 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}
					>
						<Box sx={{ fontWeight: 'bold' }}>Notifications</Box>
						{notifications > 0 && (
							<Box
								onClick={() => !isLoading && allReadNotificationsHandler(user)}
								sx={{
									color: '#fc800a',
									cursor: isLoading ? 'default' : 'pointer',
									fontSize: '14px',
									opacity: isLoading ? 0.7 : 1,
								}}
							>
								{isLoading ? 'Processing...' : 'Mark all as read'}
							</Box>
						)}
					</Box>

					{getNotificationsLoading || isLoading ? (
						<Box sx={{ textAlign: 'center', color: 'gray' }}>Loading...</Box>
					) : notificationList.length === 0 ? (
						<Box sx={{ textAlign: 'center', color: 'gray' }}>No notifications</Box>
					) : (
						notificationList.map((notification: Notification) => (
							<Box
								key={notification._id}
								sx={{
									display: 'flex',
									alignItems: 'flex-start',
									p: 1,
									mb: 1,
									borderRadius: 1,
									backgroundColor:
										notification.notificationStatus === NotificationStatus.READ ? '#f5f5f5' : 'transparent',
									'&:hover': { backgroundColor: '#f5f5f5' },
								}}
							>
								{/* Rasm o'rniga MUI ikonka renderini ishlatish */}
								<Box sx={{ mr: 1.5 }}>{getNotificationIcon(notification.notificationType)}</Box>
								<Box sx={{ flex: 1 }}>
									<Box sx={{ fontSize: '14px' }}>{notification.notificationDesc}</Box>
									<Box sx={{ fontSize: '12px', color: 'gray' }}>{formatNotificationTime(notification.createdAt)}</Box>
								</Box>
								<Box
									onClick={() => !isLoading && readNotificationHandler(user, notification._id)}
									sx={{
										color: '#fc800a',
										cursor: isLoading ? 'default' : 'pointer',
										fontSize: '14px',
										opacity: isLoading ? 0.7 : 1,
									}}
								>
									{isLoading ? '...' : 'Read'}
								</Box>
							</Box>
						))
					)}
				</Box>
			</Popover>
		</Stack>
	);
};

export default NotificationBell;
