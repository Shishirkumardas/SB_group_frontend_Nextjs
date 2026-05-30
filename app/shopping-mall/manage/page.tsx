'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2, LogOut, UserPlus } from 'lucide-react';

interface ShoppingMall {
    id: number;
    name: string;
    areaName: string;
    address: string;
    phone: string;
    email: string;
    totalShops?: number;
    isActive: boolean;
}

interface MallListDTO {
    id: number;
    name: string;
    areaName: string;
    address: string;
}

export default function ShoppingMallManagement() {
    const [malls, setMalls] = useState<ShoppingMall[]>([]);
    const [myMalls, setMyMalls] = useState<MallListDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMallId, setSelectedMallId] = useState<number | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        areaName: '',
        address: '',
        phone: '',
        email: '',
        totalShops: '',
        isActive: true,
    });

    const [assignData, setAssignData] = useState({
        mallId: 0,
        email: ''
    });

    // Fetch functions
    const fetchAllMalls = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setMalls(data);
            }
        } catch (err) {
            console.error('Failed to fetch malls', err);
        }
    };

    const fetchMyMalls = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall/my-malls', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setMyMalls(data);
            }
        } catch (err) {
            console.error('Failed to fetch my malls', err);
        }
    };

    useEffect(() => {
        fetchAllMalls();
        fetchMyMalls();
        setLoading(false);
    }, []);

    const createMall = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (res.ok) {
                alert('✅ Shopping Mall Created Successfully!');
                setShowCreateModal(false);
                fetchAllMalls();
                setFormData({ name: '', areaName: '', address: '', phone: '', email: '', totalShops: '', isActive: true });
            } else {
                alert('Failed to create mall');
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                alert('✅ Mall Selected Successfully!');
            } else {
                alert('Not authorized for this mall');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Updated Assign Manager using Email (Query Parameter)
    const assignManager = async () => {
        if (!assignData.email.trim()) {
            alert("Please enter manager's email");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/shopping-mall/${assignData.mallId}/assign-manager?email=${encodeURIComponent(assignData.email)}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (res.ok) {
                alert('✅ Manager Assigned Successfully!');
                setShowAssignModal(false);
                setAssignData({ mallId: 0, email: '' });
            } else {
                const text = await res.text();
                alert(text || 'Failed to assign manager');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error');
        }
    };

    const clearSelection = async () => {
        await fetch('http://localhost:8080/api/shopping-mall/clear-selection', {
            method: 'POST',
            credentials: 'include',
        });
        setSelectedMallId(null);
        alert('Selection cleared');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Malls</h1>
                    <p className="text-gray-600 mt-1">Manage your shopping malls and assignments</p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-lg hover:bg-emerald-700 transition"
                >
                    <Plus size={20} />
                    New Shopping Mall
                </button>
            </div>

            {/* My Malls Section */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Building2 /> My Shopping Malls
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myMalls.map((mall) => (
                        <div
                            key={mall.id}
                            className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
                            onClick={() => selectMall(mall.id)}
                        >
                            <h3 className="font-semibold text-lg">{mall.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{mall.areaName}</p>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">{mall.address}</p>
                            <button className="mt-4 text-emerald-600 font-medium text-sm hover:underline">
                                Select This Mall →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Malls */}
            <div>
                <h2 className="text-xl font-semibold mb-4">All Shopping Malls</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {malls.map((mall) => (
                        <div key={mall.id} className="bg-white border rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between">
                                <h3 className="font-bold text-xl">{mall.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${mall.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {mall.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <p className="text-gray-600 mt-2">{mall.areaName}</p>
                            <p className="text-sm text-gray-500 mt-1">{mall.address}</p>
                            <p className="text-sm mt-2">📞 {mall.phone}</p>

                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => selectMall(mall.id)}
                                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
                                >
                                    Select Mall
                                </button>
                                <button
                                    onClick={() => {
                                        setAssignData({ mallId: mall.id, email: '' });
                                        setShowAssignModal(true);
                                    }}
                                    className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    Assign
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">Create New Shopping Mall</h2>

                        <input type="text" placeholder="Mall Name" className="w-full border p-3 rounded-lg mb-4" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                        <input type="text" placeholder="Area Name" className="w-full border p-3 rounded-lg mb-4" value={formData.areaName} onChange={(e) => setFormData({ ...formData, areaName: e.target.value })} />

                        <textarea placeholder="Full Address" className="w-full border p-3 rounded-lg mb-4 h-24" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Phone" className="border p-3 rounded-lg" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            <input type="email" placeholder="Email" className="border p-3 rounded-lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        <button onClick={createMall} className="w-full bg-emerald-600 text-white py-4 rounded-xl mt-6 font-semibold hover:bg-emerald-700">
                            Create Shopping Mall
                        </button>

                        <button onClick={() => setShowCreateModal(false)} className="w-full mt-3 text-gray-600 py-3">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Assign Manager Modal - Email Based */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Assign Manager</h2>
                        <p className="text-gray-600 mb-4">Enter Manager's Email</p>

                        <input
                            type="email"
                            placeholder="manager@example.com"
                            className="w-full p-3 border rounded-lg mb-6"
                            value={assignData.email}
                            onChange={(e) => setAssignData({ ...assignData, email: e.target.value })}
                        />

                        <button
                            onClick={assignManager}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700"
                        >
                            Assign Manager
                        </button>

                        <button
                            onClick={() => setShowAssignModal(false)}
                            className="w-full mt-3 text-gray-600 py-3"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}