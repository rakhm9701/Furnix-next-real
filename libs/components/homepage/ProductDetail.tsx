import { Stack, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';


const ProductDetail = () => {
	const [activeIndex, setActiveIndex] = useState(0);


	/** APOLLO REQUESTS **/
	
	// All Images
	const images = ['/img/product/table1.jpg', '/img/product/table2.png', '/img/product/table3.jpg'];

	/** HANDLERS **/

	const handleThumbnailClick = (index: any) => {
		setActiveIndex(index);
	};

	return (
		<Stack className={'deatil-container'}>
			<Stack className={'headline'}> This year's bestsellers.</Stack>
			<Stack className={'deatil-box'}>
				<Stack className={'left'}>
					<Box className={'img-box'}>
						{/* Asosiy rasm */}
						<img src={images[activeIndex]} alt={`Product view ${activeIndex + 1}`} className="main-image" />
						{/* Navigatsiya tugmalari */}
						<div className="image-nav">
							<button
								className="nav-button prev"
								onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
							>
								<WestIcon />
							</button>
							<button
								className="nav-button next"
								onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
							>
								<EastIcon />
							</button>
						</div>
					</Box>
					<Box className={'content-box'}>
						<Box className={'top'}>
							<span>Top and base </span>
							<span>Walnut Iroku</span>
						</Box>
						<Box className={'divider'}></Box>
						<Box className={'butt'}>
							<span>Dimensions </span>
							<span>24"H x 20"Dia. / 61H x 51 Dia. cm </span>
						</Box>
					</Box>
				</Stack>
				<Stack className={'right'}>
					<Box className={'top'}>
						<h3>Your Staylish Solution : The Versatile Accent Table</h3>
						<span>
							"Designed with elegance and crafted with quality materials, this piece combines style and functionality.
							Perfect for modern interiors, it adds a sophisticated touch to any space."
						</span>
						<p className="price">$161.40</p>
					</Box>
					<Box className={'butt'}>
						{/* Thumbnail rasmlar */}
						<div className="thumbnail-container">
							{images.map((img, index) => (
								<div
									key={index}
									className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
									onClick={() => handleThumbnailClick(index)}
								>
									<img src={img} alt={`Thumbnail ${index + 1}`} />
								</div>
							))}
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};



export default ProductDetail;
