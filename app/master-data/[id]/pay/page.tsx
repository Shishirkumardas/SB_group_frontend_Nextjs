"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
export default function MasterDataPaymentPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("BKASH");
    // const date = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState("");

    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(date);

    const submit = () => {
        if (!amount) {
            alert("Amount is required");
            return;
        }

        // Redirect to bKash payment page with date
        router.push(
            `/master-data/${id}/pay/bkash?amount=${amount}&date=${paymentDate}`
        );
    };

// export default function MasterDataPaymentPage() {
//     const { id } = useParams<{ id: string }>();
//     const router = useRouter();
//
//     const [amount, setAmount] = useState("");
//     const [paymentMethod, setPaymentMethod] = useState("BKASH");
//     const [date, setDate] = useState("");
//
//     const submit = async () => {
//         await fetch(`http://localhost:8080/api/master-data/${id}/pay`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 amount: Number(amount),
//                 paymentMethod,
//                 paymentDate: date,
//             }),
//         });
//
//         router.push("/master-data");
//     };
    // const submit = () =>
    // { if (!amount) { alert("Amount is required");
    //     return;
    // } // Redirect to bKash payment page
    //     router.push(/master-data/${id}/bkash?amount=${amount});
    // };
    // const payWithBkash = async (Id: number, amount: number) => {
    //     const res = await fetch(
    //         `http://localhost:8080/api/bkash/pay?masterDataId=${Id}&amount=${amount}`,
    //         {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }
    //     );
    //
    //     const data = await res.json();
    //     window.location.href = data.bkashURL;
    // };


    return (
        <div style={{ padding: 30 }}>
            <h1>💳 Add Payment</h1>

            <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
            >
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
            </select>

            <br /><br />

            <input
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />

            <br /><br />

            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            />

            <br /><br />

            <button onClick={submit}>Save Payment</button>
        </div>
    );
}
