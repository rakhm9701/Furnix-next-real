import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';

interface ProductBigCardProps {
	product: Product;
	
}

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const goProductDetailPage = (productId: string) => {
		router.push(`/product/detail?id=${productId}`);
	};

	const formattedPrice = `$${formatterStr(product?.productPrice)}`;

	if (device === 'mobile') {
		return <div>PRODUCT CARD MOBILE</div>;
	} else {
		return (
			<Stack className="product-big-card-box" onClick={() => goProductDetailPage(product?._id)}>

				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})` }}
				/>

				{/* Product information - simplified to just title and price */}
				<Box component={'div'} className={'info'}>
					<div className="title-price">
						<Typography className={'title'}>{product?.productTitle}</Typography>
						<Typography className={'price'}>{formattedPrice}</Typography>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default ProductBigCard;
