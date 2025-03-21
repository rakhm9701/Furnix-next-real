import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/admin/query';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const BlogComponent = () => {
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
		return <div>BLOG COMPONENT (MOBILE)</div>;
	} else {
		return (
			<Stack className="blog-container">
				<Stack className="blog-content" direction="row">
					{/* Left side content */}
					<Box className="blog-left">
						<Typography variant="h1" className="main-heading">
							Transforming Spaces with Our Blog
						</Typography>
						<Typography className="blog-description">
							Explore the world of interior design and furniture trends with our blog. Discover expert tips,
							inspiration, and the latest in home decor to elevate your living spaces
						</Typography>

						<Box className="tag-container">
							<Link href={'/community?articleCategory=HUMOR'}>
								<Box className="tag">HUMUR</Box>
							</Link>
							<Link href={'/community?articleCategory=RECOMMEND'}>
								<Box className="tag">RECOMMENDED</Box>
							</Link>
							<Link href={'/community?articleCategory=NEWS'}>
								<Box className="tag">NEWS</Box>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<Box className="tag">FREE BOARD</Box>
							</Link>
						</Box>
					</Box>

					{/* Right side content - Blog cards grid */}
					<Box className="blog-right">
						<Box className="blog-grid">
							{/* <img src="/img/fiber/blog.jpg" alt="no img" /> */}
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default BlogComponent;

// import React, { useState } from 'react';
// import Link from 'next/link';
// import useDeviceDetect from '../../hooks/useDeviceDetect';
// import { Stack, Typography } from '@mui/material';
// import CommunityCard from './CommunityCard';
// import { BoardArticle } from '../../types/board-article/board-article';
// import { GET_BOARD_ARTICLES } from '../../../apollo/admin/query';
// import { useQuery } from '@apollo/client';
// import { T } from '../../types/common';
// import { BoardArticleCategory } from '../../enums/board-article.enum';

// const CommunityBoards = () => {
// 	const device = useDeviceDetect();
// 	const [searchCommunity, setSearchCommunity] = useState({
// 		page: 1,
// 		sort: 'articleViews',
// 		direction: 'DESC',
// 	});
// const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
// const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

// /** APOLLO REQUESTS **/
// const {
// 	loading: getNewsArticlesLoading,
// 	data: getNewsArticlesData,
// 	error: getNewsArticlesError,
// 	refetch: getNewsArticlesRefetch,
// } = useQuery(GET_BOARD_ARTICLES, {
// 	fetchPolicy: 'network-only',
// 	variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
// 	notifyOnNetworkStatusChange: true,
// 	onCompleted: (data: T) => {
// 		setNewsArticles(data?.getBoardArticles?.list);
// 	},
// });

// const {
// 	loading: getFreeArticlesLoading,
// 	data: getFreeArticlesData,
// 	error: getFreeArticlesError,
// 	refetch: getFreeArticlesRefetch,
// } = useQuery(GET_BOARD_ARTICLES, {
// 	fetchPolicy: 'network-only',
// 	variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
// 	notifyOnNetworkStatusChange: true,
// 	onCompleted: (data: T) => {
// 		setFreeArticles(data?.getBoardArticles?.list);
// 	},
// });

// 	if (device == 'mobile') {
// 		return <div>COMMUNITY BOARDS (MOBILE)</div>;
// 	} else {
// 		return (
// 			<Stack className={'community-board'}>
// 				<Stack className={'container'}>
// 					<Stack>
// 						<Typography variant={'h1'}>COMMUNITY BOARD HIGHLIGHTS</Typography>
// 					</Stack>
// 					<Stack className="community-main">
// 						<Stack className={'community-left'}>
// 							<Stack className={'content-top'}>
// 								<Link href={'/community?articleCategory=NEWS'}>
// 									<span>News</span>
// 								</Link>
// 								<img src="/img/icons/arrowBig.svg" alt="" />
// 							</Stack>
// 							<Stack className={'card-wrap'}>
// 								{newsArticles.map((article, index) => {
// 									return <CommunityCard vertical={true} article={article} index={index} key={article?._id} />;
// 								})}
// 							</Stack>
// 						</Stack>
// 						<Stack className={'community-right'}>
// 							<Stack className={'content-top'}>
// 								<Link href={'/community?articleCategory=FREE'}>
// 									<span>Free</span>
// 								</Link>
// 								<img src="/img/icons/arrowBig.svg" alt="" />
// 							</Stack>
// 							<Stack className={'card-wrap vertical'}>
// 								{freeArticles.map((article, index) => {
// 									return <CommunityCard vertical={false} article={article} index={index} key={article?._id} />;
// 								})}
// 							</Stack>
// 						</Stack>
// 					</Stack>
// 				</Stack>
// 			</Stack>
// 		);
// 	}
// };

// export default CommunityBoards;
