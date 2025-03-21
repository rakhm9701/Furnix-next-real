import { Stack, Box } from '@mui/material';
import React from 'react';

const Information = () => {
	return (
		<Stack className={'info-container'}>
			<Stack className={'info-box'}>
				<Box className={'box'}>
					<img src="/img/banner/information/plane.png" alt="" />
					<Box className={'text'}>
						<h3>FREE SHIPPING</h3>
						<span>All The Business Growth And Profit Revolve Areffective Catchy.</span>
					</Box>
				</Box>
				<Box className={'divider'}></Box>
				<Box className={'box'}>
					<img src="/img/banner/information/car.png" alt="" />
					<Box className={'text'}>
						<h3>ONE DAY DELIVERY SHIPPING</h3>
						<span>Present Idligula A Diam Hendrerit Interdum Quisnon Locus.</span>
					</Box>
				</Box>
				<Box className={'divider'}></Box>
				<Box className={'box'}>
					<img src="/img/banner/information/payment.png" alt="" />
					<Box className={'text'}>
						<h3>ONLINE PAYMENTS</h3>
						<span>Donec Ac Pures But It Isd Fdsfjewoifj We Yes I Like It</span>
					</Box>
				</Box>
				<Box className={'divider'}></Box>
				<Box className={'box'}>
					<img src="/img/banner/information/callCenter.png" alt="" />
					<Box className={'text'}>
						<h3>CUSTOMER SERVICE</h3>
						<span>All The Business Growth And Profit Revolve Areffective Catchy</span>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Information;
