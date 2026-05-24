import "./globals.css";
// import GoogleTranslate from "@/components/GoogleTranslate";

import Navbar from "@/context/Navbar";

export const metadata = {
    title: "SB Group",
    description: "SB Group Web App",
};

import { AuthProvider } from "@/components/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body>
        <AuthProvider>
            <Navbar/>
            {/*<div className="fixed top-4 right-4 z-50">*/}
            {/*    <GoogleTranslate/>*/}
            {/*</div>*/}
            <script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                async
            />
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}