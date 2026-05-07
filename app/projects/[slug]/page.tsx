"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";
import Image from "next/image";
import {
    ArrowRight,
    Users,
    Building2,
    Package,
    Moon,
    ShoppingCart,
    Home,
    Truck,
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
        descriptionType: "shopping-mall-director",
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
        tagline: "Join Our Trusted Dealer Network",
        descriptionType: "dealer",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [
            "High commission & incentives",
            "Marketing & promotional support",
            "Training & business development",
            "Real-time order tracking",
            "Dedicated territory management",
            "Monthly performance bonus",
        ],
        icon: Users,
        accentColor: "text-blue-400",
        ctaText: "Become a Dealer",
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
        title: "Woman Entrepreneurship Program",
        tagline: "Woman Entrepreneurship Program",
        descriptionType: "woman-entrepreneurship-program",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Join Woman Entrepreneurship Program",
        ctaLink: "/login",
    },

    "development-officer-benefit": {
        title: "Development Officer Benefit",
        tagline: "Development Officer Benefit",
        descriptionType: "development-officer-benefit",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Join Now",
        ctaLink: "/login",
    },

    "amrityu-subidha": {
        title: "Life Long Benefit",
        tagline: "Life Long Benefit",
        descriptionType: "amrityu-subidha",
        heroImage: "/images/njbl-hero.jpg",
        keyFeatures: [],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Join Now",
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
        "shopping-mall-director": "/pdfs/shopping_mall.pdf",
        "amrityu-subidha": "/pdfs/life-long-benifit.pdf",
    };

    const magazineImageMap: Record<string, string> = {
        "apon-housing": "/magazine/apon_housing.jpg",
        "dealer": "/magazine/dealer-program.jpg",
        "shopping-mall": "/magazine/shopping-mall.jpg",
        "shopping-mall-director": "/magazine/shopping-mall.jpg",
        "delivery-food-package": "/magazine/food-package.jpg",
        "truck-sale-food-distribution": "/magazine/truck-sale.jpg",
        "ramadan-project": "/magazine/ramadan.jpg",
        "double-benefit-program": "/magazine/double-benefit.jpg",
        "amar-bazar": "/images/amar-bazar.jpg",
        "woman-entrepreneurship-program": "/magazine/woman-entrepreneur.jpg",
        "development-officer-benefit": "/images/special-benifit.jpg",
        "amrityu-subidha": "/magazine/life-long-benefit.jpg",
        default: "/magazine/default-project.jpg",
    };

    // ====================== REAL GOOGLE FORM URLs ======================
    const formMap: Record<string, string> = {
        "apon-housing": "https://docs.google.com/forms/d/e/1FAIpQLSc04oCryA3ONrHot4QoMuc6OQ7EXhwXonng8DoF_RfvtbTamQ/viewform?embedded=true",
        "dealer": "https://docs.google.com/forms/d/e/1FAIpQLSei8omNsRqaD0Irj-eLWl_dvAjqfhOo0DCKxnjp2C3tJXY9_g/viewform?embedded=true",
        "shopping-mall-director": "https://docs.google.com/forms/d/e/1FAIpQLSei8omNsRqaD0Irj-eLWl_dvAjqfhOo0DCKxnjp2C3tJXY9_g/viewform?embedded=true",
        "delivery-food-package": "https://docs.google.com/forms/d/e/1FAIpQLSei8omNsRqaD0Irj-eLWl_dvAjqfhOo0DCKxnjp2C3tJXY9_g/viewform?embedded=true",
        "truck-sale-food-distribution": "https://docs.google.com/forms/d/e/1FAIpQLSei8omNsRqaD0Irj-eLWl_dvAjqfhOo0DCKxnjp2C3tJXY9_g/viewform?embedded=true",
        "ramadan-project": "https://docs.google.com/forms/d/e/1FAIpQLSfc3c3c3c3c3c3c3c3c3c3c3/viewform?embedded=true",
        "double-benefit-program": "https://docs.google.com/forms/d/e/1FAIpQLSfd4d4d4d4d4d4d4d4d4d4d4/viewform?embedded=true",
        "amar-bazar": "https://docs.google.com/forms/d/e/1FAIpQLSei8omNsRqaD0Irj-eLWl_dvAjqfhOo0DCKxnjp2C3tJXY9_g/viewform?embedded=true",
        "woman-entrepreneurship-program": "https://docs.google.com/forms/d/e/1FAIpQLSff6f6f6f6f6f6f6f6f6f6f6f6f6/viewform?embedded=true",
        "development-officer-benefit": "https://docs.google.com/forms/d/e/1FAIpQLSfg7g7g7g7g7g7g7g7g7g7g7g7/viewform?embedded=true",
        "amrityu-subidha": "https://docs.google.com/forms/d/e/1FAIpQLSfh8h8h8h8h8h8h8h8h8h8h8h8/viewform?embedded=true",
        default: "https://docs.google.com/forms/d/e/YOUR_DEFAULT_FORM_ID/viewform?embedded=true",
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
                <h1 className="text-white text-4xl">Project Not Found</h1>
            </div>
        );
    }

    const magazineImage = magazineImageMap[slug] || magazineImageMap.default;
    const googleFormUrl = formMap[slug] || formMap.default;
    const pdfUrl = pdfMap[project.descriptionType];

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero Section */}
            <section
                className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${project.heroImage})` }}
            >
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 px-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        {project.title}
                    </h1>
                    <p className="text-2xl text-emerald-200">{project.tagline}</p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Magazine Image */}
                <div className="text-center mb-16">
                    <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-emerald-800">
                        <Image
                            src={magazineImage}
                            alt={`${project.title} Magazine Feature`}
                            width={1200}
                            height={1600}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* PDF Viewer */}
                {pdfUrl && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Details Document
                        </h2>
                        <PdfViewer pdfUrl={pdfUrl} />
                    </div>
                )}

                {/* Google Form */}
                <div className="bg-emerald-900/50 rounded-3xl p-8 md:p-10 border border-emerald-700">
                    <h2 className="text-3xl font-bold text-white text-center mb-6">
                        আগ্রহ প্রকাশ করুন / Express Your Interest
                    </h2>
                    <p className="text-emerald-300 text-center mb-10">
                        ফর্মটি পূরণ করে আমাদের টিমের সাথে যোগাযোগ করুন
                    </p>

                    <iframe
                        src={googleFormUrl}
                        width="100%"
                        height="800"
                        className="bg-white rounded-xl"
                        title="Interest Form"
                    >
                        Loading...
                    </iframe>
                </div>

                {/* Key Features */}
                {project.keyFeatures.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Key Features
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.keyFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-4 text-emerald-200">
                                    <span className="text-emerald-400">✓</span>
                                    <p>{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href={project.ctaLink}
                        className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-medium transition"
                    >
                        {project.ctaText}
                        <ArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}