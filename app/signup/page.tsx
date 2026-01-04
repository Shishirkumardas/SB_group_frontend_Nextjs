"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "CUSTOMER", // Set default role; optionally add UI for role selection
    });
    const [error, setError] = useState<string | null>(null);

    const signup = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (response.ok) {
                // Signup successful
                router.push("/login");
            } else {
                const errorText = await response.text();
                setError(`Signup failed: ${errorText}`);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-10">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
                type="password"
                className="border p-2 w-full mb-2"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* Optional: Add role selection if needed */}
            {/*
            <select
                className="border p-2 w-full mb-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
            </select>
            */}

            <button
                onClick={signup}
                className="bg-black text-white w-full py-2 mt-4"
            >
                Create Account
            </button>
        </div>
    );
}