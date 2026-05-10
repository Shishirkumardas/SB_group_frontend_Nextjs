// app/(dashboard)/rewards/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { Card, CardContent } from '@/components/ui/card';

import {
    Loader2,
    ScanLine,
    List,
    Sparkles,
    Gift,
    Activity,
    CreditCard,
    TrendingUp,
} from 'lucide-react';

import BarcodeScanner from '@/components/rewards/BarcodeScanner';
import IssueRewardCardForm from '@/components/rewards/IssueRewardCardForm';
import AllRewardCardsList from '@/components/rewards/AllRewardCardsList';

export default function RewardsPage() {
    const [activeTab, setActiveTab] = useState<'scanner' | 'all-cards'>('scanner');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const API_URL = 'http://localhost:8080/api/rewards';

    // ========================================
    // SCAN HANDLER - AUTO REDIRECT
    // ========================================
    const handleScan = async (result: string) => {
        const trimmed = result.trim();
        if (!trimmed) return;

        setLoading(true);

        try {
            // Try by card number first
            const res = await fetch(`${API_URL}/number/${encodeURIComponent(trimmed)}`, {
                credentials: 'include',
            });

            if (res.ok) {
                const card = await res.json();
                router.push(`/rewards/view/${card.id}`);
                return;
            }

            // Fallback: try as card ID
            const res2 = await fetch(`${API_URL}/${trimmed}`, {
                credentials: 'include',
            });

            if (res2.ok) {
                router.push(`/rewards/view/${trimmed}`);
                return;
            }

            alert('❌ Reward card not found');
        } catch (err) {
            console.error(err);
            alert('❌ Failed to process scanned code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-100 p-4 md:p-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Hero Header - Kept your beautiful design */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-8 md:p-12 shadow-2xl mb-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur">
                                <Gift size={42} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                    SB Mall Reward System
                                </h1>
                                <p className="text-emerald-100 mt-2 text-lg md:text-xl">
                                    Modern loyalty management platform
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'scanner' | 'all-cards')}>
                    <TabsList className="grid grid-cols-2 w-full max-w-xl mx-auto mb-10 h-16 rounded-3xl bg-white shadow-2xl border">
                        <TabsTrigger value="scanner" className="rounded-3xl text-lg font-semibold flex items-center gap-3">
                            <ScanLine size={22} /> Scanner
                        </TabsTrigger>
                        <TabsTrigger value="all-cards" className="rounded-3xl text-lg font-semibold flex items-center gap-3">
                            <List size={22} /> All Cards
                        </TabsTrigger>
                    </TabsList>

                    {/* Scanner Tab */}
                    <TabsContent value="scanner">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            {/* Left Side */}
                            <div className="xl:col-span-4 space-y-8">
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                                    <IssueRewardCardForm onSuccess={() => {}} />
                                </div>

                                <Card className="rounded-[2rem] border-0 shadow-2xl bg-white/90 backdrop-blur">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-emerald-100 p-4 rounded-2xl">
                                                <ScanLine className="text-emerald-700" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-800">Smart Scanner</h2>
                                                <p className="text-slate-500">Barcode & QR Code Recognition</p>
                                            </div>
                                        </div>

                                        <BarcodeScanner onScan={handleScan} />

                                        {loading && (
                                            <div className="mt-6 text-center">
                                                <Loader2 className="animate-spin mx-auto text-emerald-600" size={40} />
                                                <p className="text-emerald-700 mt-3">Processing scanned code...</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Side - Empty State */}
                            <div className="xl:col-span-8">
                                <Card className="rounded-[2rem] border-0 shadow-2xl bg-white/80 backdrop-blur">
                                    <CardContent className="p-24 text-center">
                                        <div className="bg-emerald-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <ScanLine size={60} className="text-emerald-700" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800">Ready to Scan</h2>
                                        <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
                                            Scan a customer reward card to instantly view details, add points, redeem, or manage the card.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* All Cards Tab */}
                    <TabsContent value="all-cards">
                        <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 shadow-2xl">
                            <AllRewardCardsList />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}