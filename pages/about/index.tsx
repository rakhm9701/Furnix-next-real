import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				<Stack className={'intro'}>
					<Stack className={'left'}>
						<span>
							Our mission is to create timeless, versatile, and minimalist furniture that seamlessly complements any
							space
						</span>
						<img src="/img/fiber/about2.png" alt="" />
					</Stack>
					<Stack className={'right'}>
						<span>
							Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad minim
							veniam, quis nostrud exercitation ullamco laboris s
						</span>
						<img src="/img/fiber/about1.png" alt="" />
					</Stack>
				</Stack>
				<Stack className={'shape'}>
					<Stack className={'headline'}>Shaping the Future</Stack>
					<Stack className={'box-wrap'}>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_box.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Premium Materials</h3>
								<span>
									High-quality materials like solid wood, genuine leather, and durable upholstery for long-lasting
									furniture
								</span>
							</Box>
						</Stack>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_custom.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Customizable Finishes</h3>
								<span>
									Extensive variety of finishes, stains, and colors for seamless furniture-to-decor coordination
								</span>
							</Box>
						</Stack>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_resistant.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Texture and Comfort</h3>
								<span>
									Highlight the texture, comfort, and tactile qualities of materials, especially for upholstery espe
								</span>
							</Box>
						</Stack>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_safety.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Safety Standards</h3>
								<span>
									Highlight compliance with safety standards, especially for child-related products or specific safety
									concerns
								</span>
							</Box>
						</Stack>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_allergic.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Low Allergenic</h3>
								<span>
									Note if materials are hypoallergenic, promoting a healthier environment for those with allergies
								</span>
							</Box>
						</Stack>
						<Stack className={'box'}>
							<Box className={'left'}>
								<img src="/img/icons/Icon_box.svg" alt="" />
							</Box>
							<Box className={'right'}>
								<h3>Delivery and Assembly</h3>
								<span>
									Provide convenient delivery and assembly options to ensure a hassle-free experience for customers
								</span>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'picture'}>
					<Box className={'img-box'} components="div">
						<img src="/img/product/glass-lamp.jpg" alt="" />
					</Box>
					<Box className={'img-box'} components="div">
						<img src="/img/product/dresser.jpg" alt="" />
					</Box>
					<Box className={'img-box'} components="div">
						<img src="/img/product/lamp.jpg" alt="" />
					</Box>
					<Box className={'img-box'} components="div">
						<img src="/img/product/pillow2.jpg" alt="" />
					</Box>
				</Stack>
				<Stack className={'consumer'}>
					<Box className={'headline'}>A Growing Customer Community</Box>
					<Stack className={'number'}>
						<Stack className={'top'}>
							<Box className={'box'}>biggest</Box>
							<Box className={'box'}>20 000</Box>
							<Box className={'box'}>1.8 Million</Box>
						</Stack>
						<Stack className={'divider-box'}>
							<Box className={'divider'}></Box>
							<Box className={'divider'}></Box>
							<Box className={'divider'}></Box>
						</Stack>
						<Stack className={'butt'}>
							<Box className={'text'}>One of the biggest players in the home retail industry</Box>
							<Box className={'text'}>Offering products for all your home requirements</Box>
							<Box className={'text'}>Continuously growing with an ever-expanding customer base</Box>
						</Stack>
					</Stack>
					<Stack className={'img'}>
						<img src="/img/fiber/about3.jpg" alt="" />
					</Stack>
				</Stack>
				<Stack className={'fabric'}>
					<Stack className={'left'}>
						<Box className={'headline'}> 120+ Fabric for Your Custom Furniture</Box>
						<Box className={'text'} components="div">
							<strong>Get Free Swatches</strong>
							<span>
								Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad
								minim veniam, quis nostrud exercitation ullamco laboris
							</span>
						</Box>
						<Box className={'input'} components="div">
							<input type="text" placeholder="Text here..." style={{ padding: '30px' }}></input>

							<Link href={'/account/join'}>
								<button>Subscribe</button>
							</Link>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<img src="/img/fiber/about4.jpg" alt="" />
					</Stack>
				</Stack>
				<Stack className={'store'}>
					<Box className={'headline'}>Visit Our Store</Box>
					<Stack className={'main-box'}>
						<Box className={'card'}>
							<img src="/img/fiber/about5.jpg" alt="" />
							<Box className={'text'}>
								<strong>Furnix House NY</strong>
								<span>21 Country Route 3/6, New York, wv, 26101</span>
							</Box>
						</Box>
						<Box className={'card'}>
							<img src="/img/fiber/about6.jpg" alt="" />
							<Box className={'text'}>
								<strong>Furnix house Baltimore</strong>
								<span>14 pelham Road, Baltimore, nh, 3051</span>
							</Box>
						</Box>
						<Box className={'card'}>
							<img src="/img/fiber/about7.jpg" alt="" />
							<Box className={'text'}>
								<strong>Furnix House Chicago</strong>
								<span>3 SW Montclair Street, Chicago, or, 93828</span>
							</Box>
						</Box>
						<Box className={'card'}>
							<img src="/img/fiber/about8.jpg" alt="" />
							<Box className={'text'}>
								<strong>Furnix House Jacksonville</strong>
								<span>13 Lamar Road, Jacksonwile, al, 36445</span>
							</Box>
						</Box>
					</Stack>
					<Stack className={'butt'}>
						<h3>Not in your town yet?</h3>
						<span>
							Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad minim
							veniam, quis nostrud
						</span>
						<Link href={'/product'}>
							<button>Shop Now</button>
						</Link>
					</Stack>
				</Stack>
				<Stack className={'img'}>
					<img src="/img/fiber/about8.jpg" alt="" />
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
