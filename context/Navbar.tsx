"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ShoppingCart, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthContext"; // adjust path if needed

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────

interface Subcategory {
    name: string;
    href: string;
}

interface MegaSection {
    title: string;
    items: Subcategory[];
}

interface Category {
    title: string;
    href: string;
    subcategories?: Subcategory[];
    megaSections?: MegaSection[];
    isSubbrand?: boolean;
    isHighlight?: boolean;
    hasMega?: boolean;
}

// ────────────────────────────────────────────────
// MAIN MENU DATA - ALL CATEGORIES INCLUDED
// ────────────────────────────────────────────────

const mainCategories: Category[] = [
    {
        title: "NJBL Products",
        href: "/njbl-products",
        subcategories: [
            { name: "Food Packages", href: "/njbl-products?sub=Food Packages" },
            { name: "Electronics", href: "/njbl-products?sub=Electronics" },
        ],
    },

    {
        title: "Sister Concern",
        href: "/sister-concern",
        subcategories: [
            { name: "SB Medical College & Hospital", href: "/sister-concern/sb-medical" },
            { name: "SB Health & Education Society", href: "/sister-concern/sb-society" },
            { name: "RM Apon Housing", href: "/sister-concern/apon-housing" },
            { name: "SB 3 Star Hotel", href: "/sister-concern/sb-hotel" },
            { name: "SB Resort & Housing", href: "/sister-concern/sb-resort" },
            { name: "SB Developer", href: "/sister-concern/sb-developer" },
            { name: "SB Construction", href: "/sister-concern/sb-construction" },
            { name: "SB Cosmetics", href: "/sister-concern/sb-cosmetics" },
            { name: "SB Pharmaceuticals", href: "/sister-concern/sb-pharma" },
        ],
    },

    {
        title: "Projects",
        href: "/projects",
        hasMega: true,
        megaSections: [
            {
                title: "Shopping Mall",
                items: [
                    { name: "Shopping Mall Director", href: "/projects?sub=Shopping Mall Director" },
                    { name: "Shopping Mall Share Holder", href: "/projects?sub=Shopping Mall Share Holder" },
                ],
            },
            {
                title: "Root Authority",
                items: [
                    { name: "Dealer", href: "/projects?sub=Dealer" },
                    { name: "Depo", href: "/projects?sub=Depo" },
                ],
            },
        ],
    },

    {
        title: "About Us",
        href: "/about",
        isHighlight: true,
    },
];

// ────────────────────────────────────────────────
// ADMIN DROPDOWN ITEMS
// ────────────────────────────────────────────────

const adminLinks = [
    { name: "Manage products", href: "/admin/products" },
    { name: "Add product", href: "/admin/products/add" },
    { name: "Manage Delivery", href: "/admin/orders" },
    { name: "Order Dashboard", href: "/order-dashboard" }, //cashback/cashback-export
    { name: "Export Cashback", href: "/cashback/cashback-export" }, //dashboard/excel-upload
    { name: "Upload Master Data", href: "/dashboard/excel-upload" },
    { name: "Master Data", href: "/master-data" },
    { name: "Areas", href: "/areas" },
    { name: "Purchases", href: "/purchases" },
    { name: "Dashboard", href: "/dashboard/summary" },
    { name: "Daily Summary", href: "/area-daily-summary" },
];

export default function Navbar() {
    const { role, isLoading, refreshAuth } = useAuth();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeMega, setActiveMega] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            refreshAuth();
            window.location.href = "/login"; // hard redirect
        }
    };

    if (!mounted || isLoading) {
        return <div className="h-16 bg-emerald-950" />; // dark green placeholder
    }

    const isAuthenticated = role !== null;
    const isAdmin = role === "ADMIN";

    return (
        <>
            {/* ─── DESKTOP NAVBAR ────────────────────────────────────── */}
            <nav className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50 hidden md:block border-b border-emerald-800">
                <div className="max-w-7xl mx-auto px-8 lg:px-12">
                    <div className="flex items-center h-16">
                        {/* Logo + Text */}
                        <div className="absolute top-0 left-0 m-4 z-50 flex items-center gap-3">
                            {/* Company Logo */}
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600/70 shadow-lg flex-shrink-0">
                                <img
                                    src="/images/sb-group-logo.png" // ← Replace with your actual logo path
                                    alt="SB Group Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Text beside logo */}
                            <Link
                                href="/"
                                className="text-3xl font-serif tracking-wider text-emerald-100 hover:text-white transition-all duration-300"
                            >
                                SB Group
                            </Link>
                        </div>

                        {/* Main Categories */}
                        <div className="flex-1 flex items-center justify-center space-x-10 lg:space-x-12">
                            {mainCategories.map((cat) => (
                                <div
                                    key={cat.title}
                                    className="relative group"
                                    onMouseEnter={() => setActiveMega(cat.title)}
                                    onMouseLeave={() => setActiveMega(null)}
                                >
                                    <Link
                                        href={cat.href}
                                        className={`text-sm tracking-wide uppercase font-medium transition-all duration-300 relative
                      after:absolute after:left-0 after:bottom-[-4px] after:h-[1px] after:w-0 after:bg-emerald-400 
                      hover:after:w-full after:transition-all after:duration-300
                      ${cat.isHighlight ? "text-emerald-300 hover:text-emerald-200 font-semibold" : "text-emerald-100 hover:text-white"}
                      ${cat.isSubbrand ? "text-emerald-300 hover:text-emerald-200" : ""}`}
                                    >
                                        {cat.title}
                                        {(cat.subcategories || cat.megaSections) && (
                                            <ChevronDown className="inline h-4 w-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </Link>

                                    {/* Mega / Subcategory Dropdown */}
                                    {(cat.subcategories || cat.megaSections) && activeMega === cat.title && (
                                        <div className="absolute left-0 top-full pt-4 w-[750px] bg-emerald-900/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden z-50 border border-emerald-700 transition-all duration-300 transform scale-95 group-hover:scale-100">
                                            <div className="grid grid-cols-3 gap-8 p-10">
                                                {cat.megaSections
                                                    ? cat.megaSections.map((section) => (
                                                        <div key={section.title}>
                                                            <h4 className="font-serif font-semibold text-emerald-100 mb-4 text-lg tracking-wide">
                                                                {section.title}
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {section.items.map((item) => (
                                                                    <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        className="block text-emerald-200 hover:text-white text-sm transition-all duration-200 hover:translate-x-1"
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                    : cat.subcategories?.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="block text-emerald-200 hover:text-white text-sm transition-all duration-200 hover:translate-x-1"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Icons / Admin Area */}
                        <div className="flex items-center space-x-7">
                            <Link href="/wishlist" className="text-emerald-200 hover:text-white transition-colors">
                                <Heart className="h-5 w-5" />
                            </Link>

                            <Link href="/cart" className="text-emerald-200 hover:text-white relative transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>

                            {isAuthenticated ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors focus:outline-none">
                                        <User className="h-5 w-5" />
                                        <span className="text-sm font-medium hidden lg:inline">
                      {isAdmin ? "Admin" : "Account"}
                    </span>
                                        <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-emerald-900 shadow-xl rounded-xl border border-emerald-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2 divide-y divide-emerald-800">
                                        {isAdmin && (
                                            <>
                                                <div className="px-4 py-2.5 border-b border-emerald-800">
                          <span className="text-xs text-emerald-300 uppercase font-medium tracking-wide">
                            Admin Panel
                          </span>
                                                </div>
                                                {adminLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className="block px-5 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800/50 transition"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                                <hr className="my-1 border-emerald-800" />
                                            </>
                                        )}

                                        <Link
                                            href="/profile"
                                            className="block px-5 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800/50 transition"
                                        >
                                            My Profile
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-5 py-2.5 text-sm text-red-300 hover:bg-red-900/30 transition flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-emerald-200 hover:text-white transition-colors">
                                    <User className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── MOBILE NAVBAR ─────────────────────────────────────── */}
            <nav className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50 md:hidden border-b border-emerald-800">
                <div className="px-4">
                    <div className="flex items-center justify-between h-14">
                        <Link href="/" className="text-xl font-serif tracking-wide font-bold text-emerald-100 flex items-center gap-2">
                            {/* Small logo in mobile too */}
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-600/50 flex-shrink-0">
                                <img
                                    src="/images/sb-group-logo.png"
                                    alt="SB Group Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            SB Group
                        </Link>
                        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            {isMobileOpen ? <X className="h-6 w-6 text-emerald-200" /> : <Menu className="h-6 w-6 text-emerald-200" />}
                        </button>
                    </div>
                </div>

                {isMobileOpen && (
                    <div className="bg-emerald-950 border-t border-emerald-800 max-h-[70vh] overflow-y-auto">
                        <div className="px-4 py-6 space-y-6">
                            {/* Categories */}
                            {mainCategories.map((cat) => (
                                <div key={cat.title}>
                                    <Link
                                        href={cat.href}
                                        className={`block text-lg font-medium ${
                                            cat.isHighlight ? "text-emerald-300" : cat.isSubbrand ? "text-emerald-300" : "text-emerald-100"
                                        }`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        {cat.title}
                                    </Link>

                                    {cat.subcategories && (
                                        <div className="mt-3 pl-6 space-y-2">
                                            {cat.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block text-emerald-200 text-sm hover:text-white"
                                                    onClick={() => setIsMobileOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {cat.megaSections && (
                                        <div className="mt-3 pl-6 space-y-4">
                                            {cat.megaSections.map((section) => (
                                                <div key={section.title}>
                                                    <h4 className="font-semibold text-emerald-100 mb-2">{section.title}</h4>
                                                    <div className="space-y-1">
                                                        {section.items.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block text-emerald-200 text-sm hover:text-white"
                                                                onClick={() => setIsMobileOpen(false)}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Auth Actions */}
                            <div className="pt-6 border-t border-emerald-800 space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="block text-emerald-100 font-medium"
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            My Profile
                                        </Link>

                                        {isAdmin && (
                                            <div className="pl-6 space-y-2 border-l-2 border-emerald-700">
                                                <p className="text-sm text-emerald-300 uppercase font-medium">Admin Panel</p>
                                                {adminLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className="block text-emerald-200 text-sm hover:text-white"
                                                        onClick={() => setIsMobileOpen(false)}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileOpen(false);
                                            }}
                                            className="block text-red-300 font-medium w-full text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block text-emerald-100 font-medium"
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}