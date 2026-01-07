'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import { useAuthStore } from '../src/store/authStore';
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
        <head>
            <title>BAZA - Élégance Khaleeji</title>
            <meta name="description" content="Découvrez l'authentique élégance du style khaleeji avec Baza" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen">
                {children}
            </div>
        </QueryClientProvider>
        </body>
        </html>
    );
}