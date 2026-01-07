'use client';

import { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import {Header} from "../../../components/Header";
import {Footer} from "../../../components/Footer";



export default function CartPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { items, totalAmount, totalItems, isLoading, fetchCart, updateItem, removeItem } = useCartStore();

    // Au début du fichier, après les imports
    return (
        <>
            <Header />
            <div className="min-h-screen bg-white">
                {/* Tout votre code existant */}
            </div>
            <Footer />
        </>
    );

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchCart();
    }, [user, fetchCart, router]);

    const handleUpdateQuantity = async (itemId: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        try {
            await updateItem(itemId, newQuantity);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const handleRemove = async (itemId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            try {
                await removeItem(itemId);
            } catch (error: any) {
                alert(error.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (!user) {
        return null;
    }

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
                        <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
                        <p className="text-gray-600 mb-6">
                            Découvrez nos produits et ajoutez-les à votre panier
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Voir les produits
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg relative flex-shrink-0 overflow-hidden">
                                        {item.variant.images?.[0] || item.variant.product?.images?.[0] ? (
                                            <Image
                                                src={item.variant.images?.[0]?.url || item.variant.product?.images?.[0]?.url}
                                                alt={item.variant.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                Pas d'image
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            {item.variant.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {item.variant.color} - {item.variant.size}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            SKU: {item.variant.sku}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                            {(item.variant.product.price / 100).toFixed(2)} €
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="text-red-600 hover:text-red-700 p-2"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                disabled={item.quantity <= 1}
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                disabled={item.quantity >= item.variant.stock}
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <p className="text-sm font-bold">
                                            {((item.variant.product.price * item.quantity) / 100).toFixed(2)} €
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h2 className="text-xl font-bold mb-4">Résumé</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Articles ({totalItems})</span>
                                        <span className="font-semibold">
                      {(totalAmount / 100).toFixed(2)} €
                    </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Livraison</span>
                                        <span className="font-semibold text-green-600">Gratuite</span>
                                    </div>

                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-blue-600">
                        {(totalAmount / 100).toFixed(2)} €
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Passer la commande
                                </button>

                                <Link
                                    href="/"
                                    className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                                >
                                    Continuer mes achats
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}