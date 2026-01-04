"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = async () => {
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            setError("Invalid credentials");
            return;
        }

        const data = await res.json();

        if (data.role === "ADMIN") {
            router.push("/dashboard/summary");
        } else {
            router.push("/customer");
        }
        // Refresh the app state so Navbar updates
        // window.location.reload()
    };

    return (
        <div className="max-w-md mx-auto p-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 w-full mb-2"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={login}
                className="bg-black text-white w-full py-2 mt-4"
            >
                Login
            </button>
        </div>
    );
}
