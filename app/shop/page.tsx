'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import {Header} from 'components/Header';
import {Footer} from 'components/Footer';
import SearchBar from '@/components/SearchBar';
import Filters, { FilterState } from '@/components/Filters';

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        categoryId: '',
        minPrice: 0,
        maxPrice: 10000,
        sortBy: 'name',
    });

    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await productsApi.getAll();
            return response.data;
        },
    });

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
    });

    // Filtrer et trier les produits
    const filteredProducts = products
        ?.filter((product: any) => {
            // Recherche par nom
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Filtre par catégorie
            if (filters.categoryId) {
                const hasCategory = product.categories?.some((cat: any) => cat.id === filters.categoryId);
                if (!hasCategory) return false;
            }

            // Filtre par prix (prix en centimes)
            const priceInEuros = product.price / 100;
            if (priceInEuros < filters.minPrice || priceInEuros > filters.maxPrice) {
                return false;
            }

            return true;
        })
        ?.sort((a: any, b: any) => {
            switch (filters.sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    if (productsLoading || categoriesLoading) {
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
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header de la page */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif font-semibold text-[#2C1810] mb-4">
                            Boutique
                        </h1>
                        <p className="text-gray-600">
                            Découvrez notre collection complète
                        </p>
                    </div>

                    {/* Barre de recherche */}
                    <div className="mb-6">
                        <SearchBar
                            onSearch={setSearchQuery}
                            placeholder="Rechercher un produit..."
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filtres */}
                        <div className="lg:col-span-1">
                            <Filters
                                categories={categories || []}
                                onFilterChange={setFilters}
                            />
                        </div>

                        {/* Grille de produits */}
                        <div className="lg:col-span-3">
                            {/* Résultats */}
                            <div className="mb-6 flex justify-between items-center">
                                <p className="text-gray-600">
                                    {filteredProducts?.length || 0} produit{filteredProducts?.length > 1 ? 's' : ''}
                                </p>
                            </div>

                            {filteredProducts?.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-serif text-[#2C1810] mb-2">
                                        Aucun produit trouvé
                                    </h3>
                                    <p className="text-gray-600">
                                        Essayez de modifier vos filtres
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                    {filteredProducts?.map((product: any) => (
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
                                                            <div className="text-gray-300 text-9xl">👗</div>
                                                        </div>
                                                    )}
                                                </div>
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
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}