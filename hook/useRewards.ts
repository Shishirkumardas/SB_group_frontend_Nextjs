// src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardApi } from '@/lib/api';

export const useRewards = {
    // Queries
    getCardById: (cardId: string) =>
        useQuery({
            queryKey: ['rewardCard', cardId],
            queryFn: () => rewardApi.getById(cardId),
            enabled: !!cardId,
        }),

    getCardByCustomer: (customerId: string) =>
        useQuery({
            queryKey: ['customerRewardCard', customerId],
            queryFn: () => rewardApi.getByCustomer(customerId),
            enabled: !!customerId,
        }),

    getTransactions: (cardId: string) =>
        useQuery({
            queryKey: ['rewardTransactions', cardId],
            queryFn: () => rewardApi.getTransactions(cardId),
            enabled: !!cardId,
        }),

    // // Mutations
    // issueCard: () => {
    //     const queryClient = useQueryClient();
    //     return useMutation({
    //         mutationFn: rewardApi.issueCard,
    //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewardCard'] }),
    //     });
    // },
    issueCard: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: rewardApi.issueCard,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['rewardCard']});
            },
        })
    },

    addPoints: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ cardId, points, reason }: { cardId: string; points: number; reason: string }) =>
                rewardApi.addPoints(cardId, points, reason),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewardCard'] }),
        });
    },

    redeemPoints: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ cardId, pointsToRedeem, remarks }: { cardId: string; pointsToRedeem: number; remarks?: string }) =>
                rewardApi.redeemPoints(cardId, pointsToRedeem, remarks),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewardCard'] }),
        });
    },
};