'use client';

import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle, LogOut, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MallListDTO {
    id: number;
    name: string;
    areaName: string;
    address: string;
}

export default function ShoppingMallManagerDashboard() {
    const router = useRouter();

    const [myMalls, setMyMalls] = useState<MallListDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMallId, setSelectedMallId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const loadMalls = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall/my-malls', {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to load malls');

            const data: MallListDTO[] = await res.json();
            setMyMalls(data);

            const savedId = localStorage.getItem('selectedMallId');
            if (savedId) {
                const id = parseInt(savedId);
                if (data.some(m => m.id === id)) {
                    await selectMall(id, false);
                }
            }
        } catch (err) {
            setError('Failed to load malls');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMalls();
    }, []);

    const selectMall = async (mallId: number, showMessage = true) => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shoppingMallId: mallId }),
                credentials: 'include',
            });

            if (res.ok) {
                setSelectedMallId(mallId);
                localStorage.setItem('selectedMallId', mallId.toString());

                if (showMessage) {
                    const mall = myMalls.find(m => m.id === mallId);
                    alert(`✅ Selected: ${mall?.name}`);
                }
            } else {
                alert('Failed to select mall');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error while selecting mall');
        }
    };

    const clearSelection = async () => {
        await fetch('http://localhost:8080/api/shopping-mall/clear-selection', {
            method: 'POST',
            credentials: 'include',
        });
        setSelectedMallId(null);
        localStorage.removeItem('selectedMallId');
    };

    const goToDashboard = () => {
        if (!selectedMallId) {
            alert("Please select a mall first!");
            return;
        }
        router.push('/ShoppingMallDashboard');   // Change path if needed
    };

    if (loading) return <div className="p-10 text-center">Loading your malls...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Manager Dashboard</h1>

                    <div className="flex gap-3">
                        {selectedMallId && (
                            <button
                                onClick={clearSelection}
                                className="flex items-center gap-2 px-5 py-3 border border-red-500 text-red-600 rounded-xl hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Clear Selection
                            </button>
                        )}

                        {selectedMallId && (
                            <button
                                onClick={goToDashboard}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                            >
                                Go to Shopping Mall Dashboard
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myMalls.length === 0 ? (
                        <div className="col-span-3 text-center py-20">
                            <Building2 size={60} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-xl text-gray-500">No shopping malls assigned yet.</p>
                        </div>
                    ) : (
                        myMalls.map(mall => (
                            <div
                                key={mall.id}
                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                                    selectedMallId === mall.id
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => selectMall(mall.id)}
                            >
                                <h3 className="font-bold text-xl">{mall.name}</h3>
                                <p className="text-emerald-600">{mall.areaName}</p>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{mall.address}</p>

                                <button className={`mt-6 w-full py-3 rounded-xl font-medium ${
                                    selectedMallId === mall.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}>
                                    {selectedMallId === mall.id ? '✅ Currently Active' : 'Select Mall'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}