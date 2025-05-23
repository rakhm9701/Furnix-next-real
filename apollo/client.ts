import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject, makeVar } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// WebSocket obyektini saqlash uchun global o'zgaruvchi
let globalWebSocket: WebSocket | null = null;

// WebSocket holatini saqlash uchun reaktiv o'zgaruvchi
export const socketStatusVar = makeVar<string>('disconnected'); // "connected", "disconnected", "error"

// WebSocketga kirish uchun funksiya
export function getWebSocket(): WebSocket | null {
	return globalWebSocket;
}

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

// Create WebSocket client
class LoggingWebSocket {
	private socket: WebSocket;

	constructor(url: string) {
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		// WebSocket obyektiga global kirish imkoniyatini yarating
		globalWebSocket = this.socket;

		this.socket.onopen = () => {
			console.log(`WebSocket connection!`);
			socketStatusVar('connected');
		};

		this.socket.onmessage = (msg) => {
			console.log(`===WebSocket message====:`, msg.data);
		};

		this.socket.onerror = (error) => {
			console.log(`WebSocket, error:`, error);
			socketStatusVar('error');
		};

		this.socket.onclose = () => {
			socketStatusVar('disconnected');
		};
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}

	close() {
		this.socket.close();
		globalWebSocket = null;
		socketStatusVar('disconnected');
	}
}

export function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			console.warn('requesting.. ', operation);
			return forward(operation);
		});

		// @ts-ignore
		const link = new createUploadLink({
			uri: process.env.REACT_APP_API_GRAPHQL_URL ?? 'http://147.93.103.154:5001/graphql',
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsLink = new WebSocketLink({
			uri: process.env.REACT_APP_API_WS ?? 'ws://147.93.103.154:5001',
			options: {
				reconnect: false,
				timeout: 30000,
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket,
		});

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if (!message.includes('input')) sweetErrorAlert(message);
				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache({
			// Bu yerda typePolicies qo'shish mumkin, agar kerak bo'lsa
			typePolicies: {
				// Muayyan typlar uchun maxsus qo'llanmalar
			},
		}),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3007/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/
