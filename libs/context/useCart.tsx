import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../types/product/product';
import { sweetTopSmallSuccessAlert } from '../sweetAlert';

interface CartItem extends Product {
	quantity: number;
	selectedSize?: string;
}

interface CartState {
	items: CartItem[];
	total: number;
	itemCount: number;
}

interface CartContextType {
	state: CartState;
	addToCart: (product: Product, quantity?: number, size?: string) => void;
	removeFromCart: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
	| { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string } }
	| { type: 'REMOVE_ITEM'; payload: string }
	| { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
	| { type: 'CLEAR_CART' }
	| { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
	switch (action.type) {
		case 'ADD_ITEM': {
			const { product, quantity, size } = action.payload;
			const cartItem: CartItem = {
				...product,
				quantity,
				selectedSize: size,
			};

			const existingItemIndex = state.items.findIndex((item) => item._id === product._id && item.selectedSize === size);

			let newItems;
			if (existingItemIndex > -1) {
				newItems = state.items.map((item, index) =>
					index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
				);
			} else {
				newItems = [...state.items, cartItem];
			}

			const newState = {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
				itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
			};

			localStorage.setItem('cart', JSON.stringify(newItems));
			return newState;
		}

		case 'REMOVE_ITEM': {
			const newItems = state.items.filter((item) => item._id !== action.payload);
			const newState = {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
				itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
			};

			localStorage.setItem('cart', JSON.stringify(newItems));
			return newState;
		}

		case 'UPDATE_QUANTITY': {
			const newItems = state.items.map((item) =>
				item._id === action.payload.id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item,
			);

			const newState = {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
				itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
			};

			localStorage.setItem('cart', JSON.stringify(newItems));
			return newState;
		}

		case 'CLEAR_CART': {
			localStorage.removeItem('cart');
			return { items: [], total: 0, itemCount: 0 };
		}

		case 'LOAD_CART': {
			return {
				items: action.payload,
				total: action.payload.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
				itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
			};
		}

		default:
			return state;
	}
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, {
		items: [],
		total: 0,
		itemCount: 0,
	});

	useEffect(() => {
		const savedCart = localStorage.getItem('cart');
		if (savedCart) {
			dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
		}
	}, []);

	const addToCart = (product: Product, quantity = 1, size?: string) => {
		dispatch({
			type: 'ADD_ITEM',
			payload: { product, quantity, size },
		});
		sweetTopSmallSuccessAlert('Added to cart', 800);
	};

	const removeFromCart = (productId: string) => {
		dispatch({ type: 'REMOVE_ITEM', payload: productId });
	};

	const updateQuantity = (productId: string, quantity: number) => {
		dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
	};

	const clearCart = () => {
		dispatch({ type: 'CLEAR_CART' });
	};

	return (
		<CartContext.Provider
			value={{
				state,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};
