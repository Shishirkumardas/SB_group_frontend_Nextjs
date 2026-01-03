"use client";

import { useRouter } from "next/navigation";

export default function CustomerPage() {
    const router = useRouter();

    const handleNewCustomer = () => {
        const id = crypto.randomUUID();
        router.push(`/customer/${id}`);
    };

    return (
        <div className="p-10">
            <h1 className="text-xl font-bold mb-4">Customer</h1>

            <button
                onClick={handleNewCustomer}
                className="bg-black text-white px-4 py-2"
            >
                New Customer Entry
            </button>
        </div>
    );
}
