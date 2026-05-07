// components/rewards/RewardCardDisplay.tsx
import type { RewardCard } from '@/type/reward';

export default function RewardCardDisplay({ card }: { card: RewardCard }) {
    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
            <div className="flex justify-between">
                <div>
                    <p className="text-emerald-600 font-medium">Card Number</p>
                    <p className="text-3xl font-mono tracking-widest">{card.cardNumber}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Current Points</p>
                    <p className="text-5xl font-bold text-emerald-600">{card.totalPoints}</p>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-emerald-600 text-sm">Customer</p>
                <p className="text-xl font-semibold">{card.customer.fullName}</p>
                <p className="text-gray-600">{card.customer.phone}</p>
            </div>

            {card.expiringSoonPoints && card.expiringSoonPoints > 0 && (
                <div className="mt-6 bg-amber-50 border border-amber-300 rounded-2xl p-4">
                    <p className="text-amber-700 font-medium">⚠️ Expiring Soon</p>
                    <p className="text-3xl font-bold text-amber-600">{card.expiringSoonPoints}</p>
                    <p className="text-sm text-amber-600">points will expire soon</p>
                </div>
            )}

            {!card.isActive && (
                <div className="mt-6 text-red-600 font-medium text-center">⚠️ This card is deactivated</div>
            )}
        </div>
    );
}