import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../../context/useCart';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface ProductCardType {
	product: Product;
	likeProductHandler: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProductCard = (props: ProductCardType) => {
	const { product: product, likeProductHandler: likeProductHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = product?.productImages[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/banner/header1.svg';
	const { addToCart } = useCart();

	/** HANDLERS **/
	const handleAddToCart = async () => {
		try {
			addToCart(product, 1);
			await sweetTopSmallSuccessAlert('Added to cart successfully', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/product/detail',
							query: { id: product?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					<IconButton className="favorite-button" onClick={() => likeProductHandler(user, product?._id)}>
						{myFavorites ? (
							<FavoriteIcon style={{ color: 'red' }} />
						) : product?.meLiked && product?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon style={{ color: 'red' }} />
						) : (
							<FavoriteIcon />
						)}
					</IconButton>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/product/detail',
									query: { id: product?._id },
								}}
							>
								<Typography>{product.productTitle}</Typography>
							</Link>
						</Stack>
					</Stack>
					<Stack className="price-cart">
						<Typography className="price">${formatterStr(product?.productPrice)}</Typography>
						<IconButton className="cart-button">
							<ShoppingCartOutlinedIcon onClick={handleAddToCart} />
						</IconButton>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
