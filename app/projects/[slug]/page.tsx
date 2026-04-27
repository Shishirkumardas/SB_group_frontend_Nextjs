"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";
import {
    ArrowRight,
    Users,
    Building2,
    // ShieldCheck,
    // Store,
    Package,
    // Handshake,
    Moon,
    ShoppingCart,
    Home,
    // UserCheck,
    Truck,
    // HeartHandshake,
    Sparkles,
} from "lucide-react";

const projectsData = {
    "shopping-mall": {
        title: "SB Group Shopping Mall",
        tagline: "Your Premier Shopping & Lifestyle Destination",
        descriptionType: "dealer",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Over 200 retail stores & international brands",
            "Multi-screen cineplex & family entertainment zone",
            "Food court with 30+ dining options",
            "Underground & rooftop parking for 1,200+ vehicles",
            "Modern event spaces & rooftop garden",
            "High-speed elevators & escalators",
            "24/7 security & CCTV surveillance",
        ],
        icon: Building2,
        accentColor: "text-emerald-400",
        ctaText: "Visit the Mall",
        ctaLink: "#",
    },

    "shopping-mall-director": {
        title: "Shopping Mall Director",
        tagline: "Leadership & Strategic Management Portal",
        descriptionType: "dealer",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Real-time sales & footfall analytics",
            "Tenant rent & utility management",
            "Event & promotion calendar",
            "Secure document sharing & approvals",
            "Maintenance & facility request system",
            "Executive performance reports",
            "Role-based access control",
        ],
        icon: Users,
        accentColor: "text-blue-400",
        ctaText: "Access Director Portal",
        ctaLink: "/login",
    },
    "dealer": {
        title: "Dealer and Non Delivery Partner",
        tagline: "Dealer and Non Delivery Partner",
        descriptionType: "dealer",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Real-time sales & footfall analytics",
            "Tenant rent & utility management",
            "Event & promotion calendar",
            "Secure document sharing & approvals",
            "Maintenance & facility request system",
            "Executive performance reports",
            "Role-based access control",
        ],
        icon: Users,
        accentColor: "text-blue-400",
        ctaText: "Access Director Portal",
        ctaLink: "/login",
    },

    "delivery-food-package": {
        title: "Food Delivery with Customer Reward System",
        tagline: "Food Delivery with Customer Reward System",
        descriptionType: "food",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "ভোক্তার সমর্থ্য, বাজারদর ও গুণগত মান বিবেচনায় প্রয়োজনীয় খাদ্যসামগ্রী ডেলিভারি ভিত্তিক প্যাকেজ",
            "প্যাকেজ মূল্য: ১,০০০/- টাকা",
            "ক্যাশব্যাক: প্রতি মাস ১০%",
            "NID verification",
        ],
        icon: Package,
        accentColor: "text-rose-400",
        ctaText: "Explore Food Delivery Program",
        ctaLink: "/login",
    },

    "double-benefit-program": {
        title: "Double Advantage Reward & Benefit Program",
        tagline: "Double Advantage Reward & Benefit Program",
        descriptionType: "double-benefit-program",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Dual reward system",
            "Points + cashback",
            "Tiered benefits",
        ],
        icon: Sparkles,
        accentColor: "text-yellow-400",
        ctaText: "Join Double Benefit Program",
        ctaLink: "/login",
    },

    "truck-sale-food-distribution": {
        title: "Truck Sale Food Distribution Network",
        tagline: "Truck Sale Food Distribution Network",
        descriptionType: "truck-sale",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Dealer-led truck sale model",
            "Food card system",
            "Dealer service fee",
        ],
        icon: Truck,
        accentColor: "text-red-400",
        ctaText: "Join Truck Sale Network",
        ctaLink: "/login",
    },

    "ramadan-project": {
        title: "Ramadan Special Project",
        tagline: "Ramadan Special Project",
        descriptionType: "ramadan-project",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Iftar packages",
            "Discount essentials",
            "Community charity",
        ],
        icon: Moon,
        accentColor: "text-amber-500",
        ctaText: "Join Ramadan Campaign",
        ctaLink: "/login",
    },

    "apon-housing": {
        title: "Apon Housing Project",
        tagline: "Apon Housing Project",
        descriptionType: "apon-housing",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Affordable plots",
            "Installment plans",
            "Green housing",
        ],
        icon: Home,
        accentColor: "text-lime-400",
        ctaText: "Explore Apon Housing",
        ctaLink: "/login",
    },

    "amar-bazar": {
        title: "Amar Bazar Project",
        tagline: "Amar Bazar Project",
        descriptionType: "amar-bazar",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Farmer to consumer platform",
            "Fresh delivery",
            "Vendor system",
        ],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Discover Amar Bazar",
        ctaLink: "/login",
    },
    "woman-entrepreneurship-program": {
        title: "woman entrepreneurship program",
        tagline: "woman entrepreneurship program",
        descriptionType: "woman-entrepreneurship-program",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Farmer to consumer platform",
            "Fresh delivery",
            "Vendor system",
        ],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Discover Amar Bazar",
        ctaLink: "/login",
    },
    "development-officer-benefit": {
        title: "Development Officer Benefit",
        tagline: "Development Officer Benefit",
        descriptionType: "development-officer-benefit",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Farmer to consumer platform",
            "Fresh delivery",
            "Vendor system",
        ],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Discover Amar Bazar",
        ctaLink: "/login",
    },
    "amrityu-subidha": {
        title: "Life Long Benefit",
        tagline: "Life Long Benefit",
        descriptionType: "amrityu-subidha",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "Farmer to consumer platform",
            "Fresh delivery",
            "Vendor system",
        ],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Discover Amar Bazar",
        ctaLink: "/login",
    },
};

export default function ProjectPage() {
    const params = useParams();
    const slug = params.slug as string;

    const project = projectsData[slug as keyof typeof projectsData];

    const pdfMap: Record<string, string> = {
        dealer: "/pdfs/dealership.pdf",
        food: "/pdfs/food-package.pdf",
        "truck-sale": "/pdfs/truck_sell.pdf",
        "ramadan-project": "/pdfs/ramadan.pdf",
        "double-benefit-program": "/pdfs/double-benifit.pdf",
        "development-officer-benefit": "/pdfs/developer_benifit.pdf",
        "amar-bazar": "/pdfs/amar-bazar.pdf",
        "apon-housing": "/pdfs/apon_housing.pdf",
        "woman-entrepreneurship-program": "/pdfs/woman-entraprenure.pdf",
        "shopping-mall-program": "/pdfs/dealership.pdf",
        "amrityu-subidha": "/pdfs/life-long-benifit.pdf",
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
                <h1 className="text-white text-4xl">Project Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section
                className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${project.heroImage})` }}
            >
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        {project.title}
                    </h1>

                    <p className="text-2xl text-emerald-200">
                        {project.tagline}
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* PDF VIEWER */}
                {pdfMap[project.descriptionType] && (
                    <div className="mb-16">
                        <PdfViewer pdfUrl={pdfMap[project.descriptionType]} />
                    </div>
                )}

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {project.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex gap-4 text-emerald-200">
                            <span>✓</span>
                            <p>{feature}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href={project.ctaLink}
                        className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-4 rounded-full"
                    >
                        {project.ctaText}
                        <ArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}