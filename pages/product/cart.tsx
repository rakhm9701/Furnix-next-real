import React, { useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	Typography,
	Stack,
	TextField,
	Card,
	CardContent,
	Grid,
	Container,
	CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { NextPage } from 'next';
import { useCart } from '../../libs/context/useCart';

const CartPage: NextPage = () => {
	const { state, updateQuantity, removeFromCart, clearCart } = useCart();
	const router = useRouter();
	const [specialInstructions, setSpecialInstructions] = useState('');
	const shippingFee = 5.0;
	const [loading, setLoading] = useState(false);

	const handleQuantityChange = async (productId: string, newQuantity: number) => {
		try {
			if (newQuantity < 1) return;
			updateQuantity(productId, newQuantity);
			await sweetTopSmallSuccessAlert('Updated quantity', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const handleRemoveItem = async (productId: string) => {
		try {
			removeFromCart(productId);
			await sweetTopSmallSuccessAlert('Removed from cart', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const handleCheckout = async () => {
		try {
			setLoading(true);
			await router.push('/checkout');
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" gutterBottom>
				Shopping Cart ({state.itemCount} items)
			</Typography>

			<Grid container spacing={4}>
				{/* Cart Items */}
				<Grid item xs={12} md={8}>
					<Card>
						<CardContent>
							{state.items.map((item) => (
								<Box
									key={item._id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										py: 2,
										borderBottom: '1px solid #eee',
										'&:last-child': { borderBottom: 'none' },
									}}
								>
									{/* Product Image - Changed from Next/Image to img */}
									<Box
										sx={{
											width: 100,
											height: 100,
											position: 'relative',
											mr: 2,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<img
											src={`${REACT_APP_API_URL}/${item.productImages[0]}`}
											alt={item.productTitle}
											style={{
												maxWidth: '100%',
												maxHeight: '100%',
												objectFit: 'contain',
											}}
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.src = '/img/placeholder.png'; // Fallback image
											}}
										/>
									</Box>

									{/* Product Details */}
									<Box flex={1}>
										<Typography variant="h6">{item.productTitle}</Typography>
										<Typography variant="body2" color="text.secondary">
											Category: {item.productMaterials}
										</Typography>
										{item.selectedSize && (
											<Typography variant="body2" color="text.secondary">
												Size: {item.selectedSize}
											</Typography>
										)}
									</Box>

									{/* Price */}
									<Typography variant="subtitle1" sx={{ mx: 4 }}>
										${formatterStr(item.productPrice)}
									</Typography>

									{/* Quantity Controls */}
									<Stack direction="row" alignItems="center" spacing={1} sx={{ mx: 4 }}>
										<IconButton
											size="small"
											onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
											disabled={item.quantity <= 1}
										>
											<RemoveIcon />
										</IconButton>
										<Typography>{item.quantity}</Typography>
										<IconButton size="small" onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
											<AddIcon />
										</IconButton>
									</Stack>

									{/* Total & Remove */}
									<Box sx={{ minWidth: 100, textAlign: 'right' }}>
										<Typography variant="subtitle1">${formatterStr(item.productPrice * item.quantity)}</Typography>
										<IconButton color="error" onClick={() => handleRemoveItem(item._id)} size="small">
											<DeleteIcon />
										</IconButton>
									</Box>
								</Box>
							))}

							{state.items.length === 0 && (
								<Box py={4} textAlign="center">
									<Typography color="text.secondary">Your cart is empty</Typography>
								</Box>
							)}

							{/* Cart Actions */}
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
								<Button variant="outlined" onClick={() => router.push('/product')}>
									Continue Shopping
								</Button>
								<Button variant="outlined" color="error" onClick={clearCart} disabled={state.items.length === 0}>
									Clear Cart
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Cart Summary */}
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Cart Totals
							</Typography>

							<Box sx={{ mb: 2 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography>Subtotal</Typography>
									<Typography>${formatterStr(state.total)}</Typography>
								</Box>

								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography>Shipping</Typography>
									<Box sx={{ textAlign: 'right' }}>
										<Typography>Flat Rate: ${formatterStr(shippingFee)}</Typography>
										<Typography variant="body2" color="text.secondary">
											Shipping To AL
										</Typography>
										<Button sx={{ p: 0, minWidth: 'auto' }} onClick={() => router.push('/shipping')}>
											Change Address
										</Button>
									</Box>
								</Box>

								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										pt: 2,
										borderTop: '1px solid #eee',
										mb: 2,
									}}
								>
									<Typography variant="h6">Total</Typography>
									<Typography variant="h6">${formatterStr(state.total + shippingFee)}</Typography>
								</Box>

								<Button
									variant="contained"
									fullWidth
									sx={{
										mb: 2,
										color: '#fff',
										background: '#00bbae',
										'&:hover': { opacity: 0.7, color: '#fff', background: '#00bbae' },
									}}
									onClick={handleCheckout}
									disabled={state.items.length === 0}
								>
									Proceed To Checkout
								</Button>

								<TextField
									fullWidth
									multiline
									rows={4}
									label="Special Instructions For Seller"
									value={specialInstructions}
									onChange={(e) => setSpecialInstructions(e.target.value)}
									sx={{ mb: 2 }}
								/>

								<Button variant="outlined" fullWidth onClick={() => router.push('/about')}>
									Ask Question Now
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default withLayoutBasic(CartPage);
