"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    const signup = async () => {
        await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });

        router.push("/login");
    };

    return (
        <div className="max-w-md mx-auto p-10">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

            <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <input
                type="password"
                className="border p-2 w-full mb-2"
                placeholder="Password"
                onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <button
                onClick={signup}
                className="bg-black text-white w-full py-2 mt-4"
            >
                Create Account
            </button>
        </div>
    );
}
