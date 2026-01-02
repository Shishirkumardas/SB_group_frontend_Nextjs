"use client";

import { useState } from "react";

export default function PurchaseForm({ onSuccess }: { onSuccess: () => void }) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");

    const submit = async () => {
        await fetch("http://localhost:8080/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                itemName,
                quantity: Number(quantity),
                price: Number(price),
            }),
        });

        setItemName("");
        setQuantity("");
        setPrice("");
        onSuccess();
    };

    return (
        <div>
            <h3>Add Purchase</h3>
            <input
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={submit}>➕ Add</button>
        </div>
    );
}
