// app/(dashboard)/rewards/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Shadcn UI Tabs
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Scan, List } from 'lucide-react';

import BarcodeScanner from '@/components/rewards/BarcodeScanner';
import IssueRewardCardForm from '@/components/rewards/IssueRewardCardForm';
import RewardCardDisplay from '@/components/rewards/RewardCardDisplay';
import AddPointsForm from '@/components/rewards/AddPointsForm';
import RedeemPointsForm from '@/components/rewards/RedeemPointsForm';
import AllRewardCardsList from '@/components/rewards/AllRewardCardsList';

import type { RewardCard, RewardTransaction } from '@/type/reward';

export default function RewardsPage() {
    const [activeTab, setActiveTab] = useState<'scanner' | 'all-cards'>('scanner');
    const [scannedCard, setScannedCard] = useState<RewardCard | null>(null);
    const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddPoints, setShowAddPoints] = useState(false);
    const [showRedeem, setShowRedeem] = useState(false);

    const API_URL = 'http://localhost:8080/api/rewards';
    const router = useRouter();

    const fetchCardById = async (cardId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${cardId}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Card not found');

            const card: RewardCard = await res.json();
            setScannedCard(card);

            const txRes = await fetch(`${API_URL}/${cardId}/transactions`, { credentials: 'include' });
            if (txRes.ok) setTransactions(await txRes.json());
        } catch (err) {
            alert('❌ Reward card not found or inactive');
            setScannedCard(null);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (result: string) => {
        const trimmed = result.trim();
        if (trimmed) fetchCardById(trimmed);
    };

    const handleActionSuccess = () => {
        if (scannedCard?.id) fetchCardById(scannedCard.id);
        setShowAddPoints(false);
        setShowRedeem(false);
    };

    const deactivateCard = async () => {
        if (!scannedCard) return;
        if (!confirm('Deactivate this reward card permanently?')) return;

        try {
            await fetch(`${API_URL}/${scannedCard.id}/deactivate`, {
                method: 'PUT',
                credentials: 'include',
            });
            alert('✅ Card deactivated successfully');
            setScannedCard(null);
            setTransactions([]);
        } catch {
            alert('Failed to deactivate card');
        }
    };

    const parseDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-emerald-800 tracking-tight">🎟️ SB Mall Reward System</h1>
                    <p className="text-emerald-700 mt-3 text-lg">Manage customer loyalty points with expiry</p>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'scanner' | 'all-cards')}>
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 bg-white shadow-lg">
                        <TabsTrigger value="scanner" className="flex items-center gap-2 py-3">
                            <Scan size={20} /> Scan Card
                        </TabsTrigger>
                        <TabsTrigger value="all-cards" className="flex items-center gap-2 py-3">
                            <List size={20} /> All Cards
                        </TabsTrigger>
                    </TabsList>

                    {/* Scanner Tab */}
                    <TabsContent value="scanner" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 space-y-8">
                                <IssueRewardCardForm onSuccess={() => {}} />

                                <Card className="shadow-2xl border-emerald-100">
                                    <CardContent className="p-8">
                                        <h2 className="text-xl font-semibold text-emerald-800 mb-4">📸 Scan Reward Card</h2>
                                        <BarcodeScanner onScan={handleScan} />
                                        <p className="text-center text-sm text-emerald-600 mt-4">
                                            Point your camera at the barcode on the physical card
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-7">
                                {loading && (
                                    <Card className="shadow-2xl">
                                        <CardContent className="p-16 text-center">
                                            <Loader2 className="mx-auto animate-spin text-emerald-600" size={50} />
                                            <p className="mt-4 text-emerald-700">Loading card information...</p>
                                        </CardContent>
                                    </Card>
                                )}

                                {scannedCard && (
                                    <>
                                        <RewardCardDisplay card={scannedCard} />

                                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <button
                                                onClick={() => setShowAddPoints(true)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
                                            >
                                                ➕ Add Points
                                            </button>
                                            <button
                                                onClick={() => setShowRedeem(true)}
                                                className="bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
                                            >
                                                💰 Redeem
                                            </button>
                                            <button
                                                onClick={deactivateCard}
                                                className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium"
                                            >
                                                Deactivate Card
                                            </button>
                                            <button
                                                onClick={() => router.push(`/cashback/${scannedCard.customer.id}`)}
                                                className="bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-medium"
                                            >
                                                💸 Cashback
                                            </button>
                                        </div>

                                        {/* Transaction History */}
                                        <div className="mt-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
                                            <div className="px-8 py-5 bg-emerald-700 text-white font-semibold">Transaction History</div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-emerald-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left">Date</th>
                                                        <th className="px-6 py-4 text-left">Description</th>
                                                        <th className="px-6 py-4 text-right">Points</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                    {transactions.map((tx) => (
                                                        <tr key={tx.id} className="hover:bg-emerald-50">
                                                            <td className="px-6 py-4 text-sm text-gray-600">{parseDate(tx.timestamp)}</td>
                                                            <td className="px-6 py-4 text-sm">{tx.description}</td>
                                                            <td className={`px-6 py-4 text-right font-semibold ${tx.pointsEarned >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                {tx.pointsEarned >= 0 ? '+' : ''}{tx.pointsEarned}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!scannedCard && !loading && (
                                    <Card className="shadow-2xl border-emerald-100">
                                        <CardContent className="p-20 text-center text-emerald-600">
                                            Scan a card to view details and manage points
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* All Cards Tab */}
                    <TabsContent value="all-cards" className="mt-0">
                        <AllRewardCardsList />
                    </TabsContent>
                </Tabs>

                {/* Modals */}
                {scannedCard && showAddPoints && (
                    <AddPointsForm
                        cardId={scannedCard.id}
                        currentPoints={scannedCard.totalPoints}
                        onClose={() => setShowAddPoints(false)}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {scannedCard && showRedeem && (
                    <RedeemPointsForm
                        cardId={scannedCard.id}
                        currentPoints={scannedCard.totalPoints}
                        onClose={() => setShowRedeem(false)}
                        onSuccess={handleActionSuccess}
                    />
                )}
            </div>
        </div>
    );
}