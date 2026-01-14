"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerFormPage() {
    const router = useRouter();

    const [areas, setAreas] = useState<any[]>([]);
    const [methods, setMethods] = useState<string[]>([]);

    const [form, setForm] = useState({
        customerName: "",
        areaID: "",
        phoneNumber: "",
        nid: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/areas")
            .then(res => res.json())
            .then(setAreas);

        fetch("http://localhost:8080/api/customer/payment-methods")
            .then(res => res.json())
            .then(setMethods);
    }, []);

    const submit = async () => {
        const response = await fetch("http://localhost:8080/api/customer/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "sbgroup-super-secret-key-1234567890-sbgroup"
            },
            body: JSON.stringify({
                customerName: form.customerName,
                areaID: Number(form.areaID),
                phoneNumber: form.phoneNumber,
                nid: form.nid,
                amount: Number(form.amount),
                paymentDate: form.paymentDate,
                paymentMethod: form.paymentMethod,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const customerId = data.id;

            await fetch(`http://localhost:8080/api/customer/pay/${customerId}`, {
                method: "POST",
            });

            router.push(`/customer/pay/${customerId}`);
        } else {
            alert("Failed to submit customer data");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-10 py-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            গ্রাহকের তথ্য / Customer Information
                        </h1>
                        <p className="mt-3 text-emerald-100/90 text-lg">
                            নিচের তথ্যগুলো পূরণ করুন / Please fill in the details below
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 md:p-12 space-y-7">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                গ্রাহকের নাম / Customer Name
                            </label>
                            <input
                                placeholder="গ্রাহকের পুরো নাম / Full name"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                            />
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                এলাকা / Area
                            </label>
                            <select
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.areaID}
                                onChange={(e) => setForm({ ...form, areaID: e.target.value })}
                            >
                                <option value="">এলাকা নির্বাচন করুন / Choose an area</option>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ফোন নম্বর / Phone Number
                            </label>
                            <input
                                placeholder="০১XXXXXXXXX / 01XXXXXXXXX"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            />
                        </div>

                        {/* NID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                এনআইডি নম্বর / NID Number
                            </label>
                            <input
                                placeholder="এনআইডি নম্বর দিন / Enter NID number"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.nid}
                                onChange={(e) => setForm({ ...form, nid: e.target.value })}
                            />
                        </div>

                        {/* Payment Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                পেমেন্টের তারিখ / Payment Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.paymentDate}
                                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ক্রয়ের পরিমাণ / Purchase Amount
                            </label>
                            <input
                                type="number"
                                placeholder="পরিমাণ দিন / Enter amount"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                পেমেন্টের মাধ্যম / Payment Method
                            </label>
                            <select
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                            >
                                <option value="">মাধ্যম নির্বাচন করুন / Select method</option>
                                {methods.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={submit}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mt-6"
                        >
                            তথ্য জমা দিন / Submit Customer Information
                        </button>
                    </div>
                </div>

                {/* Trust note */}
                <p className="mt-8 text-center text-sm text-emerald-700/70">
                    আপনার তথ্য নিরাপদে সংরক্ষিত হচ্ছে • Your information is secure
                </p>
            </div>
        </div>
    );
}