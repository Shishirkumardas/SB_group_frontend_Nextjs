"use client";

import Link from "next/link";
import {
    ArrowRight,
    Building2,
    HeartPulse,
    Users,
    Globe,
    Briefcase,
    GraduationCap,
    Home,
    Hotel,
    Palette
} from "lucide-react";

export default function SBGroupLanding() {
    return (
        <div className="min-h-screen bg-emerald-950 text-emerald-50 overflow-x-hidden">
            {/* Hero - Full viewport immersive */}
            <section className="relative h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/sb-group-hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-black/50" />

                <div className="relative z-10 text-center px-6 max-w-6xl">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold tracking-tight mb-6 md:mb-8 drop-shadow-2xl">
                        SB Group
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-emerald-200 mb-10 md:mb-14 max-w-4xl mx-auto leading-tight drop-shadow-lg">
                        Healthcare • Education • Housing • Hospitality • Construction • Innovation
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center">
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 px-10 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                        >
                            Discover Our Vision
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link
                            href="/sister-concern"
                            className="group inline-flex items-center gap-3 bg-transparent border-2 border-emerald-600 hover:bg-emerald-900/40 px-10 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-medium transition-all backdrop-blur-sm hover:shadow-xl"
                        >
                            Explore Our Companies
                        </Link>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
                    <span className="text-sm text-emerald-300 mb-2">Scroll to explore</span>
                    <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex items-start justify-center pt-2">
                        <div className="w-1.5 h-2 bg-emerald-400 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Quick Pillars Overview */}
            <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-emerald-950 to-emerald-900/80">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-100 mb-16">
                        Our Core Pillars
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[
                            { icon: HeartPulse, title: "Healthcare", desc: "World-class hospitals & pharmaceuticals" },
                            { icon: GraduationCap, title: "Education", desc: "Empowering future generations" },
                            { icon: Home, title: "Real Estate", desc: "Modern homes & commercial spaces" },
                            { icon: Hotel, title: "Hospitality", desc: "Premium hotels & resorts" },
                            { icon: Building2, title: "Construction", desc: "Infrastructure & development expertise" },
                            { icon: Palette, title: "Cosmetics", desc: "Natural beauty products" },
                            { icon: Briefcase, title: "Projects", desc: "Large-scale visionary initiatives" },
                            { icon: Globe, title: "Nation Building", desc: "Community & social impact" },
                        ].map((pillar, i) => (
                            <div
                                key={i}
                                className="group bg-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-800/50 hover:border-emerald-600 transition-all hover:shadow-xl hover:-translate-y-2"
                            >
                                <pillar.icon className="h-14 w-14 mx-auto mb-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-serif font-bold text-emerald-100 mb-4 text-center">
                                    {pillar.title}
                                </h3>
                                <p className="text-emerald-300 text-center">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sister Concerns Teaser */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-6">
                        Our Sister Concerns
                    </h2>
                    <p className="text-xl text-emerald-300 mb-16 max-w-3xl mx-auto">
                        Nine dynamic companies working together to shape a better future.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[
                            { name: "SB Medical", href: "/sister-concern/sb-medical" },
                            { name: "SB Education", href: "/sister-concern/sb-society" },
                            { name: "RM Apon Housing", href: "/sister-concern/apon-housing" },
                            { name: "SB Hotel", href: "/sister-concern/sb-hotel" },
                            { name: "SB Resort", href: "/sister-concern/sb-resort" },
                            { name: "SB Developer", href: "/sister-concern/sb-developer" },
                            { name: "SB Construction", href: "/sister-concern/sb-construction" },
                            { name: "SB Cosmetics", href: "/sister-concern/sb-cosmetics" },
                            { name: "SB Pharma", href: "/sister-concern/sb-pharma" },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className="group bg-emerald-900/40 backdrop-blur-md rounded-xl p-6 border border-emerald-800/50 hover:border-emerald-600 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <h3 className="text-lg font-medium text-emerald-100 group-hover:text-emerald-300 transition-colors">
                                    {item.name}
                                </h3>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Link
                            href="/sister-concern"
                            className="inline-flex items-center gap-3 text-emerald-400 hover:text-emerald-300 text-xl font-medium transition"
                        >
                            View All Sister Concerns
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Chairman's Message Teaser */}
            <section className="py-20 md:py-28 px-6 bg-emerald-900/30">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-12">
                        From Our Chairman
                    </h2>

                    <div className="bg-emerald-900/50 backdrop-blur-xl rounded-3xl border border-emerald-800/40 p-10 md:p-16 shadow-2xl max-w-4xl mx-auto">
                        <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed mb-10 font-light italic">
                            "Our mission has always been simple yet profound: to build institutions and opportunities
                            that serve people first. Every project, every product, every life we touch — is a step
                            toward a better tomorrow for Bangladesh."
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-700/50 flex-shrink-0">
                                <img
                                    src="/images/chairman.jpg"
                                    alt="Chairman SB Group"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-serif font-bold text-emerald-100">
                                    Shuvo Chowdhury
                                </h3>
                                <p className="text-lg text-emerald-300">
                                    Chairman, SB Group
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-3 text-emerald-400 hover:text-emerald-300 text-xl font-medium transition"
                        >
                            Read Full Message & Our Story
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-emerald-950 via-emerald-900/50 to-emerald-950">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-50 mb-8">
                        Together, We Build Tomorrow
                    </h2>
                    <p className="text-xl md:text-2xl text-emerald-300 mb-12 max-w-4xl mx-auto">
                        From healthcare to housing, from education to enterprise — SB Group is committed to creating
                        meaningful impact across Bangladesh.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="https://api.whatsapp.com/send?phone=%2B8801901926127&fbclid=IwY2xjawPkLbNleHRuA2FlbQIxMABicmlkETF6M3dpSkxEc3M2UkRxZjhIc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHhmOB5jKCalBTyaGvaNoTK7UMLlA4H2-K9aAhbemuu-PZ0dw7B9J8FoCpLIN_aem_Qq1XCDhSWcD_uZ-t0X6DZA"
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-6 rounded-full text-xl font-medium transition shadow-2xl hover:shadow-3xl"
                        >
                            Contact Us Today
                        </Link>
                        <Link
                            href="https://www.linkedin.com/company/sb-group-bangladesh"
                            className="bg-transparent border-2 border-emerald-600 hover:bg-emerald-900/40 text-emerald-300 px-12 py-6 rounded-full text-xl font-medium transition backdrop-blur-sm"
                        >
                            Join Our Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-emerald-950 border-t border-emerald-800/50 py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-emerald-100 mb-6">SB Group</h3>
                        <p className="text-emerald-400">
                            Building trust. Creating value. Serving Bangladesh.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-emerald-300">
                            <li><Link href="/about" className="hover:text-emerald-200 transition">About Us</Link></li>
                            <li><Link href="/sister-concern" className="hover:text-emerald-200 transition">Sister Concerns</Link></li>
                            <li><Link href="/projects" className="hover:text-emerald-200 transition">Projects</Link></li>
                            <li><Link href="/njbl-products" className="hover:text-emerald-200 transition">NJBL Products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Contact</h4>
                        <p className="text-emerald-400">Road No: 1/A, House No: 20, Block: J, Baridhara, Dhaka – 1212</p>
                        <p className="text-emerald-400 mt-2">njbd0001@gmail.com</p>
                        <p className="text-emerald-400">+880 01901-926127</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Follow Us</h4>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <a href="https://www.facebook.com/sb.njbl" className="text-emerald-400 hover:text-emerald-200 transition">NJBL Facebook</a>
                            <a href="https://www.facebook.com/profile.php?id=61586902495896" className="text-emerald-400 hover:text-emerald-200 transition">SB Facebook</a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-emerald-800/50 text-center text-emerald-500 text-sm">
                    © {new Date().getFullYear()} SB Group. All rights reserved.
                </div>
            </footer>
        </div>
    );
}