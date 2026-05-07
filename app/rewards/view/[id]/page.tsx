// app/(dashboard)/rewards/view/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RewardCardDisplay from '@/components/rewards/RewardCardDisplay';

export default function RewardCardViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [card, setCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/rewards/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setCard(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading card...</div>;
    if (!card) return <div>Card not found</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="mb-6 text-emerald-600 hover:underline">
                ← Back to Rewards
            </button>
            <RewardCardDisplay card={card} />
            {/* You can add more details, edit form, etc. here */}
        </div>
    );
}