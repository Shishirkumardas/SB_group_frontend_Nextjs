'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';   // ← Added this

interface ShoppingMallCustomerFormDTO {
    customerName: string;
    phoneNumber: string;
    nid: string;
    areaID: number;
}

interface Area {
    id: number;
    name: string;
}

const ShoppingMallRegister = () => {
    const router = useRouter();   // ← Added this

    const [formData, setFormData] = useState<ShoppingMallCustomerFormDTO>({
        customerName: '',
        phoneNumber: '',
        nid: '',
        areaID: 0,
    });

    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [customerName, setCustomerName] = useState('');

    // Fetch Areas on load
    useEffect(() => {
        fetch('http://localhost:8080/api/areas')
            .then(res => res.json())
            .then(setAreas)
            .catch(err => console.error("Failed to load areas", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'areaID' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.areaID) {
            alert("Please select an Area");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/shopping-mall-customer/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setCustomerName(formData.customerName);
                setSubmitted(true);
            } else {
                alert('❌ Failed to submit registration');
            }
        } catch (error) {
            alert('❌ Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ customerName: '', phoneNumber: '', nid: '', areaID: 0 });
        setSubmitted(false);
    };

    const goToCustomerData = () => {
        router.push('/shopping-mall-customer');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-green-800 text-white py-6 shadow-lg">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 relative">
                            <Image src="/sb-logo.png" alt="Shuvo Bangla Group" fill className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Shuvo Bangla Group</h1>
                            <p className="text-sm opacity-90">Shopping Mall Customer Registration</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto mt-12 px-6 pb-12">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-red-600 text-white py-10 text-center">
                        <h2 className="text-4xl font-bold mb-2">Customer Registration</h2>
                        <p className="text-lg opacity-90">Join the SB Group Shopping Mall Family</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Full Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-600 text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-600 text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">NID Number</label>
                                <input
                                    type="text"
                                    name="nid"
                                    value={formData.nid}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-600 text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Area *</label>
                                <select
                                    name="areaID"
                                    required
                                    value={formData.areaID}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-600 text-lg"
                                >
                                    <option value={0}>-- Select Area --</option>
                                    {areas.map(area => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-800 hover:bg-green-900 text-white py-5 rounded-2xl text-xl font-semibold transition disabled:opacity-70"
                            >
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-5xl">
                                ✅
                            </div>
                            <h2 className="text-3xl font-bold text-green-800 mb-3">Registration Successful!</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Welcome, <span className="font-semibold text-green-700">{customerName}</span>!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={resetForm}
                                    className="bg-green-800 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-green-900 transition"
                                >
                                    Register Another Customer
                                </button>

                                {/* New Button Added */}
                                <button
                                    onClick={goToCustomerData}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-semibold transition"
                                >
                                    Customer Data Page
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingMallRegister;