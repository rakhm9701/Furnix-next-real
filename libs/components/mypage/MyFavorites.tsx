import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography, Box, Button, IconButton, useTheme } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Star, ShoppingCart, Close, FavoriteBorder } from '@mui/icons-material';
import { T } from '../../types/common';
import { Product } from '../../types/product/product';
import { userVar } from '../../../apollo/store';
import Link from 'next/link';
import { useCart } from '../../context/useCart';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


const Wishlist: NextPage = () => {
	const theme = useTheme();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [myFavorites, setMyFavorites] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const { addToCart } = useCart();
	const [searchFavorites, setSearchFavorites] = useState<T>({
		page: 1,
		limit: 6,
	});

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFavorites },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMyFavorites(data?.getFavorites?.list);
			setTotal(data?.getFavorites?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const likeProductHandler = async (id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetProduct({
				variables: {
					input: id,
				},
			});

			await getFavoritesRefetch();
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

		const handleAddToCart = async (product: Product) => {
			try {
				
				addToCart(product, 1);
				await sweetTopSmallSuccessAlert('Added to cart successfully', 800);
			} catch (err: any) {
				await sweetErrorHandling(err);
			}
		};

	const renderStars = (rating: number = 5) => {
		return Array(5)
			.fill(0)
			.map((_, index) => (
				<Star
					key={index}
					fontSize="small"
					style={{
						color: index < rating ? '#FFC107' : '#E0E0E0',
					}}
				/>
			));
	};

	const shareWishlist = (platform: string) => {
		// Implement share functionality here
		console.log('Share wishlist on:', platform);
	};

	if (device === 'mobile') {
		return (
			<div id="wishlist-page-mobile">
				<Typography className="page-title">Wishlist</Typography>

				{myFavorites?.length ? (
					<Stack spacing={2} className="mobile-items-container">
						{myFavorites.map((product: Product) => (
							<Box key={product._id} className="mobile-item-card">
								<Box className="product-image">
									<img
										src={`${process.env.REACT_APP_API_URL}/${product.productImages?.[0] || 'img/placeholder.jpg'}`}
										alt={product.productTitle}
									/>
								</Box>
								<Box className="product-details">
									<Box className="rating">{renderStars(product.productComments || 5)}</Box>
									<Typography className="product-title">{product.productTitle}</Typography>
									<Typography className="product-price">${product.productPrice}</Typography>
									<Typography className="product-status">{product.productStatus}</Typography>

									<Box className="actions">
										<Button
											variant="contained"
											className="add-to-cart-btn"
											onClick={() => addToCart(product)}
											startIcon={<ShoppingCart />}
										>
											Add to Cart
										</Button>
										<IconButton className="remove-btn" onClick={() => likeProductHandler(product._id)}>
											<Close />
										</IconButton>
									</Box>
								</Box>
							</Box>
						))}

						<Box className="pagination-wrapper">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit)}
								page={searchFavorites.page}
								shape="rounded"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="total-count">
								Total {total} wishlist item{total > 1 ? 's' : ''}
							</Typography>
						</Box>
					</Stack>
				) : (
					<Box className="no-items">
						<FavoriteBorder className="empty-icon" />
						<Typography>Your wishlist is empty!</Typography>
						<Button variant="contained" component={Link} href="/product" className="shop-now-btn">
							Browse Products
						</Button>
					</Box>
				)}
			</div>
		);
	} else {
		return (
			<div id="wishlist-page">
				<Typography className="page-title">Wishlist</Typography>

				<div className="wishlist-table">
					{/* Table Header */}
					<div className="table-header">
						<div className="header-cell">Product</div>
						<div className="header-cell">Price</div>
						<div className="header-cell"> Status</div>
						<div className="header-cell"> Cart</div>
						<div className="header-cell"> Remove</div>
					</div>

					{/* Products List */}
					{myFavorites?.length ? (
						myFavorites.map((product: Product) => (
							<div key={product._id} className="product-row">
								<div className="product-cell">
									<div className="product-image">
										<img
											src={`${process.env.REACT_APP_API_URL}/${product.productImages?.[0] || 'img/placeholder.jpg'}`}
											alt={product.productTitle}
										/>
									</div>
									<div className="product-info">
										<div className="product-name">{product.productTitle}</div>
										{product.productDesc && <div className="product-details">{product.productDesc}</div>}
										<div className="rating">
											{product.productViews} view
											{product.productLikes} like
										</div>
									</div>
								</div>

								{/* Price */}
								<div className="price-cell">
									<div className="current-price">${product.productPrice}</div>
								</div>

								{/* Stock Status */}
								{product.productStatus}

								{/* Actions */}
								<div className="actions-cell">
									<button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
										<ShoppingCart /> ADD TO CART
									</button>
									<div className="remove-btn" onClick={() => likeProductHandler(product._id)}>
										<Close /> REMOVE
									</div>
								</div>
							</div>
						))
					) : (
						<div className="no-items">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No items in your wishlist!</p>
							<Button variant="contained" component={Link} href="/product" className="shop-now-btn">
								Browse Products
							</Button>
						</div>
					)}
				</div>

				{/* Pagination */}
				{myFavorites?.length ? (
					<div className="pagination-wrapper">
						<div className="pagination-controls">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit)}
								page={searchFavorites.page}
								shape="rounded"
								color="primary"
								onChange={paginationHandler}
							/>
						</div>
						<div className="total-count">
							<Typography>
								Total {total} wishlist item{total > 1 ? 's' : ''}
							</Typography>
						</div>
					</div>
				) : null}

				{/* Share Wishlist */}
				{myFavorites?.length ? (
					<div className="share-wishlist">
						<div className="share-label">SHARE WISHLIST:</div>
						<div className="social-icons">
							<div className="social-icon" onClick={() => shareWishlist('facebook')}>
								<FacebookOutlinedIcon />
							</div>
							<div className="social-icon" onClick={() => shareWishlist('instagram')}>
								<TelegramIcon />
							</div>
							<div className="social-icon" onClick={() => shareWishlist('twitter')}>
								<InstagramIcon />
							</div>
							<div className="social-icon" onClick={() => shareWishlist('whatsapp')}>
								<TwitterIcon />
							</div>
						</div>
					</div>
				) : null}
			</div>
		);
	}
};

export default Wishlist;
