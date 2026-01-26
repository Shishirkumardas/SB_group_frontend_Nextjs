"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import { ArrowRight, Users, Building2, ShieldCheck, Store, Package, Handshake } from "lucide-react";

const projectsData = {
    "shopping-mall": {
        title: "SB Group Shopping Mall",
        tagline: "Your Premier Shopping & Lifestyle Destination",
        description: "The SB Group Shopping Mall is a state-of-the-art retail and entertainment complex designed to offer world-class shopping, dining, and leisure experiences under one roof. Located in a prime area of Dhaka, it brings together international and local brands, modern facilities, and family-friendly entertainment.",
        heroImage: "/images/projects/shopping-mall-hero.jpg",
        keyFeatures: [
            "Over 200 retail stores & international brands",
            "Multi-screen cineplex & family entertainment zone",
            "Food court with 30+ dining options",
            "Underground & rooftop parking for 1,200+ vehicles",
            "Modern event spaces & rooftop garden",
            "High-speed elevators & escalators",
            "24/7 security & CCTV surveillance"
        ],
        icon: Building2,
        accentColor: "text-emerald-400",
        ctaText: "Visit the Mall",
        ctaLink: "#"
    },

    "shopping-mall-director": {
        title: "Shopping Mall Director",
        tagline: "Leadership & Strategic Management Portal",
        description: "The Shopping Mall Director portal is an exclusive platform for mall management, directors, and key stakeholders. It provides real-time analytics, tenant performance tracking, event planning tools, financial dashboards, and secure communication channels to ensure smooth operations and growth.",
        heroImage: "/images/projects/mall-director-hero.jpg",
        keyFeatures: [
            "Real-time sales & footfall analytics",
            "Tenant rent & utility management",
            "Event & promotion calendar",
            "Secure document sharing & approvals",
            "Maintenance & facility request system",
            "Executive performance reports",
            "Role-based access control"
        ],
        icon: Users,
        accentColor: "text-blue-400",
        ctaText: "Access Director Portal",
        ctaLink: "/login" // or actual auth link
    },

    "shopping-mall-share-holder": {
        title: "Shopping Mall Share Holder",
        tagline: "Investor Dashboard & Shareholder Portal",
        description: "The Shareholder Portal offers transparent access to financial performance, dividend information, project updates, AGM documents, and investment analytics for all shareholders of the SB Group Shopping Mall project. Stay informed and engaged in the growth of this landmark development.",
        heroImage: "/images/projects/shareholder-hero.jpg",
        keyFeatures: [
            "Live financial statements & ROI tracking",
            "Dividend distribution history & schedule",
            "Annual General Meeting materials",
            "Project progress reports & photos",
            "Secure shareholder communication",
            "Investment certificate download",
            "Exclusive investor events & updates"
        ],
        icon: Handshake,
        accentColor: "text-amber-400",
        ctaText: "Shareholder Login",
        ctaLink: "/login"
    },

    "root-authority": {
        title: "Root Authority",
        tagline: "Central Governance & Control System",
        description: "Root Authority is the core administrative backbone of SB Group's ecosystem. It serves as the centralized authority platform for managing permissions, compliance, strategic decisions, inter-company coordination, and high-level oversight across all sister concerns and projects.",
        heroImage: "/images/projects/root-authority-hero.jpg",
        keyFeatures: [
            "Multi-entity access control & SSO",
            "Compliance & audit trail dashboard",
            "Cross-company reporting & analytics",
            "Board-level document vault",
            "Strategic KPI monitoring",
            "Crisis & risk management module",
            "Executive decision logging"
        ],
        icon: ShieldCheck,
        accentColor: "text-purple-400",
        ctaText: "Enter Root Authority",
        ctaLink: "/login"
    },

    "dealer": {
        title: "Dealer Network",
        tagline: "Partner Portal for Authorized Dealers",
        description: "The SB Group Dealer Portal empowers authorized dealers with tools to manage inventory, place orders, track deliveries, view incentives, access marketing materials, and receive real-time updates — helping partners grow their business efficiently.",
        heroImage: "/images/projects/dealer-hero.jpg",
        keyFeatures: [
            "Real-time stock & pricing visibility",
            "Online order placement & tracking",
            "Incentive & commission dashboard",
            "Marketing kit & promotional assets",
            "Training resources & certifications",
            "Dedicated support ticketing",
            "Performance analytics"
        ],
        icon: Store,
        accentColor: "text-cyan-400",
        ctaText: "Dealer Login",
        ctaLink: "/login"
    },

    "depo": {
        title: "Depo Management",
        tagline: "Efficient Supply Chain & Depot Operations",
        description: "The Depo Management System streamlines warehousing, distribution, inventory control, and logistics across SB Group's supply chain network. It ensures timely delivery, optimal stock levels, and full traceability from production to point of sale.",
        heroImage: "/images/projects/depo-hero.jpg",
        keyFeatures: [
            "Multi-depot inventory synchronization",
            "Barcode & RFID tracking",
            "Delivery scheduling & route optimization",
            "Stock aging & expiry alerts",
            "Vendor & transporter management",
            "Real-time dispatch & proof-of-delivery",
            "Warehouse performance analytics"
        ],
        icon: Package,
        accentColor: "text-orange-400",
        ctaText: "Depo Dashboard",
        ctaLink: "/login"
    }
};

export default function ProjectPage() {
    const params = useParams();
    const slug = params.slug as string;

    const project = projectsData[slug as keyof typeof projectsData];

    if (!project) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-6">
                <div className="text-center max-w-lg">
                    <h1 className="text-6xl font-serif font-bold text-emerald-100 mb-8">404</h1>
                    <h2 className="text-3xl font-medium text-emerald-200 mb-6">Project Not Found</h2>
                    <p className="text-xl text-emerald-300 mb-12">
                        The project page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link
                        href="/projects"
                        className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-5 rounded-full text-xl font-medium transition shadow-xl"
                    >
                        Back to All Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section
                className="relative h-[500px] md:h-[650px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${project.heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-emerald-950/90" />
                <div className="relative z-10 px-6 max-w-5xl">
                    <div className={`w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-2xl bg-emerald-950/60 backdrop-blur-md flex items-center justify-center border border-emerald-800/50 ${project.accentColor}`}>
                        <project.icon size={64} className="md:size-80" />
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 text-emerald-50 drop-shadow-2xl">
                        {project.title}
                    </h1>
                    <p className="text-2xl md:text-3xl font-light text-emerald-200 drop-shadow-lg max-w-4xl mx-auto">
                        {project.tagline}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                <div className="bg-emerald-900/40 backdrop-blur-xl rounded-3xl border border-emerald-800/40 p-10 md:p-16 shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-10">
                        About {project.title}
                    </h2>

                    <p className="text-xl text-emerald-200 leading-relaxed mb-12">
                        {project.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {project.keyFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-emerald-950/60 flex items-center justify-center flex-shrink-0 border border-emerald-800/50">
                                    <span className="text-emerald-400 text-2xl">✓</span>
                                </div>
                                <p className="text-lg text-emerald-100">{feature}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href={project.ctaLink}
                            className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-6 rounded-full text-xl font-medium transition shadow-xl hover:shadow-2xl group"
                        >
                            {project.ctaText}
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}