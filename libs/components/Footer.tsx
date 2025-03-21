import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/Logo-white.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Product for Rent</span>
								<span>Product Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Furnix - All rights reserved. Furnix {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/Logo-white.svg" alt="" className={'logo'} />
							<span>✔️ Premium furniture for your home!</span>
							<span>✔️ Style, Comfort & Durability!</span>
							<span>✔️ Best prices, best furniture!</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<Box className={'phone'}>
								<img src="/img/icons/call.svg" alt="" />
								<p>+82 10 8423 4884</p>
							</Box>
						</Box>
						<Box className={'footer-box'}>
							<Box className={'phone'}>
								<img src="/img/icons/gmail.svg" alt="" />
								<p>furnix@gmail.com</p>
							</Box>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<Box className={'phone'}>
								<img src="/img/icons/location-dot.svg" alt="" />
								<p>350 5th Avenue, New York, NY 10118</p>
							</Box>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>STAY IN TOUCH</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
								<WhatsAppIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Get 5% off your first order!</strong>
							<span>SignIn and get discount for your first order! Also recieve updates, and more</span>
							<div>
								<input type="text" placeholder={'Set Up Your Profile in Seconds'} />
								<span>Subscribe</span>
								<img src="img/icons/arrow.svg" alt="" style={{ marginLeft: '10px' }} />
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>About Us</strong>
								<span>About Us</span>
								<span>Blog</span>
								<span>Contact Us</span>
								<span>Popular Question</span>
							</div>
							<div>
								<strong>Popular Search</strong>
								<span>King Size Beds</span>
								<span>Dining Tables</span>
								<span>Boucle Chairs</span>
								<span>L Shaped Couch</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<Box className={'left'}>
						<span>© Furnix - All rights reserved. Furnix {moment().year()}</span>
						<span>Privacy · Terms · Sitemap</span>
					</Box>
					<Box className={'right'}>
						<img src="/img/icons/cards/googlepay.svg" alt="" />
						<img src="/img/icons/cards/applepay.svg" alt="" />
						<img src="/img/icons/cards/klarna.svg" alt="" />
						<img src="/img/icons/cards/amex.svg" alt="" />
						<img src="/img/icons/cards/paypal.svg" alt="" />
						<img src="/img/icons/cards/visa.svg" alt="" />
						<img src="/img/icons/cards/opay.svg" alt="" />
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
