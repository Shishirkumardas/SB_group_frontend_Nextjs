"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "ADMIN" | "CUSTOMER" | null;

interface AuthContextType {
    role: Role;
    isLoading: boolean;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
    role: null,
    isLoading: true,
    refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    const refreshAuth = () => setCounter(prev => prev + 1);

    useEffect(() => {
        const checkUser = async () => {
            try {
                // Assuming your token is in a cookie, your backend /me
                // should check that cookie or the Authorization header
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    headers: {
                        // If you need to manually pass the token:
                        Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                } else {
                    setRole(null);
                }
            } catch (err) {
                setRole(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUser();
    }, [counter]);

    return (
        <AuthContext.Provider value={{ role, isLoading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);