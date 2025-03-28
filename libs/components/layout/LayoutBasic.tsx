import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let bgImage = '',
				desc = '';

			switch (router.pathname) {
				case '/product':
					desc = 'Home / Shop';
					bgImage = '/img/banner/products.jpg';
					break;
				case '/product/detail':
					desc = 'Home / Shop';
					bgImage = '/img/banner/products.jpg';
					break;
				case '/agent':
					desc = 'Home / Agent';
					bgImage = '/img/banner/agent.jpg';
					break;
				case '/agent/detail':
					desc = 'Home / Agent / Detail';
					bgImage = '/img/banner/agent.jpg';
					break;
				case '/mypage':
					desc = 'Home / Myprofile';
					bgImage = '/img/banner/mypage.jpg';
					break;
				case '/community':
					desc = 'Home / Blog';
					bgImage = '/img/banner/blog.png';
					break;
				case '/community/detail':
					desc = 'Home / Blog / Detail';
					bgImage = '/img/banner/blog.png';
					break;
				case '/cs':
					desc = 'Home / Cs';
					bgImage = '/img/banner/cs.jpg';
					break;
				case '/account/join':
					desc = 'Home / Signup | Login';
					bgImage = '/img/banner/blog.png';
					setAuthHeader(true);
					break;
				case '/member':
					desc = 'Home / Member';
					bgImage = '/img/banner/header1.svg';
					break;
				case '/about':
					desc = 'Home / About';
					bgImage = '/img/banner/agent.jpg';
					break;
				default:
					break;
			}

			return { desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Furnix</title>
						<meta name={'title'} content={`Furnix`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Furnix</title>
						<meta name={'title'} content={`Furnix`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center center', // Rasmni markazlashtirish
								backgroundRepeat: 'no-repeat', // Takrorlanishni oldini olish
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
