'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../../lib/api';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const user = useAuthStore((state) => state.user);
    const addItem = useCartStore((state) => state.addItem);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', params.id],
        queryFn: async () => {
            const response = await productsApi.getOne(params.id);
            // Sélectionner la première variante par défaut
            if (response.data.variants?.length > 0) {
                setSelectedVariant(response.data.variants[0]);
            }
            return response.data;
        },
    });

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!selectedVariant) {
            alert('Veuillez sélectionner une variante');
            return;
        }

        setIsAdding(true);
        try {
            await addItem(selectedVariant.id, quantity);
            alert('Produit ajouté au panier !');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors de l\'ajout au panier');
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
                    <Link href="/" className="text-blue-600 hover:text-blue-700">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-blue-600 hover:text-blue-700">
                        ← Retour aux produits
                    </Link>
                </div>
            </header>

            {/* Product Detail */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Images */}
                    <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
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

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-4xl font-bold text-blue-600">
                                {(product.price / 100).toFixed(2)} €
                            </p>
                        </div>

                        <p className="text-gray-600">{product.description}</p>

                        {/* Variants */}
                        {product.variants?.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Couleur et Taille
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.variants.map((variant: any) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`p-3 border rounded-lg text-left ${
                                                    selectedVariant?.id === variant.id
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <div className="font-medium">{variant.color} - {variant.size}</div>
                                                <div className="text-sm text-gray-600">
                                                    {variant.stock > 0 ? `${variant.stock} en stock` : 'Épuisé'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantité
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedVariant?.stock || 1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || !selectedVariant || selectedVariant.stock === 0}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isAdding
                                ? 'Ajout en cours...'
                                : selectedVariant?.stock === 0
                                    ? 'Épuisé'
                                    : 'Ajouter au panier'}
                        </button>

                        {/* Categories */}
                        {product.categories?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories</h3>
                                <div className="flex gap-2">
                                    {product.categories.map((category: any) => (
                                        <span
                                            key={category.id}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                      {category.name}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}