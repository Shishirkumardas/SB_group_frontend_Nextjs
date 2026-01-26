
import "./globals.css";

import Navbar from "@/context/Navbar";

export const metadata = {
    title: "SB Group",
    description: "SB Group Web App",
};

import { AuthProvider } from "@/components/AuthContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <AuthProvider>
            <Navbar />
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}

