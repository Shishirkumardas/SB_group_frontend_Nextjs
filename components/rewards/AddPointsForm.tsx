'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AddPointsForm({
                                          cardId,
                                          currentPoints,
                                          onClose,
                                          onSuccess,
                                      }: {
    cardId: string;
    currentPoints: number;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [points, setPoints] = useState(100);
    const [reason, setReason] = useState('Purchase at SB Mall');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`http://localhost:8080/api/rewards/add-points?cardId=${cardId}&points=${points}&reason=${encodeURIComponent(reason)}`, {
                method: 'POST',
                credentials: 'include',
            });
            onSuccess();
        } catch (err) {
            alert('Failed to add points');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-8">
                <h2 className="text-2xl font-semibold mb-6">Add Points</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2">Points to Add</label>
                            <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className="w-full border rounded-2xl px-5 py-4" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Reason</label>
                            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border rounded-2xl px-5 py-4" />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                            <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl">
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Add Points'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}