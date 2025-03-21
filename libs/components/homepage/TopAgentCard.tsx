import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface TopAgentProps {
	agent: Member;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const [isHovered, setIsHovered] = useState(false);
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const handleCardClick = () => {
		if (agent?._id) {
			router.push({
				pathname: '/agent/detail',
				query: { agentId: agent._id },
			});
		}
	};

	return (
		<Stack className="top-agent-card" onClick={handleCardClick}>
			<div
				className="agent-image-container"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<img src={agentImage} alt={agent?.memberNick || 'Agent'} />

				{isHovered && (
					<div className="agent-hover-overlay">
						<div className="agent-hover-stats">
							<div className="stat-item">
								<span className="stat-value">{agent?.memberProducts || 0} Products</span>
							</div>
							<div className="stat-item">
								<span className="stat-value">{agent?.memberLikes || 0} Likes</span>
							</div>
							<div className="stat-item">
								<span className="stat-value">{agent?.memberViews || 0} Views</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="agent-info">
				<strong>{agent?.memberNick || 'Unknown Agent'}</strong>
				<span>{agent?.memberType || 'Agent'}</span>
			</div>
		</Stack>
	);
};

export default TopAgentCard;
