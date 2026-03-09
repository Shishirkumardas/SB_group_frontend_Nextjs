"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Users,
    Building2,
    ShieldCheck,
    Store,
    Package,
    Handshake, Moon, ShoppingCart, Home, UserCheck, Truck, HeartHandshake, Sparkles,
} from "lucide-react";

const projectsData = {
    "shopping-mall": {
        title: "SB Group Shopping Mall",
        tagline: "Your Premier Shopping & Lifestyle Destination",
        descriptionType: "dealer",
        heroImage: "/images/projects/shopping-mall-hero.jpg",
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
        heroImage: "/images/projects/mall-director-hero.jpg",
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

    "shopping-mall-share-holder": {
        title: "Shopping Mall Share Holder",
        tagline: "Investor Dashboard & Shareholder Portal",
        descriptionType: "dealer",
        heroImage: "/images/projects/shareholder-hero.jpg",
        keyFeatures: [
            "Live financial statements & ROI tracking",
            "Dividend distribution history & schedule",
            "Annual General Meeting materials",
            "Project progress reports & photos",
            "Secure shareholder communication",
            "Investment certificate download",
            "Exclusive investor events & updates",
        ],
        icon: Handshake,
        accentColor: "text-amber-400",
        ctaText: "Shareholder Login",
        ctaLink: "/login",
    },

    "root-authority": {
        title: "Root Authority",
        tagline: "Central Governance & Control System",
        descriptionType: "dealer",
        heroImage: "/images/projects/root-authority-hero.jpg",
        keyFeatures: [
            "Multi-entity access control & SSO",
            "Compliance & audit trail dashboard",
            "Cross-company reporting & analytics",
            "Board-level document vault",
            "Strategic KPI monitoring",
            "Crisis & risk management module",
            "Executive decision logging",
        ],
        icon: ShieldCheck,
        accentColor: "text-purple-400",
        ctaText: "Enter Root Authority",
        ctaLink: "/login",
    },

    dealer: {
        title: "Dealer Network",
        tagline: "Partner Portal for Authorized Dealers",
        descriptionType: "dealer",
        heroImage: "/images/projects/dealer-hero.jpg",
        keyFeatures: [
        ],
        icon: Store,
        accentColor: "text-cyan-400",
        ctaText: "Dealer Login",
        ctaLink: "/login",
    },

    depo: {
        title: "Depo Management",
        tagline: "Efficient Supply Chain & Depot Operations",
        descriptionType: "dealer",
        heroImage: "/images/projects/depo-hero.jpg",
        keyFeatures: [
            "Multi-depot inventory synchronization",
            "Barcode & RFID tracking",
            "Delivery scheduling & route optimization",
            "Stock aging & expiry alerts",
            "Vendor & transporter management",
            "Real-time dispatch & proof-of-delivery",
            "Warehouse performance analytics",
        ],
        icon: Package,
        accentColor: "text-orange-400",
        ctaText: "Depo Dashboard",
        ctaLink: "/login",
    },
    // ── New Projects Added Below ─────────────────────────────────────────────

    "delivery-food-package": {
        title: "ডেলিভারি ফুড প্যাকেজ + গ্রাহক রিওয়ার্ড",
        tagline: "Food Delivery with Customer Reward System",
        descriptionType: "dealer",
        heroImage: "/images/projects/food-delivery-hero.jpg",
        keyFeatures: [
            "Integrated food delivery tracking",
            "Customer reward points on every order",
            "Cashback & discount voucher system",
            "Restaurant partner dashboard",
            "Real-time order status updates",
            "Delivery partner incentive program",
        ],
        icon: Package,
        accentColor: "text-rose-400",
        ctaText: "Explore Food Delivery Program",
        ctaLink: "/login",
    },

    "double-benefit-program": {
        title: "দ্বিগুণ সুবিধা (Reward-Benefit) প্রোগ্রাম",
        tagline: "Double Advantage Reward & Benefit Program",
        descriptionType: "dealer",
        heroImage: "/images/projects/double-benefit-hero.jpg",
        keyFeatures: [
            "Dual reward system for customers & partners",
            "Points + cashback combination",
            "Tiered benefit levels",
            "Referral bonuses",
            "Seasonal double-point campaigns",
            "Transparent reward tracking",
        ],
        icon: Sparkles, // or use Gift, Star from lucide if you import it
        accentColor: "text-yellow-400",
        ctaText: "Join Double Benefit Program",
        ctaLink: "/login",
    },

    "dealer-non-delivery-partner": {
        title: "ডিলার + নন-ডেলিভারি পার্টনার প্রোগ্রাম",
        tagline: "Dealer + Non-Delivery Partner Program",
        descriptionType: "dealer",
        heroImage: "/images/projects/partner-program-hero.jpg",
        keyFeatures: [
            "Flexible investment options",
            "Weekly / monthly income streams",
            "No delivery responsibility option",
            "Marketing & branding support",
            "Training for non-delivery partners",
            "Lifetime partnership benefits",
        ],
        icon: Handshake,
        accentColor: "text-indigo-400",
        ctaText: "Become a Partner",
        ctaLink: "/login",
    },

    "amrityu-subidha": {
        title: "আমৃত্যু সুবিধা v01",
        tagline: "Lifetime Benefits Program v01",
        descriptionType: "dealer",
        heroImage: "/images/projects/lifetime-benefit-hero.jpg",
        keyFeatures: [
            "Lifetime commission on network",
            "Family transferable benefits",
            "Long-term security & pension-like income",
            "Legacy planning support",
            "Special events for lifetime members",
            "Priority access to new projects",
        ],
        icon: HeartHandshake, // or Infinity if you import it
        accentColor: "text-pink-400",
        ctaText: "Learn About Lifetime Benefits",
        ctaLink: "/login",
    },

    "truck-sale-food-distribution": {
        title: "ট্রাক সেল ফুড ডিস্ট্রিবিউশন",
        tagline: "Truck Sale Food Distribution Network",
        descriptionType: "dealer",
        heroImage: "/images/projects/truck-sale-hero.jpg",
        keyFeatures: [
            "Mobile food distribution via trucks",
            "Direct-to-consumer sales model",
            "Route-based delivery planning",
            "Freshness & quality control system",
            "Cash & mobile payment integration",
            "Daily sales reporting",
        ],
        icon: Truck,
        accentColor: "text-red-400",
        ctaText: "Join Truck Sale Network",
        ctaLink: "/login",
    },

    "development-officer-benefit": {
        title: "উন্নয়ন কর্মকর্তাদের বিশেষ সুবিধা নীতিমালা v01",
        tagline: "Special Benefits Policy for Development Officers v01",
        descriptionType: "dealer",
        heroImage: "/images/projects/dev-officer-hero.jpg",
        keyFeatures: [
            "Performance-based incentives",
            "Travel & accommodation allowance",
            "Training & skill development fund",
            "Family medical support",
            "Promotion & career growth path",
            "Retirement & long-service awards",
        ],
        icon: UserCheck,
        accentColor: "text-teal-400",
        ctaText: "View Officer Benefits",
        ctaLink: "/login",
    },

    "shopping-mall-program": {
        title: "শপিংমল প্রোগ্রাম",
        tagline: "Shopping Mall Partnership Program",
        descriptionType: "dealer",
        heroImage: "/images/projects/mall-program-hero.jpg",
        keyFeatures: [
            "Exclusive shop/space allocation",
            "Marketing support from mall",
            "Footfall-driven sales boost",
            "Event participation opportunity",
            "Branding on mall digital screens",
            "Priority lease renewal",
        ],
        icon: Building2,
        accentColor: "text-violet-400",
        ctaText: "Join Mall Program",
        ctaLink: "/login",
    },

    "women-entrepreneur": {
        title: "নারী উদ্যোক্তা প্রোগ্রাম",
        tagline: "Women Entrepreneur Empowerment Program",
        descriptionType: "dealer",
        heroImage: "/images/projects/women-entrepreneur-hero.jpg",
        keyFeatures: [
            "Special training for women",
            "Low-investment entry options",
            "Mentorship from successful entrepreneurs",
            "Priority funding & loan support",
            "Women-only networking events",
            "Product showcase opportunities",
        ],
        icon: Users,
        accentColor: "text-fuchsia-400",
        ctaText: "Empower Your Journey",
        ctaLink: "/login",
    },

    "apon-housing": {
        title: "আপন হাউজিং",
        tagline: "Apon Housing Project",
        descriptionType: "dealer",
        heroImage: "/images/projects/apon-housing-hero.jpg",
        keyFeatures: [
            "Affordable residential plots",
            "Modern community facilities",
            "Easy installment plans",
            "Legal & documentation support",
            "Green & eco-friendly design",
            "Security & maintenance services",
        ],
        icon: Home,
        accentColor: "text-lime-400",
        ctaText: "Explore Apon Housing",
        ctaLink: "/login",
    },

    "amar-bazar": {
        title: "আমার বাজার প্রকল্প",
        tagline: "Amar Bazar Project",
        descriptionType: "dealer",
        heroImage: "/images/projects/amar-bazar-hero.jpg",
        keyFeatures: [
            "Local market digitization",
            "Direct farmer-to-consumer platform",
            "Daily fresh product delivery",
            "Price transparency & comparison",
            "Vendor registration & management",
            "Community marketplace features",
        ],
        icon: ShoppingCart,
        accentColor: "text-green-400",
        ctaText: "Discover Amar Bazar",
        ctaLink: "/login",
    },

    "ramadan-project": {
        title: "রমাদান প্রকল্প",
        tagline: "Ramadan Special Project",
        descriptionType: "dealer",
        heroImage: "/images/projects/ramadan-hero.jpg",
        keyFeatures: [
            "Iftar & Sehri package distribution",
            "Discounts on essentials",
            "Charity & donation integration",
            "Ramadan calendar & reminders",
            "Special dealer incentives",
            "Community iftar events",
        ],
        icon: Moon,
        accentColor: "text-amber-500",
        ctaText: "Join Ramadan Campaign",
        ctaLink: "/login",
    },
};

function DealerDescription() {
    return (
        <div className="space-y-16 text-emerald-200">
            {/* 1. ডিলারশিপ গ্রহণের সুযোগ */}
            <section>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-emerald-100 mb-8">
                    🔷 ডিলারশিপ গ্রহণের সুযোগ
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* পূর্ণ ডিলারশিপ */}
                    <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/50 hover:border-emerald-600/70 transition-all">
                        <h4 className="text-2xl font-semibold text-emerald-50 mb-4">
                            🏢 পূর্ণ ডিলারশিপ
                        </h4>
                        <p className="font-medium mb-3 text-emerald-300">বিনিয়োগ: ১০,০০,০০০ টাকা</p>
                        <ul className="list-disc list-inside space-y-2 text-emerald-100">
                            <li>নিজস্ব অফিস সুবিধা</li>
                            <li>৭২ ঘণ্টার মধ্যে প্রোডাক্ট ডেলিভারি</li>
                            <li>মাল বিক্রয়ের পূর্ণ সুযোগ</li>
                            <li>কোম্পানির দক্ষ অফিসিয়াল সাপোর্ট</li>
                        </ul>
                        <p className="mt-4 font-semibold text-emerald-300">কমিশন: ৫%</p>
                    </div>

                    {/* আংশিক ডিলারশিপ */}
                    <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/50 hover:border-emerald-600/70 transition-all">
                        <h4 className="text-2xl font-semibold text-emerald-50 mb-4">
                            🏬 আংশিক ডিলারশিপ
                        </h4>
                        <p className="font-medium mb-3 text-emerald-300">বিনিয়োগ: ৫,০০,০০০ টাকা</p>
                        <ul className="list-disc list-inside space-y-2 text-emerald-100">
                            <li>গুদাম ভাড়া সুবিধা</li>
                            <li>৭২ ঘণ্টার মধ্যে ডেলিভারি</li>
                            <li>অফিসিয়াল সাপোর্ট</li>
                        </ul>
                        <p className="mt-4 font-semibold text-emerald-300">কমিশন: ৫%</p>
                    </div>

                    {/* বেসিক ডিলারশিপ */}
                    <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/50 hover:border-emerald-600/70 transition-all">
                        <h4 className="text-2xl font-semibold text-emerald-50 mb-4">
                            📦 বেসিক ডিলারশিপ
                        </h4>
                        <p className="font-medium mb-3 text-emerald-300">বিনিয়োগ: ৩,০০,০০০ টাকা</p>
                        <ul className="list-disc list-inside space-y-2 text-emerald-100">
                            <li>নিজ দায়িত্বে গুদাম</li>
                            <li>৭২ ঘণ্টার মধ্যে ডেলিভারি</li>
                            <li>অফিসিয়াল সাপোর্ট</li>
                        </ul>
                        <p className="mt-4 font-semibold text-emerald-300">কমিশন: ৫%</p>
                    </div>
                </div>
            </section>

            {/* 2. নন-ডেলিভারি ডিলারশিপ (সাপ্তাহিক আয়) */}
            <section>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-emerald-100 mb-8">
                    🔷 নন-ডেলিভারি ডিলারশিপ (সাপ্তাহিক আয়)
                </h3>

                <div className="overflow-x-auto rounded-xl border border-emerald-800/50 shadow-lg">
                    <table className="w-full text-sm text-left text-emerald-100">
                        <thead className="text-xs uppercase bg-emerald-900/70">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">বিনিয়োগ</th>
                            <th scope="col" className="px-6 py-4 font-semibold">সাপ্তাহিক আয়</th>
                            <th scope="col" className="px-6 py-4 font-semibold">সার্ভিস চার্জ</th>
                            <th scope="col" className="px-6 py-4 font-semibold">নেট আয়</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-800/40">
                        {[
                            ["১০,০০,০০০ টাকা", "১০,০০০ টাকা", "১,০০০ টাকা", "৯,০০০ টাকা"],
                            ["৫,০০,০০০ টাকা", "৫,০০০ টাকা", "৫০০ টাকা", "৪,৫০০ টাকা"],
                            ["৩,০০,০০০ টাকা", "৩,০০০ টাকা", "৩০০ টাকা", "২,৭০০ টাকা"],
                            ["২,০০,০০০ টাকা", "২,০০০ টাকা", "২০০ টাকা", "১,৮০০ টাকা"],
                            ["১,০০,০০০ টাকা", "১,০০০ টাকা", "১০০ টাকা", "৯০০ টাকা"],
                        ].map((row, i) => (
                            <tr key={i} className="bg-emerald-950/30 hover:bg-emerald-950/50 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 3. New section: মেয়াদি প্রকল্প (নন-ডেলিভারি) */}
            <section>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-emerald-100 mb-8">
                    🔷 মেয়াদি প্রকল্প (নন-ডেলিভারি)
                </h3>

                <div className="overflow-x-auto rounded-xl border border-emerald-800/50 shadow-lg">
                    <table className="w-full text-sm text-left text-emerald-100">
                        <thead className="text-xs uppercase bg-emerald-900/70">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">বিনিয়োগ</th>
                            <th scope="col" className="px-6 py-4 font-semibold">মেয়াদ</th>
                            <th scope="col" className="px-6 py-4 font-semibold">মোট রিটার্ন</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-800/40">
                        {[
                            ["২০,০০০ টাকা", "১০ মাস", "৪০,০০০ টাকা"],
                            ["১০,০০০ টাকা", "১০ মাস", "২০,০০০ টাকা"],
                            ["৫,০০০ টাকা", "১০ মাস", "১০,০০০ টাকা"],
                            ["২,০০০ টাকা", "১০ মাস", "৪,০০০ টাকা"],
                            ["১,০০০ টাকা", "১০ মাস", "২,০০০ টাকা"],
                        ].map((row, i) => (
                            <tr key={i} className="bg-emerald-950/30 hover:bg-emerald-950/50 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default function ProjectPage() {
    const params = useParams();
    const slug = params.slug as string;

    const project = projectsData[slug as keyof typeof projectsData];

    if (!project) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-6">
                <div className="text-center max-w-lg">
                    <h1 className="text-6xl font-serif font-bold text-emerald-100 mb-8">404</h1>
                    <h2 className="text-3xl font-medium text-emerald-200 mb-6">
                        Project Not Found
                    </h2>
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
            {/* Hero Section */}
            <section
                className="relative h-[500px] md:h-[650px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${project.heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-emerald-950/90" />
                <div className="relative z-10 px-6 max-w-5xl">
                    <div
                        className={`w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-2xl bg-emerald-950/60 backdrop-blur-md flex items-center justify-center border border-emerald-800/50 ${project.accentColor}`}
                    >
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

                    {project.descriptionType === "dealer" ? (
                        <DealerDescription />
                    ) : (
                        <p className="text-xl text-emerald-200 leading-relaxed mb-12 whitespace-pre-wrap">
                            {project.description}
                        </p>
                    )}

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