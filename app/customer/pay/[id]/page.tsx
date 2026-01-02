"use client";

import { useRouter } from "next/navigation";

export default function PayPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    const pay = async () => {
        await fetch(`http://localhost:8080/api/customer/${params.id}/pay`, {
            method: "POST",
        });

        router.push(`/customer/success/${params.id}`);
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-xl font-bold">Confirm Payment</h1>

            <button onClick={pay} className="mt-6 bg-blue-600 text-white px-6 py-3">
                Pay Now
            </button>
        </div>
    );
}
