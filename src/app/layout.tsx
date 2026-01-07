'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <html lang="fr">
        <body>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        </body>
        </html>
    );
}