'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../src/store/authStore';
import { ordersApi, paymentsApi } from '../../../src/lib/api';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [order, setOrder] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrderDetails();
        } else {
            router.push('/login');
            return;
        }
    }, [user, id, router]);

    const loadOrderDetails = async () => {
        try {
            const [orderRes, paymentRes] = await Promise.all([
                ordersApi.getOne(id),
                paymentsApi.getStatus(id),
            ]);

            setOrder(orderRes.data);
            setPaymentStatus(paymentRes.data);
        } catch (error) {
            console.error('Error loading order:', error);
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Commande non trouvée</h2>
                    <Link href="/" className="text-blue-600 hover:text-blue-700">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusIcon = () => {
        if (paymentStatus?.paymentStatus === 'SUCCEEDED') {
            return <CheckCircle className="text-green-600" size={64} />;
        } else if (paymentStatus?.paymentStatus === 'FAILED') {
            return <XCircle className="text-red-600" size={64} />;
        }
        return <Clock className="text-yellow-600" size={64} />;
    };

    const getStatusText = () => {
        if (paymentStatus?.paymentStatus === 'SUCCEEDED') {
            return {
                title: 'Paiement réussi !',
                description: 'Votre commande a été confirmée',
                color: 'text-green-600',
            };
        } else if (paymentStatus?.paymentStatus === 'FAILED') {
            return {
                title: 'Paiement échoué',
                description: 'Veuillez réessayer',
                color: 'text-red-600',
            };
        }
        return {
            title: 'Paiement en attente',
            description: 'Traitement en cours...',
            color: 'text-yellow-600',
        };
    };

    const status = getStatusText();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Détails de la commande</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Status */}
                <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {getStatusIcon()}
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${status.color}`}>
                        {status.title}
                    </h2>
                    <p className="text-gray-600">{status.description}</p>
                    <p className="text-sm text-gray-500 mt-4">
                        Commande #{order.id.slice(0, 8)}
                    </p>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Articles commandés</h3>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between border-b pb-4">
                                <div>
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.color} - {item.size} x {item.quantity}
                                    </p>
                                </div>
                                <p className="font-semibold">
                                    {((item.price * item.quantity) / 100).toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xl font-bold mt-6 pt-4 border-t">
                        <span>Total</span>
                        <span className="text-blue-600">
              {(order.totalAmount / 100).toFixed(2)} €
            </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                    >
                        Continuer mes achats
                    </Link>
                </div>
            </main>
        </div>
    );
}