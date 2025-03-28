import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import TrendProductCard from './TrendProductCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import Link from 'next/link';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetProduct Mutation
			await likeTargetProduct({
				variables: { input: id },
			});

			// execute getProductsRefetch
			await getProductsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendProducts) console.log('trendProducts:', trendProducts);
	if (!trendProducts) return null;

	// Take only the first 4 products from the array
	const displayProducts = trendProducts.slice(0, 4);

	if (device === 'mobile') {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Products</span>
					</Stack>
					<Stack className={'card-box'}>
						{displayProducts.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Box component={'div'} className={'trend-product-grid'}>
								{displayProducts.map((product: Product) => (
									<TrendProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
								))}
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Products</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box className={'right'}>
							<div className={'more-box'}>
								<Link href={'/product'}>
									<span>See all products</span>
									<img src="/img/icons/rightup.svg" alt="" />
								</Link>
							</div>
						</Box>
					</Stack>

					<Stack className={'card-box'}>
						{displayProducts.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Box component={'div'} className={'trend-product-grid'}>
								{displayProducts.map((product: Product) => (
									<TrendProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
								))}
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProducts;
