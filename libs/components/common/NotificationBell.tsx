import React, { useState } from 'react';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useReactiveVar } from '@apollo/client';
import { notificationListVar, notificationVar } from '../../../apollo/store';

const NotificationBell = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const notification = useReactiveVar(notificationVar);
	const notificationList = useReactiveVar(notificationListVar);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'notification-popover' : undefined;

	// Xabarnomalar soni
	const notificationCount = notification ? notification : 0;

	return (
		<>
			<IconButton
				aria-describedby={id}
				onClick={handleClick}
				sx={{
					color: 'white',
					marginLeft: '10px',
					marginRight: '10px',
				}}
			>
				<Badge badgeContent={notificationCount} color="error">
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<List sx={{ width: '300px', maxHeight: '400px', overflow: 'auto', p: 0 }}>
					{notificationList && notificationList.length > 0 ? (
						notificationList.map((item, index) => (
							<ListItem key={index} divider>
								<ListItemText primary={item.title} secondary={item.message} />
							</ListItem>
						))
					) : (
						<ListItem>
							<ListItemText primary="No notifications" />
						</ListItem>
					)}
				</List>
			</Popover>
		</>
	);
};

export default NotificationBell;
