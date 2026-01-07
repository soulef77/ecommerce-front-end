'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../../src/store/cartStore';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'next/navigation';
import { ordersApi, paymentsApi } from '../../src/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialisez Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, orderId }: { clientSecret: string; orderId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders/${orderId}`,
                },
            });

            if (error) {
                setErrorMessage(error.message || 'Une erreur est survenue');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Une erreur est survenue');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Traitement...' : 'Payer'}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { items, totalAmount, clearCart } = useCartStore();

    const [orderId, setOrderId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        createOrderAndPaymentIntent();
    }, [user, items, router]);

    const createOrderAndPaymentIntent = async () => {
        try {
            // 1. Créer la commande
            const orderResponse = await ordersApi.create();
            const newOrderId = orderResponse.data.id;
            setOrderId(newOrderId);

            // 2. Créer le PaymentIntent
            const paymentResponse = await paymentsApi.createIntent(newOrderId);
            setClientSecret(paymentResponse.data.clientSecret);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la commande');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Préparation du paiement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Erreur</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/cart')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Retour au panier
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Résumé de la commande */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>

                        <div className="space-y-3 mb-6">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.variant.product.name} ({item.variant.color} - {item.variant.size}) x{item.quantity}
                  </span>
                                    <span className="font-semibold">
                    {((item.variant.product.price * item.quantity) / 100).toFixed(2)} €
                  </span>
                                </div>
                            ))}

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">
                    {(totalAmount / 100).toFixed(2)} €
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            <strong>Mode test :</strong> Utilisez la carte 4242 4242 4242 4242
                        </div>
                    </div>

                    {/* Formulaire de paiement */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Informations de paiement</h2>

                        {clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                    },
                                }}
                            >
                                <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
                            </Elements>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}