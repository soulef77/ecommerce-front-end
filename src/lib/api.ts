import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth
export const authApi = {
    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }),

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },

    getProfile: () => api.get('/auth/profile'),
};

// Products
export const productsApi = {
    getAll: () => api.get('/products'),
    getOne: (id: string) => api.get(`/products/${id}`),
};

// Categories
export const categoriesApi = {
    getAll: () => api.get('/categories'),
    getOne: (id: string) => api.get(`/categories/${id}`),
    getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
};

// Cart
export const cartApi = {
    get: () => api.get('/cart'),
    addItem: (variantId: string, quantity: number) =>
        api.post('/cart/items', { variantId, quantity }),
    updateItem: (itemId: string, quantity: number) =>
        api.patch(`/cart/items/${itemId}`, { quantity }),
    removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    clear: () => api.delete('/cart'),
};

// Orders
export const ordersApi = {
    getAll: () => api.get('/orders'),
    getOne: (id: string) => api.get(`/orders/${id}`),
    create: () => api.post('/orders'),
};

// Payments
export const paymentsApi = {
    createIntent: (orderId: string) =>
        api.post('/payments/create-payment-intent', { orderId }),
    getStatus: (orderId: string) => api.get(`/payments/status/${orderId}`),
};

export default api;