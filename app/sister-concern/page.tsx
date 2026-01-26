"use client";

import Link from "next/link";
import { HeartPulse, GraduationCap, Home, Hotel, Building2, Factory, Palette, Pill, Briefcase } from "lucide-react";
import { ArrowRight } from "lucide-react";

const sisterConcerns = [
    {
        slug: "sb-medical",
        title: "SB Medical College & Hospital",
        tagline: "Compassionate Care & Medical Excellence",
        description: "A leading tertiary care hospital and medical college dedicated to quality healthcare and education.",
        icon: HeartPulse,
        accent: "text-red-400",
        href: "/sister-concern/sb-medical"
    },
    {
        slug: "sb-society",
        title: "SB Health & Education Society",
        tagline: "Empowering Lives Through Learning & Wellness",
        description: "Focused on free education, scholarships, health camps, and community development programs.",
        icon: GraduationCap,
        accent: "text-emerald-400",
        href: "/sister-concern/sb-society"
    },
    {
        slug: "apon-housing",
        title: "RM Apon Housing",
        tagline: "Dream Homes, Built with Trust",
        description: "Modern, affordable residential projects with smart design and family-centric living.",
        icon: Home,
        accent: "text-amber-400",
        href: "/sister-concern/apon-housing"
    },
    {
        slug: "sb-hotel",
        title: "SB 3 Star Hotel",
        tagline: "Warm Hospitality Meets Modern Comfort",
        description: "A premium 3-star hotel offering exceptional service, dining, and event facilities.",
        icon: Hotel,
        accent: "text-purple-400",
        href: "/sister-concern/sb-hotel"
    },
    {
        slug: "sb-resort",
        title: "SB Resort & Housing",
        tagline: "Luxury Living in Harmony with Nature",
        description: "Premium resort-style residential community with villas, lakes, and world-class amenities.",
        icon: Building2,
        accent: "text-cyan-400",
        href: "/sister-concern/sb-resort"
    },
    {
        slug: "sb-developer",
        title: "SB Developer",
        tagline: "Shaping the Future of Urban Living",
        description: "Trusted real estate developer delivering iconic commercial and residential landmarks.",
        icon: Building2,
        accent: "text-blue-400",
        href: "/sister-concern/sb-developer"
    },
    {
        slug: "sb-construction",
        title: "SB Construction",
        tagline: "Strength, Precision, Reliability",
        description: "Expert construction services for high-rise buildings, infrastructure, and industrial projects.",
        icon: Factory,
        accent: "text-orange-400",
        href: "/sister-concern/sb-construction"
    },
    {
        slug: "sb-cosmetics",
        title: "SB Cosmetics",
        tagline: "Beauty Crafted with Care",
        description: "Premium natural skincare, haircare, and makeup products made for modern beauty needs.",
        icon: Palette,
        accent: "text-pink-400",
        href: "/sister-concern/sb-cosmetics"
    },
    {
        slug: "sb-pharma",
        title: "SB Pharmaceuticals",
        tagline: "Trusted Medicine for Every Family",
        description: "High-quality generic and branded medicines ensuring affordability and efficacy.",
        icon: Pill,
        accent: "text-green-400",
        href: "/sister-concern/sb-pharma"
    }
];

export default function SisterConcernsOverview() {
    return (
        <div className="min-h-screen bg-emerald-950 py-16 px-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-emerald-100 tracking-tight mb-6">
                    SB Group Sister Concerns
                </h1>
                <p className="text-xl md:text-2xl text-emerald-300 max-w-4xl mx-auto">
                    Diversified excellence across healthcare, education, real estate, hospitality, construction, cosmetics, and pharmaceuticals — building a stronger Bangladesh.
                </p>
            </div>

            {/* Grid of Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sisterConcerns.map((concern) => (
                    <Link
                        key={concern.slug}
                        href={concern.href}
                        className="group relative bg-emerald-900/40 backdrop-blur-xl rounded-2xl border border-emerald-800/50 overflow-hidden hover:border-emerald-600/70 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                        {/* Icon Header */}
                        <div className={`h-28 flex items-center justify-center ${concern.accent} bg-emerald-950/60 border-b border-emerald-800/50`}>
                            <concern.icon size={64} className="drop-shadow-lg" />
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-100 mb-4 group-hover:text-emerald-300 transition-colors">
                                {concern.title}
                            </h2>
                            <p className="text-emerald-300 text-lg mb-6 line-clamp-3">
                                {concern.tagline}
                            </p>
                            <p className="text-emerald-400/90 text-base mb-8 line-clamp-4">
                                {concern.description}
                            </p>

                            <div className="flex items-center justify-between">
                <span className="text-emerald-400 group-hover:text-emerald-300 font-medium flex items-center gap-2">
                  Learn more
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CTA at bottom */}
            <div className="max-w-4xl mx-auto text-center mt-20">
                <p className="text-2xl text-emerald-200 mb-8">
                    Part of something bigger — discover how SB Group is shaping the future.
                </p>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-6 rounded-full text-xl font-medium transition shadow-2xl hover:shadow-3xl"
                >
                    Learn About SB Group
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        </div>
    );
}