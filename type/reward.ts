// src/types/reward.ts
export interface RewardCard {
    id: string;
    cardNumber: string;
    totalPoints: number;
    issuedAt: string;
    isActive: boolean;
    expiringSoonPoints?: number;        // number or undefined
    customer: {
        id: string;
        fullName: string;
        phone: string;
    };
}

export interface RewardTransaction {
    id: string;
    pointsEarned: number;
    description: string;
    timestamp: string;
}