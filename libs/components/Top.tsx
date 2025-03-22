import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar, notificationListVar, notificationVar } from '../../apollo/store';
import { logOut } from '../auth';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../sweetAlert';
import { Messages } from '../config';
import NotificationBell from './common/NotificationBell';
import { useCart } from '../context/useCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const { state: cartState } = useCart();
	const notification = useReactiveVar(notificationVar);
	const notificationList = useReactiveVar(notificationListVar);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};
	const handleCartClick = () => {
		router.push('/product/cart');
	};
	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleLogoutRequest = async () => {
		try {
			await logOut();

			await sweetTopSmallSuccessAlert('Success', 700);
		} catch (err) {
			console.log(err);
			sweetErrorHandling(Messages.error1);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/product'}>
					<div>{t('Products')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/Logo-white.svg" alt="" />
							</Link>
						</Box>

						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/product'}>
								<div>{t('Products')}</div>
							</Link>
							<Link href={'/agent'}>
								<div> {t('Agents')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div> {t('Community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div> {t('CS')} </div>
							</Link>
							<Link href={'/about'}>
								<div> {t('About')} </div>
							</Link>
						</Box>

						<div className="user-actions">
							<Button
								className="icon-button"
								id="basic-button"
								aria-controls={open ? 'basic-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
								onClick={handleClick}
							>
								{/* Rasm o'rniga MUI ikonka ishlatamiz */}
								<AccountCircleIcon style={{ width: 25, height: 25, color: 'white' }} />
							</Button>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									'aria-labelledby': 'basic-button',
								}}
							>
								{/* Fragment o'rniga massiv ishlatamiz */}
								{!user._id
									? [
											<MenuItem
												key="login"
												onClick={() => {
													handleClose();
												}}
											>
												<Link href={'/account/join'}>Login</Link>
											</MenuItem>,
											<MenuItem
												key="signup"
												onClick={() => {
													handleClose();
												}}
											>
												<Link href={'/account/join'}>Sign Up</Link>
											</MenuItem>,
									  ]
									: null}
								{user._id ? (
									<MenuItem
										key="logout"
										onClick={() => {
											handleLogoutRequest();
											handleClose();
										}}
									>
										Logout
									</MenuItem>
								) : null}
							</Menu>
							{user._id && <NotificationBell />}
							<Stack
								className="icon-button"
								onClick={handleCartClick}
								style={{ position: 'relative', cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }}
							>
								{/* SVG o'rniga MUI ikonka ishlatamiz */}
								<ShoppingCartIcon style={{ width: 24, height: 24, color: 'white' }} />
								{cartState.itemCount > 0 && (
									<div
										className="cart-alert"
										style={{
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
										{cartState.itemCount}
									</div>
								)}
							</Stack>
							<Button
								disableRipple
								className="btn-lang"
								onClick={langClick}
								endIcon={<CaretDown size={14} color="#FFFFFF" weight="fill" />}
							>
								<Box component={'div'} className={'flag'}>
									{/* Biz bu yerda local rasmni ishlatamiz, lekin amalda uni o'zingiz yuklashingiz kerak */}
									<div
										style={{
											width: 24,
											height: 16,
											backgroundColor: 'white',
											borderRadius: 2,
											fontSize: 12,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										{lang || 'EN'}
									</div>
								</Box>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
								<MenuItem disableRipple onClick={langChoice} id="en">
									<div
										className="img-flag"
										style={{
											width: 20,
											height: 14,
											backgroundColor: '#f5f5f5',
											marginRight: 10,
											fontSize: 10,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										EN
									</div>
									{t('English')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="kr">
									<div
										className="img-flag"
										style={{
											width: 20,
											height: 14,
											backgroundColor: '#f5f5f5',
											marginRight: 10,
											fontSize: 10,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										KR
									</div>
									{t('Korean')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="ru">
									<div
										className="img-flag"
										style={{
											width: 20,
											height: 14,
											backgroundColor: '#f5f5f5',
											marginRight: 10,
											fontSize: 10,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										RU
									</div>
									{t('Russian')}
								</MenuItem>
							</StyledMenu>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
