import CustomerNavbar from "@/components/CustomerNavbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <CustomerNavbar />
            <main className="p-6">{children}</main>
        </div>
    );
}
