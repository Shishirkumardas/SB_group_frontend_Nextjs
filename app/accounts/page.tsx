"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountsFormPage() {
    const router = useRouter();

    // const [areas, setAreas] = useState<any[]>([]);
    const [methods, setMethods] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        expenseHead: "",
        expenseAmount: "",
    });

    useEffect(() => {
        // fetch("http://localhost:8080/api/public/areas")
        //     .then(res => res.json())
        //     .then(setAreas);
        //
        // fetch("http://localhost:8080/api/public/meta/payment-methods")
        //     .then(res => res.json())
        //     .then(setMethods);
    }, []);

    const submit = async () => {
        await fetch("http://localhost:8080/api/accounts/submit", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: form.name,
                expenseHead: form.expenseHead,
                expenseAmount: form.expenseAmount
            }),
        });// Show success message
        setSuccessMessage("Cost Successfully added!");

        // Clear message after 3 seconds (optional)
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    }

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Cost Information</h1>
            {successMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            <input
                placeholder="Name"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            {/*<select*/}
            {/*    className="border p-2 w-full mb-2"*/}
            {/*    onChange={(e) =>*/}
            {/*        setForm({ ...form, areaID: e.target.value })*/}
            {/*    }*/}
            {/*>*/}
            {/*    <option value="">Select Area</option>*/}
            {/*    {areas.map((a) => (*/}
            {/*        <option key={a.id} value={a.id}>*/}
            {/*            {a.name}*/}
            {/*        </option>*/}
            {/*    ))}*/}
            {/*</select>*/}

            <input
                placeholder="Expense Head"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, expenseHead: e.target.value })
                }
            />

            <input
                type="number"
                placeholder="Expense Amount"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, expenseAmount: e.target.value })
                }
            />

            {/*<select*/}
            {/*    className="border p-2 w-full mb-4"*/}
            {/*    onChange={(e) =>*/}
            {/*        setForm({ ...form, paymentMethod: e.target.value })*/}
            {/*    }*/}
            {/*>*/}
            {/*    <option value="">Payment Method</option>*/}
            {/*    {methods.map((m) => (*/}
            {/*        <option key={m} value={m}>*/}
            {/*            {m}*/}
            {/*        </option>*/}
            {/*    ))}*/}
            {/*</select>*/}

            <button
                onClick={submit}
                className="bg-black text-white px-4 py-2 w-full"
            >
                Submit
            </button>
        </div>

    );
}
