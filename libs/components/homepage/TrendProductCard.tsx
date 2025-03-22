import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../../context/useCart';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: any;
}

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product: product, likeProductHandler: likePoductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();

	/** HANDLERS **/
	const pushDetailHandler = async (productId: string) => {
		console.log('productId:', productId);
		await router.push({ pathname: '/product/detail', query: { id: productId } });
	};

	const handleAddToCart = async () => {
		try {
			addToCart(product, 1);
			await sweetTopSmallSuccessAlert('Added to cart successfully', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};


	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={product._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushDetailHandler(product._id)}
				>
					<div
						className="favorite-button"
						onClick={(e: any) => {
							e.stopPropagation();
							likePoductHandler(user, product?._id);
						}}
					>
						{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon className="favorite-icon active" />
						) : (
							<FavoriteIcon className="favorite-icon" />
						)}
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
						{product.productTitle}
					</strong>
					<Typography className={'price'}>${product?.productPrice?.toFixed(2)}</Typography>
				</Box>
				<div className="add-to-cart-button" onClick={(e: any) => e.stopPropagation()}>
					<span className="cart-icon">+</span>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={product._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushDetailHandler(product._id)}
				>
					<div
						className="favorite-button"
						onClick={(e: any) => {
							e.stopPropagation();
							likePoductHandler(user, product?._id);
						}}
					>
						{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon className="favorite-icon active" />
						) : (
							<FavoriteIcon className="favorite-icon" />
						)}
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
						{product.productTitle}
					</strong>
					<Typography className={'price'}>${product?.productPrice?.toFixed(2)}</Typography>
				</Box>
				<div className="add-to-cart-button" onClick={(e: any) => e.stopPropagation()}>
					<ShoppingCartOutlinedIcon onClick={handleAddToCart} />
				</div>
			</Stack>
		);
	}
};

export default TrendProductCard;


