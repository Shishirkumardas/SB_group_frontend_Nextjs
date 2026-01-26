"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "ADMIN" | "CUSTOMER" | null;

interface AuthContextType {
    role: Role;
    isLoading: boolean;
    refreshAuth: () => void;
    setRole: (role: Role) => void;
    userId: string | null;
    userPhone: string|null;
    userAddress: string|null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [role, setRole] = useState<"ADMIN" | "CUSTOMER" | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    const refreshAuth = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/me", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            console.log("refreshAuth status:", res.status); // ← debug
            if (!res.ok) {
                setRole(null);
                return;
            }
            const data = await res.json();
            setRole(data?.role?.toUpperCase() ?? null);
            setUserId(data?.id ?? null);
            setUserPhone(data?.phone ?? null);
            setUserAddress(data?.address ?? null);
        } catch {
            setRole(null);
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ role, isLoading, refreshAuth, setRole, userId,userPhone,userAddress }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
