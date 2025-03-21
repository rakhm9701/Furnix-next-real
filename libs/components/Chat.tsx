import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { notificationListVar, notificationVar, socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<Box
				component={'div'}
				flexDirection={'row'}
				style={{ display: 'flex' }}
				alignItems={'flex-end'}
				justifyContent={'flex-end'}
				sx={{ m: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</Box>
		);
	} else {
		return (
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg_left'}></div>
			</Box>
		);
	}
};

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
	timestamp: string;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/

	// useEffect(() => {
	// 	socket.onmessage = (msg) => {
	// 		const data = JSON.parse(msg.data);
	// 		console.log('WebSocket message: ', data);

	// 		switch (data.event) {
	// 			case 'info':
	// 				const newInfo: InfoPayload = data;
	// 				setOnlineUsers(newInfo.totalClients);
	// 				break;
	// 			case 'getMessages':
	// 				console.log('datasssss:', data);
	// 				const list: MessagePayload[] = data.messages;
	// 				setMessagesList(list);

	// 				break;
	// 			case 'message':
	// 				console.log('message:', data);
	// 				setMessagesList((list) => [...list, data.text]);
	// 				break;
	// 			case 'sendMessage':
	// 				console.log('datasssss:', data);

	// 				const newMessage: MessagePayload = data.messages;
	// 				messagesList.push(newMessage);
	// 				setMessagesList([...messagesList]);
	// 				break;
	// 			case 'notification':
	// 				const newNotification: any[] = data.data;
	// 				console.log('newnot', newNotification);

	// 				const currentNotificationList = notificationListVar();
	// 				notificationListVar([...currentNotificationList, ...newNotification]);
	// 				notificationVar(notificationListVar().length);
	// 				break;
	// 		}
	// 	};
	// }, [socket, messagesList]);

	useEffect(() => {
		const handleMessage = (msg: MessageEvent) => {
			const data = JSON.parse(msg.data);
			console.log('WebSocket message: ', data);

			const isWithinTimeframe = (timestamp1: string, timestamp2: string, ms: number = 100) => {
				const time1 = new Date(timestamp1).getTime();
				const time2 = new Date(timestamp2).getTime();
				return Math.abs(time1 - time2) < ms;
			};

			switch (data.event) {
				case 'info':
					setOnlineUsers(data.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.messages;
					setMessagesList(list || []); // Null/undefined check
					break;
				case 'message':
					setMessagesList((prevList) => {
						// Check if a similar message exists within 100ms timeframe
						const isDuplicate = prevList.some(
							(msg) =>
								msg.text === data.text &&
								msg.timestamp &&
								data.timestamp &&
								isWithinTimeframe(msg.timestamp, data.timestamp),
						);

						if (isDuplicate) {
							return prevList;
						}
						return [...prevList, data];
					});
					break;
				case 'sendMessage':
					setMessagesList((prevList) => {
						const isDuplicate = prevList.some(
							(msg) => msg.text === data.messages.text && isWithinTimeframe(msg.timestamp, data.messages.timestamp),
						);

						if (isDuplicate) {
							return prevList;
						}
						return [...prevList, data.messages];
					});
					break;
				case 'notification':
					const newNotification: any[] = data.data;
					const currentNotificationList = notificationListVar();
					notificationListVar([...currentNotificationList, ...newNotification]);
					notificationVar(notificationListVar().length);
					break;
			}
		};

		if (socket) {
			socket.addEventListener('message', handleMessage);
		}

		return () => {
			if (socket) {
				socket.removeEventListener('message', handleMessage);
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) sweetErrorAlert(Messages.error4);
		else if (socket) {
			socket.send(JSON.stringify({ event: 'sendMessage', data: messageInput }));
			setMessageInput('');
		}
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
					<RippleBadge style={{ margin: '-18px 0 0 21px' }} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</Box>
							{/* Null check qo'shildi */}
							{messagesList && messagesList.length > 0 ? (
								messagesList.map((ele: MessagePayload, index) => {
									if (!ele) return null; // Undefined element check

									const { text, memberData } = ele;
									const memberImage = memberData?.memberImage
										? `${REACT_APP_API_URL}/${memberData.memberImage}`
										: '/img/profile/defaultUser.svg';

									return memberData?._id === user?._id ? (
										<Box
											key={index}
											component={'div'}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											alignItems={'flex-end'}
											justifyContent={'flex-end'}
											sx={{ m: '10px 0px' }}
										>
											<div className={'msg-right'}>{text}</div>
										</Box>
									) : (
										<Box
											key={index}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											sx={{ m: '10px 0px' }}
											component={'div'}
										>
											<Avatar alt={memberData?.memberNick || 'user'} src={memberImage} />
											<div className={'msg-left'}>{text}</div>
										</Box>
									);
								})
							) : (
								<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
									<div className={'welcome'}>No messages yet</div>
								</Box>
							)}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'sendMessage'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
