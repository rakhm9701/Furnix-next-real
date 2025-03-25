import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Box,
	Button,
	InputAdornment,
	Stack,
	List,
	ListItem,
	Typography,
	Divider,
	Select,
	MenuItem,
	OutlinedInput,
	TablePagination,
} from '@mui/material';
import { TabContext } from '@mui/lab';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { NoticeStatus } from '../../../libs/enums/notice.enum';
import { GET_FAQS } from '../../../apollo/admin/query';
import { UPDATE_FAQ } from '../../../apollo/admin/mutation';

const searchCategories = [
	{ value: 'title', label: 'Title' },
	{ value: 'writer', label: 'Writer' },
];

const FaqArticles: NextPage = () => {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [searchCategory, setSearchCategory] = useState('title');
	const [searchInput, setSearchInput] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<NoticeStatus | 'ALL'>('ALL');

	const [getFaqs, { data, loading, refetch }] = useLazyQuery(GET_FAQS, {
		fetchPolicy: 'network-only',
	});

	const [updateFaqStatus] = useMutation(UPDATE_FAQ);

	useEffect(() => {
		fetchFaqs();
	}, [page, rowsPerPage, selectedStatus]);

	const fetchFaqs = () => {
		getFaqs({
			variables: {
				filter: {
					status: selectedStatus === 'ALL' ? null : selectedStatus,
					search: searchInput || undefined,
					// Remove searchField - it's not needed as we'll handle the search
					// on the backend based on title and content
				},
				page: page + 1,
				limit: rowsPerPage,
			},
		});
	};

	const handleDelete = async (id: string) => {
		// Add your delete logic here
		console.log(`Deleting FAQ with id: ${id}`);
		// After deletion, refetch the FAQs
		refetch();
	};

	const handleStatusChange = async (id: string, newStatus: NoticeStatus) => {
		try {
			await updateFaqStatus({
				variables: {
					id,
					input: {
						status: newStatus,
					},
				},
			});
			refetch();
		} catch (error) {
			console.error('Error updating FAQ status:', error);
		}
	};

	const handlePageChange = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleTabChange = (status: NoticeStatus | 'ALL') => {
		setSelectedStatus(status);
		setPage(0);
	};

	const handleSearch = () => {
		setPage(0);
		fetchFaqs();
	};

	const clearSearch = () => {
		setSearchInput('');
		setPage(0);
		fetchFaqs();
	};

	const getStatusCount = (status: NoticeStatus | 'ALL') => {
		if (!data?.getFaqs?.items) return 0;
		if (status === 'ALL') return data.getFaqs.total;
		return data.getFaqs.items.filter((faq: { status: NoticeStatus }) => faq.status === status).length;
	};
	console.log('FAQ Data:', data); // Add this to debug

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push('/_admin/cs/faq_create')}
					sx={{ mt: '10px', bgcolor: '#00bbae' }}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={selectedStatus}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={() => handleTabChange('ALL')}
									value="ALL"
									className={selectedStatus === 'ALL' ? 'li on' : 'li'}
								>
									All ({getStatusCount('ALL')})
								</ListItem>
								{Object.values(NoticeStatus).map((status) => (
									<ListItem
										key={status}
										onClick={() => handleTabChange(status)}
										value={status}
										className={selectedStatus === status ? 'li on' : 'li'}
									>
										{status} ({getStatusCount(status)})
									</ListItem>
								))}
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select
									sx={{ width: '160px', mr: '20px' }}
									value={searchCategory}
									onChange={(e) => setSearchCategory(e.target.value)}
								>
									{searchCategories.map((category) => (
										<MenuItem key={category.value} value={category.value}>
											{category.label}
										</MenuItem>
									))}
								</Select>

								<OutlinedInput
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search..."
									onKeyDown={(event) => {
										if (event.key === 'Enter') handleSearch();
									}}
									endAdornment={
										<>
											{searchInput && <CancelRoundedIcon onClick={clearSearch} sx={{ cursor: 'pointer', mr: 1 }} />}
											<InputAdornment position="end" onClick={handleSearch} sx={{ cursor: 'pointer' }}>
												<img src="/img/icons/search1.png" alt={'searchIcon'} style={{ height: '30px' }} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<FaqArticlesPanelList
							faqs={
								data?.faqs?.items?.map((item: any) => ({
									id: item.id,
									noticeTitle: item.noticeTitle,
									noticeContent: item.noticeContent,
									noticeCategory: item.noticeCategory,
									noticeStatus: item.noticeStatus,
									memberId: item.memberId,
									createdAt: item.createdAt,
									updatedAt: item.updatedAt,
								})) || []}
							   loading={loading}
							   handleStatusChange={handleStatusChange}
							   handleDelete={handleDelete}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={data?.getFaqs?.total || 0}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handlePageChange}
							onRowsPerPageChange={handleRowsPerPageChange}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(FaqArticles);
