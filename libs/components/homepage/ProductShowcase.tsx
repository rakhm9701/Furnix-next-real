import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import { Product } from '../../types/product/product';
import { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

const ProductInfo = ({ product, onClose }: any) => {
	return (
		<Box className="product-info-card" component="div">
			<Box className="product-info-content" component="div">
				<Typography className="product-title">{product.name}</Typography>
				<Typography className="product-description">{product.description}</Typography>
				<Box className="price-container" component="div">
					<Typography className="current-price">${product.price}</Typography>
					{product.originalPrice && <Typography className="original-price">${product.originalPrice}</Typography>}
				</Box>
			</Box>
		</Box>
	);
};

const ProductShowcase = () => {

	const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const swiperRef = useRef<SwiperRef>(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	const scenes = [
		{
			id: 1,
			image: '/img/fiber/show-case2.webp',
			products: [
				{
					id: 1,
					name: 'Two-Seater Sofa by Gamfratesi',
					price: '20',
					position: { top: '60%', left: '60%' },
				},
				{
					id: 2,
					name: 'A Blue Sofa with Cushions',
					price: '161',
					position: { top: '52%', left: '50%' },
				},
				{
					id: 3,
					name: 'The Montague Armchair',
					price: '149.99',
					position: { top: '60%', left: '15%' },
				},
			],
		},
		{
			id: 2,
			image: '/img/fiber/show-case1.webp',
			products: [
				{
					id: 1,
					name: 'LED Desk Lamp Acryl Table Lamp',
					price: '189.99',
					position: { top: '50%', left: '38%' },
				},
				{
					id: 2,
					name: 'Shelf',
					price: '79.99',
					position: { top: '45%', left: '70%' },
				},
				{
					id: 3,
					name: 'Queen Bed Frame',
					price: '499.99',
					position: { top: '45%', left: '15%' },
				},
			],
		},
		{
			id: 3,
			image: '/img/fiber/show-case3.jpg',
			products: [
				{
					id: 1,
					name: '3 Seater Sofa',
					price: '699.99',
					position: { top: '67%', left: '40%' },
				},
				{
					id: 2,
					name: 'French Pillow',
					price: '19.99',
					position: { top: '70%', left: '20%' },
				},
				
				{
					id: 4,
					name: 'Safco Bosk Stack Chair',
					price: '49.99',
					position: { top: '65%', left: '65%' },
				},
			],
		},
	];

	// Yopilish uchun hotspot bo'lmagan joylarga bosilganda ProductInfo yopiladi
	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (!e.target.closest('.hotspot') && !e.target.closest('.product-info-card')) {
				setActiveProduct(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Ekran o'lchamiga qarab product-info-card pozitsiyasini to'g'irlash
	useEffect(() => {
		const handleResize = () => {
			if (activeProduct) {
				// Aniq tip bilan qayta o'rnatish
				setActiveProduct((prevProduct) => (prevProduct ? { ...prevProduct } : null));
			}
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [activeProduct]);
	const handleHotspotClick = (product: any) => {
		setActiveProduct(activeProduct && activeProduct.id === product.id ? null : product);
	};

    const handlePrevSlide = () => {
			if (swiperRef.current) {
				const swiper: SwiperType = swiperRef.current.swiper;
				swiper.slidePrev();
			}
			setActiveProduct(null);
		};

		const handleNextSlide = () => {
			if (swiperRef.current) {
				const swiper: SwiperType = swiperRef.current.swiper;
				swiper.slideNext();
			}
			setActiveProduct(null);
		};

	// Product info card pozitsiyasini ekran chetlaridan chiqib ketmasligi uchun to'g'irlash
	const adjustProductInfoPosition = (product: any) => {
		if (!activeProduct || activeProduct.id !== product.id) return {};

		const containerWidth = document.querySelector('.scene-container')?.clientWidth || 0;
		const productCardWidth = 250; // ProductInfo card kengligi
		const leftPosition = (parseFloat(product.position.left) / 100) * containerWidth;

		let adjustedStyle = {};

		// Agar card chap tarafga chiqib ketsa
		if (leftPosition - productCardWidth / 2 < 0) {
			adjustedStyle = { left: 'calc(0% + 20px)', transform: 'translateX(0)' };
		}
		// Agar card o'ng tarafga chiqib ketsa
		else if (leftPosition + productCardWidth / 2 > containerWidth) {
			adjustedStyle = { left: 'calc(100% - 20px)', transform: 'translateX(-100%)' };
		}

		return adjustedStyle;
	};

	return (
		<Box className="product-showcase" component="div">
			<Container maxWidth="xl" className="showcase-container">
				<Swiper
					ref={swiperRef}
					modules={[Pagination, Navigation]}
					className="scene-swiper"
					pagination={{
						el: '.swiper-pagination',
						clickable: true,
						renderBullet: (index, className) => {
							return `<span class="${className} pagination-bullet"></span>`;
						},
					}}
					navigation={{
						prevEl: '.nav-arrow.prev',
						nextEl: '.nav-arrow.next',
					}}
					onSlideChange={(swiper) => {
						setCurrentSlide(swiper.activeIndex);
						setActiveProduct(null);
					}}
				>
					{scenes.map((scene) => (
						<SwiperSlide key={scene.id} className="scene-slide">
							<Box className="scene-container" component="div">
								<img src={scene.image} alt={`Room Scene ${scene.id}`} className="scene-image" loading="lazy" />

								{scene.products.map((product) => (
									<Box
										component="div"
										key={product.id}
										className={`hotspot ${activeProduct && activeProduct.id === product.id ? 'active' : ''}`}
										style={{
											top: product.position.top,
											left: product.position.left,
										}}
										onClick={() => handleHotspotClick(product)}
										aria-label={`View ${product.name} details`}
									>
										<FiberManualRecordIcon className="hotspot-icon" />
										<span className="hotspot-pulse"></span>

										{activeProduct && activeProduct.id === product.id && (
											<ProductInfo
												product={product}
												onClose={() => setActiveProduct(null)}
												style={adjustProductInfoPosition(product)}
											/>
										)}
									</Box>
								))}
							</Box>
						</SwiperSlide>
					))}
				</Swiper>

				<Box className="navigation-controls" component="div">
					<Box className="swiper-pagination pagination-dots" component="div"></Box>

					<Box className="navigation-arrows" component="div">
						<IconButton
							className="nav-arrow prev"
							onClick={handlePrevSlide}
							disabled={currentSlide === 0}
							aria-label="Previous scene"
						>
							<ArrowBackIosIcon />
						</IconButton>
						<IconButton
							className="nav-arrow next"
							onClick={handleNextSlide}
							disabled={currentSlide === scenes.length - 1}
							aria-label="Next scene"
						>
							<ArrowForwardIosIcon />
						</IconButton>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default ProductShowcase;
