import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Comment = () => {
	const device = useDeviceDetect();
	if (device === 'mobile') {
		return <Stack>Here is Comment for Miobile</Stack>;
	} else {
		return (
			<Stack className="comment-container">
				<Stack className={'comment-box'}>
					<Stack className={'left'}>
						<Typography className={'headline'}>Headline</Typography>
						<Box className={'content-box'}>
							<Typography>here is content</Typography>
							<span>Author</span>
						</Box>
						<Box className={'img-box'}>
							<img src="/img/fiber" alt="here img" />
							<span>price</span>
							<span>name</span>
						</Box>
					</Stack>
					<Stack className={'right'}></Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Comment;
