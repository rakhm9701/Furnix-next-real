import React, { useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_FAQS } from '../../../apollo/admin/query';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [expandedId, setExpandedId] = useState<string>('');

	const { data: faqData, loading } = useQuery(GET_FAQS, {
		variables: {
			filter: {
				status: 'ACTIVE',
			},
			page: 1,
			limit: 100,
		},
	});

	const handleChange = (panelId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandedId(isExpanded ? panelId : '');
	};

	if (device === 'mobile') {
		return <div className="faq-mobile">FAQ MOBILE</div>;
	} else {
		return (
			<div className="faq-content">
				<Box component="div" className="wrap">
					{loading ? (
						<div className="loading">Loading...</div>
					) : (
						faqData?.faqs?.items.map((faq: any) => (
							<Accordion key={faq.id} expanded={expandedId === faq.id} onChange={handleChange(faq.id)}>
								<AccordionSummary
									id={`panel-${faq.id}-header`}
									className="question"
									aria-controls={`panel-${faq.id}-content`}
								>
									<Typography className="badge" variant="h4">
										Q
									</Typography>
									<Typography>{faq.noticeTitle}</Typography>
								</AccordionSummary>
								{/* Only render AccordionDetails if this accordion is expanded */}
								{expandedId === faq.id && (
									<AccordionDetails>
										<div className="answer flex-box">
											<Typography className="badge" variant="h4" color="primary">
												A
											</Typography>
											<Typography>{faq.noticeContent}</Typography>
										</div>
									</AccordionDetails>
								)}
							</Accordion>
						))
					)}
				</Box>
			</div>
		);
	}
};

export default Faq;
