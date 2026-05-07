'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function IssueRewardCardForm({ onSuccess }: { onSuccess: () => void }) {
    const [customerId, setCustomerId] = useState('');
    const [issuing, setIssuing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId.trim()) return;

        setIssuing(true);
        try {
            const res = await fetch('http://localhost:8080/api/rewards/issue?customerId=' + customerId, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            alert(`✅ Card Issued!\nCard Number: ${data.cardNumber}`);
            setCustomerId('');
            onSuccess();
        } catch (err: any) {
            alert('❌ ' + err.message);
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
            <h2 className="text-xl font-semibold text-emerald-800 mb-6">Issue New Reward Card</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                    <input
                        type="text"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="Enter Customer ID"
                        className="w-full border border-emerald-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={issuing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
                >
                    {issuing && <Loader2 className="animate-spin" size={20} />}
                    Issue Reward Card
                </button>
            </form>
        </div>
    );
}