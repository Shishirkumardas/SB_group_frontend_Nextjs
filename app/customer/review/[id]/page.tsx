export default async function ReviewPage({ params }: { params: { id: string } }) {
    const res = await fetch(`http://localhost:8080/api/master-data/${params.id}`, {
        cache: "no-store",
    });
    const data = await res.json();

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Review Details</h1>

            <p><b>Name:</b> {data.customerName}</p>
            <p><b>Payment Method:</b> {data.paymentMethod}</p>
            <p><b>Amount:</b> {data.expectedPayment}</p>
            <p><b>Date:</b> {data.customerPaymentDate}</p>

            <a href={`/customer/pay/${params.id}`}>
                <button className="mt-4 bg-green-600 text-white px-4 py-2">
                    Proceed to Payment
                </button>
            </a>
        </div>
    );
}
