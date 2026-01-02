"use client";

import { useEffect, useState } from "react";

interface Area {
    id: number;
    name: string;
}

export default function MasterDataForm({
                                           onSuccess,
                                       }: {
    onSuccess: () => void;
}) {
    const [name, setName] = useState("");
    const [areaId, setAreaId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [bkash, setBkash] = useState("");
    const [date, setDate] = useState("");
    const [purchaseAmount, setPurchaseAmount] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [cashBackAmount, setCashBackAmount] = useState("");
    const [areas, setAreas] = useState<Area[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/areas")
            .then((res) => res.json())
            .then(setAreas);
    }, []);

    const submit = async () => {
        const dueAmount =
            Number(purchaseAmount) -
            Number(paidAmount) -
            Number(cashBackAmount || 0);

        await fetch("http://localhost:8080/api/master-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                paymentMethod,
                bkash: Number(bkash),
                date,
                purchaseAmount: Number(purchaseAmount),
                paidAmount: Number(paidAmount),
                dueAmount,
                cashBackAmount: Number(cashBackAmount),
                area: { id: Number(areaId) },
            }),
        });

        setName("");
        onSuccess();
    };

    return (
        <div style={{marginBottom: 20}}>
            <h3>➕ Add Master Data</h3>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>

            <select value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                <option value="">Select Area</option>
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                ))}
            </select>

            <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
            >
                <option value="">Select payment method</option>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
                <option value="BANK">Bank</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input placeholder="Purchase Amount" value={purchaseAmount}
                   onChange={(e) => setPurchaseAmount(e.target.value)}/>
            <input placeholder="Paid Amount" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)}/>
            <input placeholder="Cashback Amount" value={cashBackAmount}
                   onChange={(e) => setCashBackAmount(e.target.value)}/>

            <button onClick={submit}>Save</button>
        </div>
    );
}
