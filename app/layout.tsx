import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "SB Group",
    description: "SB Group Web App",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Navbar />
        {children}
        </body>
        </html>
    );
}
