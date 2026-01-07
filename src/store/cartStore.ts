import { create } from 'zustand';
import { cartApi } from '../lib/api';

interface CartItem {
    id: string;
    quantity: number;
    variant: never;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    updateItem: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    totalAmount: 0,
    totalItems: 0,
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const response = await cartApi.get();
            set({
                items: response.data.items,
                totalAmount: response.data.totalAmount,
                totalItems: response.data.totalItems,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    addItem: async (variantId: string, quantity: number) => {
        await cartApi.addItem(variantId, quantity);
        // Rafraîchir le panier
        const response = await cartApi.get();
        set({
            items: response.data.items,
            totalAmount: response.data.totalAmount,
            totalItems: response.data.totalItems,
        });
    },

    updateItem: async (itemId: string, quantity: number) => {
        await cartApi.updateItem(itemId, quantity);
        const response = await cartApi.get();
        set({
            items: response.data.items,
            totalAmount: response.data.totalAmount,
            totalItems: response.data.totalItems,
        });
    },

    removeItem: async (itemId: string) => {
        await cartApi.removeItem(itemId);
        const response = await cartApi.get();
        set({
            items: response.data.items,
            totalAmount: response.data.totalAmount,
            totalItems: response.data.totalItems,
        });
    },

    clearCart: async () => {
        await cartApi.clear();
        set({ items: [], totalAmount: 0, totalItems: 0 });
    },
}));