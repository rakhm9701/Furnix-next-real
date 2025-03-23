import React, { useEffect, useState } from 'react';
import { Stack, Popover, Box, PopoverOrigin } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { NotificationType, NotificationStatus, Notification } from '../../types/notification';
import { notificationListVar, notificationVar, userVar } from '../../../apollo/store';
import { useMutation, useReactiveVar, useQuery } from '@apollo/client';
import { READ_ALL_NOTIFICATION, READ_NOTIFICATION } from '../../../apollo/user/mutation';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query'; // Bu qo'shilishi kerak
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

	// Notifikatsiyalarni yuklash
	const { loading, refetch } = useQuery(GET_NOTIFICATIONS, {
		skip: !user?._id, // Foydalanuvchi bo'lmasa o'tkazib yuborish
		onCompleted: (data) => {
			if (data?.getNotifications) {
				notificationListVar(data.getNotifications);
				notificationVar(data.getNotifications.length);
			}
		},
	});

	// Komponenta yuklanganda notifikatsiyalarni yuklash
	useEffect(() => {
		if (user?._id) {
			refetch();
		}
	}, [user, refetch]);

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

			// Serverga so'rov yuborish
			const { data } = await readNotification({
				variables: { input: notificationId },
				fetchPolicy: 'network-only',
			});

			if (data && data.notificationTargetProduct) {
				// Filter bilan yangi massiv yaratish
				const updatedList = notificationList.filter((item) => item._id !== notificationId);

				// ReactiveVar'larni yangilash (await ishlatmasdan)
				notificationListVar(updatedList);
				notificationVar(updatedList.length);

				await sweetTopSmallSuccessAlert('success', 800);
			}
		} catch (err: any) {
			console.log('ERROR, readNotificationHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const allReadNotificationsHandler = async (user: T) => {
		try {
			if (!user._id) throw new Error('LOGIN FIRST');

			// user._id ni ishlatish
			const { data } = await allReadNotification({
				variables: { input: user._id },
				fetchPolicy: 'network-only',
			});

			if (data && data.notificationsTargetProduct) {
				// ReactiveVar'larni yangilash (await ishlatmasdan)
				notificationListVar([]);
				notificationVar(0);

				await sweetTopSmallSuccessAlert('success', 800);
			}
		} catch (err: any) {
			console.log('ERROR, allReadNotificationsHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
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
								onClick={() => allReadNotificationsHandler(user)}
								sx={{
									color: '#fc800a',
									cursor: 'pointer',
									fontSize: '14px',
								}}
							>
								Mark all as read
							</Box>
						)}
					</Box>

					{loading ? (
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
									onClick={() => readNotificationHandler(user, notification._id)}
									sx={{
										color: '#fc800a',
										cursor: 'pointer',
										fontSize: '14px',
									}}
								>
									Read
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
