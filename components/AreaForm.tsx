"use client";

import { useState } from "react";

export default function AreaForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");

    const submit = async () => {
        await fetch("http://localhost:8080/api/areas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                purchaseAmount: 0,
                paidAmount: 0,
                dueAmount: 0,
            }),
        });

        setName("");
        onSuccess();
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>➕ Add Area</h3>

            <input
                placeholder="Area Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button onClick={submit}>Save</button>
        </div>
    );
}
