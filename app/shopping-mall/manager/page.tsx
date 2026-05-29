'use client';

import { useState, useEffect } from 'react';
import { Building2, LogIn, CheckCircle, LogOut } from 'lucide-react';

interface MallListDTO {
    id: number;
    name: string;
    areaName: string;
    address: string;
}

export default function ShoppingMallManagerDashboard() {
    const [myMalls, setMyMalls] = useState<MallListDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMallId, setSelectedMallId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const fetchMyMalls = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall/my-malls', {
                credentials: 'include',
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setError("You don't have permission to access this page.");
                } else {
                    setError(`Error: ${res.status}`);
                }
                return;
            }

            const data = await res.json();
            setMyMalls(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load your assigned malls');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyMalls();
    }, []);

    const selectMall = async (mallId: number) => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shoppingMallId: mallId }),
                credentials: 'include',
            });

            if (res.ok) {
                setSelectedMallId(mallId);
                alert(`✅ Successfully switched to ${myMalls.find(m => m.id === mallId)?.name}`);
                // Optional: Redirect to dashboard
                // window.location.href = '/shopping-mall/dashboard';
            } else {
                alert('Failed to select this mall. You may not have access.');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error');
        }
    };

    const clearSelection = async () => {
        try {
            await fetch('http://localhost:8080/api/shopping-mall/clear-selection', {
                method: 'POST',
                credentials: 'include',
            });
            setSelectedMallId(null);
            alert('Current mall selection cleared');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-lg">Loading your malls...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Manager Dashboard</h1>
                        <p className="text-gray-600 mt-2">Select a shopping mall to manage</p>
                    </div>

                    {selectedMallId && (
                        <button
                            onClick={clearSelection}
                            className="flex items-center gap-2 px-5 py-3 border border-red-500 text-red-600 rounded-xl hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            Clear Selection
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myMalls.length === 0 ? (
                        <div className="col-span-3 text-center py-20">
                            <Building2 size={60} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-xl text-gray-500">No shopping malls assigned to you yet.</p>
                            <p className="text-gray-400 mt-2">Contact Admin to get assigned.</p>
                        </div>
                    ) : (
                        myMalls.map((mall) => (
                            <div
                                key={mall.id}
                                className={`bg-white border-2 rounded-2xl p-7 transition-all hover:shadow-xl cursor-pointer ${
                                    selectedMallId === mall.id ? 'border-emerald-500 shadow-xl' : 'border-gray-200'
                                }`}
                                onClick={() => selectMall(mall.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-2xl">{mall.name}</h3>
                                        <p className="text-emerald-600 font-medium">{mall.areaName}</p>
                                    </div>
                                    {selectedMallId === mall.id && (
                                        <CheckCircle className="text-emerald-600" size={28} />
                                    )}
                                </div>

                                <p className="text-gray-600 mt-4 line-clamp-3">{mall.address}</p>

                                <button
                                    className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg transition ${
                                        selectedMallId === mall.id
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {selectedMallId === mall.id ? 'Currently Selected' : 'Select Mall'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}