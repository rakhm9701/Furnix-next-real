import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const HeroBanner = () => {
	const [activeSlide, setActiveSlide] = useState(0);
		const router = useRouter();

	// Banner data with different images and content
	const bannerData = [
		{
			id: 1,
			title: 'CLASSIC\nKITCHEN',
			image: '/img/banner/kitchen.jpg',
		},
		{
			id: 2,
			title: 'MODERN\nWOODEN TABLE',
			image: '/img/banner/dining.jpg',
		},
		{
			id: 3,
			title: 'ELEGANT\nBEDROOM SET',
			image: '/img/banner/bad.jpg',
		},
	];

	// Auto slide change
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveSlide((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
		}, 5000);

		return () => clearInterval(interval);
	}, [bannerData.length]);

	// Manual slide change
	const handleDotClick = (index: any) => {
		setActiveSlide(index);
	};
	const handleShopNow = () => {
		router.push('/product');
	};

	return (
		<Stack className={`sofa-hero-banner slide-${activeSlide}`}>
			<Box className="banner-container">
				<Box className="content-area">
					<Box className="text-content">
						<Typography variant="h1" className="main-title">
							{bannerData[activeSlide].title}
						</Typography>

						<Button variant="contained" className="shop-button" onClick={handleShopNow}>
							Shop Now
						</Button>
					</Box>
				</Box>

				{/* All banner images */}
				{bannerData.map((banner, index) => (
					<Box
						key={banner.id}
						className={`furniture-image ${index === activeSlide ? 'active' : ''}`}
						style={{ backgroundImage: `url(${banner.image})` }}
					></Box>
				))}

				{/* Navigation dots */}
				<Box className="navigation-dots">
					{bannerData.map((_, index) => (
						<Box
							key={index}
							className={`dot ${index === activeSlide ? 'active' : ''}`}
							onClick={() => handleDotClick(index)}
						></Box>
					))}
				</Box>
			</Box>
		</Stack>
	);
};

export default HeroBanner;
