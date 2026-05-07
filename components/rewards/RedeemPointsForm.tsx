// src/components/rewards/RedeemPointsForm.tsx
'use client';
import { useState } from 'react';
import { useRewards } from '@/hook/useRewards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RedeemPointsForm({ cardId, currentPoints }: { cardId: string; currentPoints: number }) {
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [remarks, setRemarks] = useState('');
    const redeemMutation = useRewards.redeemPoints();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pointsToRedeem <= 0 || pointsToRedeem > currentPoints) return;

        redeemMutation.mutate({ cardId, pointsToRedeem, remarks }, {
            onSuccess: () => {
                alert(`✅ Redeemed ${pointsToRedeem} points for ${pointsToRedeem} BDT cashback!`);
                setPointsToRedeem(0);
                setRemarks('');
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>💰 Redeem Points</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="number"
                        placeholder="Points to Redeem"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                        max={currentPoints}
                    />
                    <p className="text-sm text-gray-500">Max: {currentPoints} points = {currentPoints} TK</p>

                    <Textarea
                        placeholder="Remarks (Optional)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />

                    <Button type="submit" className="w-full" disabled={redeemMutation.isPending}>
                        Redeem for Cashback
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}