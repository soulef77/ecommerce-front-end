'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await productsApi.getAll();
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            E-Commerce
                        </h1>
                        <nav className="flex gap-4">
                            <Link href="/login" className="text-gray-600 hover:text-gray-900">
                                Connexion
                            </Link>
                            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                                Panier
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Nos Produits</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products?.map((product: any) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="aspect-square bg-gray-200 relative">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Pas d'image
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {(product.price / 100).toFixed(2)} €
                  </span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                        Voir
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}