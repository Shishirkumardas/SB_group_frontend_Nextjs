"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
    // Heart,
    User,
    LogOut,
    UserCheck,
    Moon,
    Home,
    Package,
    Truck,
    Users,
    Handshake,
    Sparkles,
    HeartHandshake,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext"; // adjust path if needed


interface Subcategory {
    name: string;
    href: string;
}

interface MegaItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface MegaSection {
    title: string;
    items: MegaItem[];
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
// MAIN MENU DATA
// ────────────────────────────────────────────────

const mainCategories: Category[] = [
    {
        title: "NJBL Products",
        href: "/njbl-product-f",
        // subcategories: [
        //     { name: "Food Packages", href: "/njbl-products?sub=Food Packages" },
        //     { name: "Electronics", href: "/njbl-products?sub=Electronics" },
        // ],
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

            // {
            //     title: "Core Systems",
            //     items: [
            //         { name: "Root Authority", href: "/projects/root-authority", icon: ShieldCheck },
            //         { name: "Dealer Network", href: "/projects/dealer", icon: Store },
            //         { name: "Depo Management", href: "/projects/depo", icon: Package },
            //     ],
            // },
            {
                title: "Partner & Reward Programs",
                items: [
                    { name: "ডিলার + নন-ডেলিভারি পার্টনার", href: "/projects/dealer", icon: Handshake },
                    { name: "দ্বিগুণ সুবিধা প্রোগ্রাম", href: "/projects/double-benefit-program", icon: Sparkles },
                    { name: "আমৃত্যু সুবিধা v01", href: "/projects/amrityu-subidha", icon: HeartHandshake },
                    { name: "নারী উদ্যোক্তা প্রোগ্রাম", href: "/projects/woman-entrepreneurship-program", icon: Users },
                ],
            },
            {
                title: "Delivery & Distribution",
                items: [
                    { name: "ডেলিভারি ফুড প্যাকেজ + রিওয়ার্ড", href: "/projects/delivery-food-package", icon: Package },
                    { name: "ট্রাক সেল ফুড ডিস্ট্রিবিউশন", href: "/projects/truck-sale-food-distribution", icon: Truck },
                ],
            },
            {
                title: "Shopping Mall",
                items: [
                    { name: "Shopping Mall Director", href: "/projects/shopping-mall-director", icon: Users },
                    // { name: "Shopping Mall Share Holder", href: "/projects/shopping-mall-share-holder", icon: Handshake },
                    // { name: "Shopping Mall Program", href: "/projects/shopping-mall-program", icon: Building2 },
                ],
            },
            {
                title: "Housing & Community",
                items: [
                    { name: "আপন হাউজিং", href: "/projects/apon-housing", icon: Home },
                    { name: "আমার বাজার প্রকল্প", href: "/projects/amar-bazar", icon: ShoppingCart },
                ],
            },
            {
                title: "Special Campaigns",
                items: [
                    { name: "রমাদান প্রকল্প", href: "/projects/ramadan-project", icon: Moon },
                    { name: "উন্নয়ন কর্মকর্তা সুবিধা", href: "/projects/development-officer-benefit", icon: UserCheck },
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
// ADMIN LINKS
// ────────────────────────────────────────────────

const adminLinks = [
    { name: "Manage products", href: "/admin/products" },
    { name: "Add product", href: "/admin/products/add" },
    { name: "Manage Delivery", href: "/admin/orders" },
    { name: "Order Dashboard", href: "/order-dashboard" },
    { name: "Export Cashback", href: "/cashback/cashback-export" },
    { name: "Export Cashback P", href: "/cashback/cashback-export-purchase" },
    { name: "Upload Master Data", href: "/dashboard/excel-upload" },
    { name: "Cashback Payout Update", href: "/cashback_payout_update" },
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
            window.location.href = "/login"; // hard redirect for clean logout
        }
    };

    if (!mounted || isLoading) {
        return <div className="h-16 bg-emerald-950" />; // placeholder during SSR/auth check
    }

    const isAuthenticated = role !== null;
    const isAdmin = role === "ADMIN";

    return (
        <>
            {/* DESKTOP NAVBAR */}
            <nav className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50 hidden md:block border-b border-emerald-800">
                <div className="max-w-7xl mx-auto px-8 lg:px-12">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + Brand */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-600/70 shadow-md flex-shrink-0">
                                <img
                                    src="/images/sb-group-logo.png"
                                    alt="SB Group Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl font-serif tracking-wide text-emerald-100 hover:text-white transition">
                SB Group
              </span>
                        </Link>

                        {/* Main Menu */}
                        <div className="flex items-center space-x-10 lg:space-x-12">
                            {mainCategories.map((cat) => (
                                <div
                                    key={cat.title}
                                    className="relative group"
                                    onMouseEnter={() => setActiveMega(cat.title)}
                                    onMouseLeave={() => setActiveMega(null)}
                                >
                                    <Link
                                        href={cat.href}
                                        className={`text-sm tracking-wide uppercase font-medium transition-colors relative
                      after:absolute after:left-0 after:bottom-[-4px] after:h-[1px] after:w-0 after:bg-emerald-400 
                      hover:after:w-full after:transition-all after:duration-300
                      ${cat.isHighlight ? "text-emerald-300 hover:text-emerald-200 font-semibold" : "text-emerald-100 hover:text-white"}`}
                                    >
                                        {cat.title}
                                        {(cat.subcategories || cat.megaSections) && (
                                            <ChevronDown className="inline h-4 w-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </Link>

                                    {/* Dropdown / Mega Menu */}
                                    {(cat.subcategories || cat.megaSections) && activeMega === cat.title && (
                                        <div className="absolute left-0 top-full pt-4 w-[800px] bg-emerald-900/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden z-50 border border-emerald-700">
                                            <div className="grid grid-cols-3 gap-8 p-10">
                                                {cat.megaSections ? (
                                                    cat.megaSections.map((section) => (
                                                        <div key={section.title}>
                                                            <h4 className="font-serif font-semibold text-emerald-100 mb-4 text-lg tracking-wide">
                                                                {section.title}
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {section.items.map((item) => (
                                                                    <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        className="flex items-center gap-2 text-emerald-200 hover:text-white text-sm transition-colors hover:translate-x-1"
                                                                    >
                                                                        <item.icon size={16} />
                                                                        {item.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    cat.subcategories?.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="block text-emerald-200 hover:text-white text-sm transition-colors hover:translate-x-1"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Icons / Auth */}
                        <div className="flex items-center space-x-6">

                            <LanguageSwitcher/>

                            {/*<Link href="/wishlist" className="text-emerald-200 hover:text-white transition-colors">*/}
                            {/*    <Heart size={20}/>*/}
                            {/*</Link>*/}


                            {/*<Link href="/cart" className="text-emerald-200 hover:text-white transition-colors relative">*/}
                            {/*    <ShoppingCart size={20}/>*/}
                            {/*</Link>*/}

                            {isAuthenticated ? (
                                <div className="relative group">
                                    <button
                                        className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors focus:outline-none">
                                        <User size={20}/>
                                        <span className="text-sm font-medium hidden lg:inline">
                      {isAdmin ? "Admin" : "Account"}
                    </span>
                                        <ChevronDown size={16} className="opacity-70 group-hover:opacity-100"/>
                                    </button>

                                    <div
                                        className="absolute right-0 top-full mt-3 w-64 bg-emerald-900 shadow-xl rounded-xl border border-emerald-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2 divide-y divide-emerald-800">
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
                                                        className="block px-5 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800/50 transition-colors"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                                <hr className="my-1 border-emerald-800"/>
                                            </>
                                        )}

                                        <Link
                                            href="/profile"
                                            // href=""
                                            className="block px-5 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800/50 transition-colors"
                                        >
                                            My Profile
                                        </Link>

                                        <Link
                                            href="/customer"
                                            // href=""
                                            className="block px-5 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800/50 transition-colors"
                                        >
                                            Customer Portal
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-5 py-2.5 text-sm text-red-300 hover:bg-red-900/30 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={16}/>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-emerald-200 hover:text-white transition-colors">
                                {/*<Link href="" className="text-emerald-200 hover:text-white transition-colors">*/}
                                    <User size={20}/>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE NAVBAR */}
            <nav className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50 md:hidden border-b border-emerald-800">
                <div className="px-4">
                    <div className="flex items-center justify-between h-14">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-600/50 flex-shrink-0">
                                <img
                                    src="/images/sb-group-logo.png"
                                    alt="SB Group Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-serif font-bold text-emerald-100">SB Group</span>
                        </Link>

                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* ─── Always render LanguageSwitcher on mobile ─── */}
                <div className={`md:hidden px-4 py-3 border-t border-emerald-800 ${isMobileOpen ? 'block' : 'hidden'}`}>
                    <LanguageSwitcher />
                </div>

                {isMobileOpen && (
                    <div className="bg-emerald-950 border-t border-emerald-800 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                        <div className="px-4 py-6 space-y-6">
                            {mainCategories.map((cat) => (
                                <div key={cat.title}>
                                    <Link
                                        href={cat.href}
                                        className={`block text-lg font-medium ${
                                            cat.isHighlight ? "text-emerald-300" : "text-emerald-100"
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
                                        <div className="mt-4 pl-6 space-y-6">
                                            {cat.megaSections.map((section) => (
                                                <div key={section.title}>
                                                    <h4 className="font-semibold text-emerald-100 mb-2">{section.title}</h4>
                                                    <div className="space-y-2">
                                                        {section.items.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="flex items-center gap-2 text-emerald-200 text-sm hover:text-white"
                                                                onClick={() => setIsMobileOpen(false)}
                                                            >
                                                                <item.icon size={16} />
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

                            {/* ─── REMOVE LanguageSwitcher from here ─── */}
                            {/* <LanguageSwitcher/>   ← delete this line */}

                            {/* Mobile Auth Section */}
                            <div className="pt-8 border-t border-emerald-800 space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href=""
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
                                        href=""
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