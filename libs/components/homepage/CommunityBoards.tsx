import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/admin/query';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityComponent = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'createdAt',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<[]>([]);
	const [humerArticles, setHumerArticles] = useState<[]>([]);
	const [recommendArticles, setRecommendArticles] = useState<[]>([]);
	const [freeArticles, setFreeArticles] = useState<[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 4, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getHumerArticlesLoading,
		data: getHumerArticlesData,
		error: getHumerArticlesError,
		refetch: getHumerArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 4, search: { articleCategory: BoardArticleCategory.HUMOR } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setHumerArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getRecommendArticlesLoading,
		data: getRecommendArticlesData,
		error: getRecommendArticlesError,
		refetch: getRecommendArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 4, search: { articleCategory: BoardArticleCategory.RECOMMEND } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecommendArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 4, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list);
		},
	});

	if (device === 'mobile') {
		return <div>COMMUNITY COMPONENT (MOBILE)</div>;
	} else {
		return (
			<Stack className="blog-container">
				<Stack className="blog-content" direction="row">
					{/* Left side content */}
					<Box className="blog-left" component="div">
						<Typography variant="h1" className="main-heading">
							Transforming Spaces with Our Community
						</Typography>
						<Typography className="blog-description">
							Explore the world of interior design and furniture trends with our Community. Discover expert tips,
							inspiration, and the latest in home decor to elevate your living spaces
						</Typography>

						<Box className="tag-container" component="div">
							<Link href={'/community?articleCategory=HUMOR'}>
								<Box className="tag" component="div">
									HUMUR
								</Box>
							</Link>
							<Link href={'/community?articleCategory=RECOMMEND'}>
								<Box className="tag" component="div">
									RECOMMENDED
								</Box>
							</Link>
							<Link href={'/community?articleCategory=NEWS'}>
								<Box className="tag" component="div">
									NEWS
								</Box>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<Box className="tag" component="div">
									FREE BOARD
								</Box>
							</Link>
						</Box>
					</Box>

					{/* Right side content - Blog cards grid */}
					<Box className="blog-right" component="div">
						<Stack className="blog-grid" ></Stack>
					</Box>
					<Box className={'right'} component="div">
						<div className={'more-box'}>
							<Link href={'/community'} >
								<span>See All Communitys</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</Link>
						</div>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityComponent;
