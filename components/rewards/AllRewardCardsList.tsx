// src/components/rewards/AllRewardCardsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RewardCard {
    id: string;
    cardNumber: string;
    totalPoints: number;
    issuedAt: string;
    isActive: boolean;
    customer: {
        id: string;
        name: string;           // MasterData name
        phone: string;
    };
}

export default function AllRewardCardsList() {
    const [cards, setCards] = useState<RewardCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const fetchAllCards = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/rewards/all', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setCards(data);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load reward cards");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCards();
    }, []);

    const filteredCards = cards.filter(card =>
        card.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
        card.customer.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">All Reward Cards</h2>
                <input
                    type="text"
                    placeholder="Search by card number or customer name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-emerald-300 rounded-2xl px-5 py-3 w-96 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" size={48} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-emerald-700 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Card Number</th>
                            <th className="px-6 py-4 text-left">Customer</th>
                            <th className="px-6 py-4 text-center">Phone</th>
                            <th className="px-6 py-4 text-center">Points</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {filteredCards.map((card) => (
                            <tr key={card.id} className="hover:bg-emerald-50">
                                <td className="px-6 py-5 font-mono text-emerald-700">{card.cardNumber}</td>
                                <td className="px-6 py-5 font-medium">{card.customer.name}</td>
                                <td className="px-6 py-5 text-center">{card.customer.phone}</td>
                                <td className="px-6 py-5 text-center font-bold text-lg text-emerald-600">
                                    {card.totalPoints}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {card.isActive ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Active</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center flex justify-center gap-3">
                                    <button
                                        onClick={() => router.push(`/rewards/view/${card.id}`)}
                                        className="p-2 hover:bg-emerald-100 rounded-xl text-emerald-600"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button className="p-2 hover:bg-red-100 rounded-xl text-red-600">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}