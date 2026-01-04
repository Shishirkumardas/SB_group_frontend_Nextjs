"use client";

import { useState } from "react";

export default function AreaForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        if (!name.trim()) {
            setError("Please enter an area name");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/api/areas", {
                method: "POST",
                credentials: "include", // ✅ REQUIRED
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    purchaseAmount: "0",
                    paidAmount: "0",
                    dueAmount: "0",
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} ${errorText}`);
            }

            setName("");
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>➕ Add Area</h3>
            <input
                placeholder="Area Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
            />
            <button onClick={submit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
