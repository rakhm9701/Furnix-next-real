// libs/components/admin/cs/FaqList.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	IconButton,
	Tooltip,
} from '@mui/material';
import { Stack } from '@mui/material';
import { NotePencil, Trash } from 'phosphor-react';
import { format } from 'date-fns';
import { NoticeStatus } from '../../../enums/notice.enum';

interface Data {
	id: string;
	noticeTitle: string;
	noticeContent: string;
	noticeCategory: string;
	noticeStatus: NoticeStatus;
	memberId: string;
	createdAt: string;
	updatedAt: string;
}

interface HeadCell {
	id: keyof Data;
	numeric: boolean;
	label: string;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'noticeCategory',
		numeric: true,
		label: 'CATEGORY',
	},
	{
		id: 'noticeTitle',
		numeric: true,
		label: 'TITLE',
	},
	{
		id: 'memberId',
		numeric: true,
		label: 'WRITER',
	},
	{
		id: 'createdAt',
		numeric: true,
		label: 'DATE',
	},
	{
		id: 'noticeStatus',
		numeric: false,
		label: 'STATUS',
	},
	{
		id: 'id',
		numeric: false,
		label: 'ACTION',
	},
];

interface FaqArticlesPanelListProps {
	faqs: (Data | ({ id: string } & Omit<Data, 'id'>))[]; // Accept both id and _id
	loading?: boolean;
	handleStatusChange: (id: string, status: NoticeStatus) => void;
	handleDelete: (id: string) => void;
}

export const FaqArticlesPanelList: React.FC<FaqArticlesPanelListProps> = ({
	faqs,
	loading,
	handleStatusChange,
	handleDelete,
}) => {
	const router = useRouter();
	const [menuAnchorEl, setMenuAnchorEl] = React.useState<{
		[key: string]: HTMLElement | null;
	}>({});
	const [statusAnchorEl, setStatusAnchorEl] = React.useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
		setMenuAnchorEl((prev) => ({
			...prev,
			[id]: event.currentTarget,
		}));
	};

	const handleStatusClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
		setStatusAnchorEl((prev) => ({
			...prev,
			[id]: event.currentTarget,
		}));
	};

	const handleMenuClose = (id: string) => {
		setMenuAnchorEl((prev) => ({
			...prev,
			[id]: null,
		}));
	};

	const handleStatusClose = (id: string) => {
		setStatusAnchorEl((prev) => ({
			...prev,
			[id]: null,
		}));
	};

	const getStatusColor = (status: NoticeStatus) => {
		switch (status) {
			case NoticeStatus.ACTIVE:
				return 'success.main';
			case NoticeStatus.HOLD:
				return 'warning.main';
			case NoticeStatus.DELETE:
				return 'error.main';
			default:
				return 'text.primary';
		}
	};

	const getStatusBgColor = (status: NoticeStatus) => {
		switch (status) {
			case NoticeStatus.ACTIVE:
				return 'rgba(84, 214, 44, 0.16)';
			case NoticeStatus.HOLD:
				return 'rgba(255, 193, 7, 0.16)';
			case NoticeStatus.DELETE:
				return 'rgba(255, 72, 66, 0.16)';
			default:
				return 'transparent';
		}
	};

	useEffect(() => {
		console.log('Received FAQs:', faqs);
	}, [faqs]);

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
							{headCells.map((headCell) => (
								<TableCell key={headCell.id} align={headCell.numeric ? 'left' : 'center'}>
									{headCell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{Array.isArray(faqs) &&
							faqs.map((faq) => (
								<TableRow hover key={faq.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{faq.noticeCategory}</TableCell>
									<TableCell align="left">{faq.noticeTitle}</TableCell>
									<TableCell align="left">{faq.memberId}</TableCell>
									<TableCell align="left">{format(new Date(faq.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
									<TableCell align="center">
										<Button
											onClick={(e: any) => handleStatusClick(e, faq.id || faq.id)}
											sx={{
												color: getStatusColor(faq.noticeStatus),
												backgroundColor: getStatusBgColor(faq.noticeStatus),
												'&:hover': {
													backgroundColor: getStatusBgColor(faq.noticeStatus),
													opacity: 0.8,
												},
											}}
										>
											{faq.noticeStatus}
										</Button>

										<Menu
											anchorEl={statusAnchorEl[faq.id]}
											open={Boolean(statusAnchorEl[faq.id])}
											onClose={() => handleStatusClose(faq.id)}
											TransitionComponent={Fade}
										>
											{Object.values(NoticeStatus).map((status) => (
												<MenuItem
													key={status}
													onClick={() => {
														handleStatusChange(faq.id, status);
														handleStatusClose(faq.id);
													}}
													disabled={status === faq.noticeStatus}
													sx={{
														color: getStatusColor(status),
													}}
												>
													{status}
												</MenuItem>
											))}
										</Menu>
									</TableCell>
									<TableCell align="center">
										<Stack direction="row" spacing={1} justifyContent="center">
											<Tooltip title="Edit">
												<IconButton
													onClick={() => router.push(`/_admin/cs/faq_create?id=${faq.id || faq.id}`)}
													size="small"
												>
													<NotePencil size={20} />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton onClick={(e: any) => handleMenuClick(e, faq.id || faq.id)} size="small" color="error">
													<Trash size={20} />
												</IconButton>
											</Tooltip>
										</Stack>

										<Menu
											anchorEl={menuAnchorEl[faq.id]}
											open={Boolean(menuAnchorEl[faq.id])}
											onClose={() => handleMenuClose(faq.id)}
											TransitionComponent={Fade}
										>
											<MenuItem
												onClick={() => {
													handleDelete(faq.id);
													handleMenuClose(faq.id);
												}}
												sx={{ color: 'error.main' }}
											>
												Delete FAQ
											</MenuItem>
										</Menu>
									</TableCell>
								</TableRow>
							))}
						{loading && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Loading...
								</TableCell>
							</TableRow>
						)}
						{!loading && faqs.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									No FAQs found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
