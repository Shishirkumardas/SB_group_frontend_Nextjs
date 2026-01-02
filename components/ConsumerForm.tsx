"use client";

import { useState } from "react";

export default function ConsumerForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [phone, setPhone] = useState("");

    const submit = async () => {
        await fetch("http://localhost:8080/api/consumers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, area, phone }),
        });

        setName("");
        setArea("");
        setPhone("");
        onSuccess();
    };

    return (
        <div>
            <h3>Add Consumer</h3>
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
            />
            <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={submit}>➕ Add</button>
        </div>
    );
}
