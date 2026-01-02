export default function StatCard({ title, value }: any) {
    return (
        <div className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
}
