'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../src/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';

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
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C1810] mx-auto mb-4"></div>
                        <p className="text-[#2C1810] font-medium">Chargement...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-white">
                {/* Hero Section avec texte centré */}
                <section className="relative bg-gradient-to-b from-[#F5F1EA] to-white py-20">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#2C1810] mb-6 leading-tight">
                            Découvrez l'authentique élégance du style khaleeji avec Baza,
                            <br />
                            la première marque en France à l'incarner avec distinction.
                        </h1>
                    </div>
                </section>

                {/* Collection Palace */}
                <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif font-semibold text-[#2C1810] mb-12 text-center">
                        Collection Palace
                    </h2>

                    {/* Grille 2 colonnes comme la maquette */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {products?.map((product: any) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group"
                            >
                                <div className="space-y-4">
                                    {/* Image avec ratio 3:4 */}
                                    <div className="aspect-[3/4] bg-[#F5F1EA] relative overflow-hidden">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-gray-300 text-9xl">👗</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info produit - design minimaliste comme la maquette */}
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-serif text-[#2C1810] group-hover:text-[#8B6F47] transition">
                                            {product.name}
                                        </h3>
                                        <p className="text-lg font-medium text-[#2C1810]">
                                            {(product.price / 100).toFixed(0)} €
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Section Abayas (si vous avez une catégorie spécifique) */}
                <section className="bg-[#F5F1EA] py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-serif font-semibold text-[#2C1810] mb-4 text-center">
                            Abayas
                        </h2>
                        <p className="text-center text-gray-600 mb-12">
                            Découvrez notre collection d'abayas élégantes
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {products?.slice(0, 3).map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group"
                                >
                                    <div className="space-y-4">
                                        <div className="aspect-[3/4] bg-white relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                                    <div className="text-gray-300 text-9xl">👗</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-serif text-[#2C1810]">
                                                {product.name}
                                            </h3>
                                            <p className="text-lg font-medium text-[#2C1810]">
                                                {(product.price / 100).toFixed(0)} €
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Capes */}
                <section className="bg-white py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-serif font-semibold text-[#2C1810] mb-12 text-center">
                            Capes
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {products?.slice(3, 5).map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group"
                                >
                                    <div className="space-y-4">
                                        <div className="aspect-[3/4] bg-[#F5F1EA] relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="text-gray-300 text-9xl">🧥</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-serif text-[#2C1810]">
                                                {product.name}
                                            </h3>
                                            <p className="text-lg font-medium text-[#2C1810]">
                                                {(product.price / 100).toFixed(0)} €
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}