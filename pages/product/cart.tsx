import React, { useState } from 'react';
import { Typography, Button, Box, Container, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import { sweetErrorHandling, sweetTopSmallSuccessAlert, sweetConfirmAlert } from '../../libs/sweetAlert';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { NextPage } from 'next';
import { useCart } from '../../libs/context/useCart';
import { Add, Remove, DeleteOutline } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

const CartPage: NextPage = () => {
	const { state, updateQuantity, removeFromCart, clearCart } = useCart();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleQuantityChange = async (productId: string, newQuantity: number) => {
		try {
			if (newQuantity < 1) return;
			updateQuantity(productId, newQuantity);
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

	const handleRemoveAll = async () => {
		try {
			const confirmed = await sweetConfirmAlert('Are you sure you want to remove all items?', true);
			if (confirmed) {
				clearCart();
				await sweetTopSmallSuccessAlert('All items removed from cart', 800);
			}
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

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
				<Typography variant="h3" sx={{ fontWeight: 'bold' }}>
					My Cart
				</Typography>
				<Box display="flex" alignItems="center">
					{state.items.length > 0 && (
						<Button
							startIcon={<DeleteOutline />}
							onClick={handleRemoveAll}
							sx={{
								mr: 2,
								color: '#d32f2f',
								textTransform: 'none',
								fontWeight: 'normal',
								fontSize: '16px',
								'&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' },
							}}
						>
							Remove All
						</Button>
					)}
					<Button
						startIcon={
							<Box component="span" sx={{ transform: 'rotate(180deg)', display: 'flex' }}>
								→
							</Box>
						}
						onClick={() => router.push('/product')}
						sx={{ textTransform: 'none', fontWeight: 'normal', fontSize: '16px' }}
					>
						Back To Shopping
					</Button>
				</Box>
			</Box>

			{state.items.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography variant="h5" sx={{ color: '#666', mb: 3 }}>
						Your cart is empty
					</Typography>
					<Button
						variant="contained"
						onClick={() => router.push('/product')}
						sx={{
							bgcolor: '#222',
							color: 'white',
							'&:hover': { bgcolor: '#000' },
						}}
					>
						Start Shopping
					</Button>
				</Box>
			) : (
				<>
					<Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 2 }}>
						<Grid container>
							<Grid item xs={12} md={5}>
								<Typography sx={{ fontWeight: 'normal', color: '#666' }}>Product</Typography>
							</Grid>
							<Grid item xs={12} md={2} sx={{ textAlign: { md: 'center' } }}>
								<Typography sx={{ fontWeight: 'normal', color: '#666' }}>Price</Typography>
							</Grid>
							<Grid item xs={12} md={3} sx={{ textAlign: { md: 'center' } }}>
								<Typography sx={{ fontWeight: 'normal', color: '#666' }}>Quantity</Typography>
							</Grid>
							<Grid item xs={12} md={2} sx={{ textAlign: { md: 'right' } }}>
								<Typography sx={{ fontWeight: 'normal', color: '#666' }}>Total</Typography>
							</Grid>
						</Grid>
					</Box>

					{state.items.map((item) => (
						<Box key={item._id} sx={{ py: 3, borderBottom: '1px solid #e0e0e0' }}>
							<Grid container alignItems="center" spacing={2}>
								<Grid item xs={12} md={5}>
									<Box display="flex" alignItems="center">
										<Box
											sx={{
												width: 120,
												height: 120,
												bgcolor: '#f5f5f5',
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
													target.src = '/img/placeholder.png';
												}}
											/>
										</Box>
										<Box>
											<Box display="flex" mb={1}>
												{[1, 2, 3, 4, 5].map((star) => (
													<Box key={star} component="span" color="#FFB800" mr={0.5}>
														★
													</Box>
												))}
											</Box>
											<Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
												{item.productTitle}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
												MATERIAL:
												<br />
												{item.productMaterials}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid item xs={12} md={2} sx={{ textAlign: { md: 'center' } }}>
									<Typography sx={{ fontWeight: 'bold' }}>${formatterStr(item.productPrice)}</Typography>
								</Grid>

								<Grid item xs={12} md={3} sx={{ textAlign: { md: 'center' } }}>
									<Box
										sx={{
											display: 'inline-flex',
											alignItems: 'center',
											border: '1px solid #e0e0e0',
											borderRadius: '50px',
											px: 1,
										}}
									>
										<Button sx={{ minWidth: '40px' }} onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>
											<Remove />
										</Button>
										<Typography sx={{ mx: 2, width: '20px', textAlign: 'center' }}>{item.quantity}</Typography>
										<Button sx={{ minWidth: '40px' }} onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
											<Add />
										</Button>
									</Box>
								</Grid>

								<Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography sx={{ fontWeight: 'bold', textAlign: { md: 'right' }, flexGrow: 1 }}>
										${formatterStr(item.productPrice * item.quantity)}
									</Typography>
									<Button onClick={() => handleRemoveItem(item._id)} sx={{ minWidth: 'auto', color: '#999' }}>
										<Box display="flex" alignItems="center">
											<CloseIcon fontSize="small" />
											<Typography
												variant="body2"
												component="span"
												sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}
											>
												REMOVE
											</Typography>
										</Box>
									</Button>
								</Grid>
							</Grid>
						</Box>
					))}

					{/* Cart Summary */}
					<Box sx={{ mt: 4 }}>
						<Grid container spacing={4}>
							<Grid item xs={12} md={6}>
								<Box sx={{ bgcolor: '#f9f9f9', p: 3 }}>
									<Typography variant="h5" sx={{ mb: 3 }}>
										Cart Totals
									</Typography>

									<Box
										sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '1px solid #e0e0e0' }}
									>
										<Typography>Cart Subtotal</Typography>
										<Typography sx={{ fontWeight: 'bold' }}>${formatterStr(state.total)}</Typography>
									</Box>

									<Box
										sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '1px solid #e0e0e0' }}
									>
										<Typography>Shipping</Typography>
										<Typography sx={{ fontWeight: 'bold', color: 'green' }}>FREE</Typography>
									</Box>

									<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
										<Typography sx={{ fontWeight: 'bold' }}>TOTAL</Typography>
										<Typography sx={{ fontWeight: 'bold' }}>${formatterStr(state.total)}</Typography>
									</Box>

									<Button
										variant="contained"
										fullWidth
										size="large"
										sx={{
											mt: 3,
											bgcolor: '#222',
											color: 'white',
											py: 1.5,
											'&:hover': { bgcolor: '#000' },
											textTransform: 'uppercase',
										}}
										onClick={handleCheckout}
										disabled={state.items.length === 0}
									>
										PROCESSED TO CHECKOUT
									</Button>
								</Box>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box sx={{ p: 3, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', height: '100%' }}>
									<Box sx={{ flex: 1 }}>
										<Typography variant="h6" sx={{ mb: 2 }}>
											Explore Enhanced Possibilities
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
											with the StarStone Financial Card
										</Typography>
										<Button
											sx={{ textTransform: 'none' }}
											endIcon={
												<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
													⟶
												</Box>
											}
										>
											<Link href={'/about'}>Learn more</Link>
										</Button>
									</Box>
									<Box sx={{ ml: 'auto' }}>
										<img
											src="/img/fiber/card.jpg"
											alt="Credit Card"
											style={{ width: '300px', height: '250px', transform: 'rotate(19deg)' }}
										/>
									</Box>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</>
			)}
		</Container>
	);
};

export default withLayoutBasic(CartPage);
