import React, {  useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { GET_AGENTS } from '../../../apollo/admin/query';
import { useQuery } from '@apollo/client';
import Link from 'next/link';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				...initialInput,
				limit: 4,
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Agents data:', data);
			const agents = data?.getAgents?.list || [];
			setTopAgents(agents.slice(0, 4));
		},
	});

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Agents</span>
					</Stack>
					<Stack className={'wrapper'}>
						<div className={'top-agents-grid'}>
							{topAgents.map((agent: Member) => (
								<TopAgentCard key={agent?._id} agent={agent} />
							))}
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Our Best Agents</span>
							<p>Our Agents are always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/agent'}>
									<span>See all agents</span>
									<img src="/img/icons/rightup.svg" alt="" />
								</Link>
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<div className={'top-agents-grid'}>
							{topAgents.map((agent: Member) => (
								<TopAgentCard key={agent?._id} agent={agent} />
							))}
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
