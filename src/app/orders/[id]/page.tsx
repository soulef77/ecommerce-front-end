'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ordersApi, paymentsApi } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrderConfirmationPage({
                                                  params,
                                              }: {
    params: { id: string };
}) {
    const { id } = params;
    const router = useRouter();

    const user = useAuthStore((state) => state.user);

    const [order, setOrder] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ⚡ Vérification simple du user
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadOrder();
    }, [user, id]);

    const loadOrder = async () => {
        try {
            const [orderRes, paymentRes] = await Promise.all([
                ordersApi.getOne(id),
                paymentsApi.getStatus(id),
            ]);
            setOrder(orderRes.data);
            setPaymentStatus(paymentRes.data);
        } catch (err) {
            console.error('Erreur chargement commande:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Commande introuvable</h2>
                    <Link href="/" className="text-blue-600 hover:text-blue-700">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusIcon = () => {
        if (paymentStatus?.paymentStatus === 'SUCCEEDED') return <CheckCircle size={64} className="text-green-600" />;
        if (paymentStatus?.paymentStatus === 'FAILED') return <XCircle size={64} className="text-red-600" />;
        return <Clock size={64} className="text-yellow-600" />;
    };

    const getStatusText = () => {
        if (paymentStatus?.paymentStatus === 'SUCCEEDED')
            return { title: 'Paiement réussi !', description: 'Votre commande est confirmée', color: 'text-green-600' };
        if (paymentStatus?.paymentStatus === 'FAILED')
            return { title: 'Paiement échoué', description: 'Veuillez réessayer', color: 'text-red-600' };
        return { title: 'Paiement en attente', description: 'Traitement en cours...', color: 'text-yellow-600' };
    };

    const status = getStatusText();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Confirmation de commande</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Statut paiement */}
                <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
                    <div className="flex justify-center mb-4">{getStatusIcon()}</div>
                    <h2 className={`text-2xl font-bold mb-2 ${status.color}`}>{status.title}</h2>
                    <p className="text-gray-600">{status.description}</p>
                    <p className="text-sm text-gray-500 mt-4">Commande #{order.id.slice(0, 8)}</p>
                </div>

                {/* Articles commandés */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Articles</h3>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between border-b pb-4">
                                <div>
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-sm text-gray-600">{item.color} - {item.size} x {item.quantity}</p>
                                </div>
                                <p className="font-semibold">{((item.price * item.quantity) / 100).toFixed(2)} €</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xl font-bold mt-6 pt-4 border-t">
                        <span>Total</span>
                        <span className="text-blue-600">{(order.totalAmount / 100).toFixed(2)} €</span>
                    </div>
                </div>

                {/* Retour */}
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
