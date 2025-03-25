faq_create; // pages/_admin/cs/faq_create.tsx
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Box,
	Button,
	Stack,
	TextField,
	Typography,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { NoticeStatus } from '../../../libs/enums/notice.enum';
import { CREATE_FAQ, UPDATE_FAQ } from '../../../apollo/admin/mutation';
import { GET_FAQ } from '../../../apollo/admin/query';

interface FaqFormData {
	title: string;
	content: string;
	status?: NoticeStatus;
}

const FaqCreate: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const isEdit = Boolean(id);

	const [formData, setFormData] = useState<FaqFormData>({
		title: '',
		content: '',
		status: NoticeStatus.HOLD,
	});

	const { data: faqData, loading: faqLoading } = useQuery(GET_FAQ, {
		variables: { id },
		skip: !isEdit,
	});

	const [createFaq, { loading: createLoading }] = useMutation(CREATE_FAQ, {
		onCompleted: () => router.push('/_admin/cs/faq'),
	});

	const [updateFaq, { loading: updateLoading }] = useMutation(UPDATE_FAQ, {
		onCompleted: () => router.push('/_admin/cs/faq'),
	});

	useEffect(() => {
		if (faqData?.getFaq) {
			const { title, content, status } = faqData.getFaq;
			setFormData({ title, content, status });
		}
	}, [faqData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<NoticeStatus>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name as string]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (isEdit) {
				await updateFaq({
					variables: {
						id,
						input: formData,
					},
				});
			} else {
				await createFaq({
					variables: {
						input: {
							title: formData.title,
							content: formData.content,
						},
					},
				});
			}
		} catch (error) {
			console.error('Error saving FAQ:', error);
		}
	};

	if (isEdit && faqLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Box component="div" className="content">
			<Box component="div" className="title flex_space">
				<Typography variant="h2">{isEdit ? 'Edit FAQ' : 'Create FAQ'}</Typography>
			</Box>

			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
				<Stack spacing={3} sx={{ maxWidth: '800px' }}>
					<FormControl fullWidth>
						<Typography variant="subtitle1" sx={{ mb: 1 }}>
							Title
						</Typography>
						<TextField
							name="content"
							value={formData.content}
							onChange={handleChange}
							required
							multiline
							fullWidth
							minRows={1} // Minimum number of rows
							maxRows={20} // Maximum number of rows before scrolling
							sx={{
								'& .MuiOutlinedInput-root': {
									height: 'auto',
									'& textarea': {
										overflow: 'auto',
										maxHeight: 'none', // Removes max-height limitation
									},
								},
							}}
						/>
					</FormControl>

					<FormControl fullWidth>
						<Typography variant="subtitle1" sx={{ mb: 1 }}>
							Content
						</Typography>
						<TextField
							name="title"
							value={formData.title}
							onChange={(e) => handleChange(e as SelectChangeEvent<NoticeStatus>)}
							required
							fullWidth
							sx={{
								mb: 3,
								'& .MuiInputBase-input': {
									overflow: 'visible',
									textOverflow: 'ellipsis',
									whiteSpace: 'normal',
									height: 'auto',
									minHeight: '1.4375em', // Default TextField height
								},
							}}
						/>
					</FormControl>

					{isEdit && (
						<FormControl fullWidth>
							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								Status
							</Typography>
							<Select name="status" value={formData.status} onChange={handleChange}>
								{Object.values(NoticeStatus).map((status) => (
									<MenuItem key={status} value={status}>
										{status}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<Stack direction="row" spacing={2} justifyContent="flex-end">
						<Button
							variant="outlined"
							onClick={() => router.push('/_admin/cs/faq')}
							disabled={createLoading || updateLoading}
						>
							Cancel
						</Button>
						<Button type="submit" variant="contained" disabled={createLoading || updateLoading}>
							{isEdit ? 'Update' : 'Create'}
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
};

export default withAdminLayout(FaqCreate);
