// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",   // Your existing base
});

// Optional: Add token interceptor (if you use JWT)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Reward Card APIs (using your style - mostly fetch where possible)
const REWARDS_BASE = "/rewards";

export const rewardApi = {
    // Issue Reward Card
    issueCard: async (customerId: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/issue?customerId=${customerId}`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to issue reward card");
        return res.json();
    },

    // Add Points
    addPoints: async (cardId: string, points: number, reason: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/add-points?cardId=${cardId}&points=${points}&reason=${encodeURIComponent(reason)}`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to add points");
        return res.json();
    },

    // Redeem Points
    redeemPoints: async (cardId: string, pointsToRedeem: number, remarks?: string) => {
        let url = `${api.defaults.baseURL}${REWARDS_BASE}/redeem?cardId=${cardId}&pointsToRedeem=${pointsToRedeem}`;
        if (remarks) url += `&remarks=${encodeURIComponent(remarks)}`;

        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to redeem points");
        return res.json();
    },

    // Get by Card ID
    getById: async (cardId: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/${cardId}`, {
            cache: "no-store",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Card not found");
        return res.json();
    },

    // Get by Customer ID
    getByCustomer: async (customerId: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/customer/${customerId}`, {
            cache: "no-store",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Customer card not found");
        return res.json();
    },

    // Get Transaction History
    getTransactions: async (cardId: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/${cardId}/transactions`, {
            cache: "no-store",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
    },

    // Deactivate Card
    deactivate: async (cardId: string) => {
        const res = await fetch(`${api.defaults.baseURL}${REWARDS_BASE}/${cardId}/deactivate`, {
            method: "PUT",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to deactivate card");
        return res.json();
    },
};