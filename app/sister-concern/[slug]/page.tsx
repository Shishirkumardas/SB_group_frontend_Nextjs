"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";



const sisterConcerns = {
    "sb-medical": {
        title: "SB Medical College & Hospital",
        tagline: "Quality Healthcare for a Healthier Tomorrow",
        description: "SB Medical College & Hospital is committed to providing world-class medical education and compassionate healthcare services to the people of Bangladesh. With state-of-the-art facilities and highly qualified professionals, we strive to set new benchmarks in medical care and education.",
        image: "/images/sb-medical-hero.jpg",
        features: [
            "Modern 500+ bed tertiary care hospital",
            "MBBS & postgraduate medical programs",
            "24/7 emergency & trauma center",
            "Specialized departments: Cardiology, Neurology, Oncology",
            "Community health outreach programs"
        ],
        cta: "Visit Hospital Website",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-society": {
        title: "SB Health & Education Society",
        tagline: "Empowering Communities Through Education & Health",
        description: "The SB Health & Education Society works tirelessly to improve access to quality education and healthcare in underprivileged areas. Through scholarships, free medical camps, and skill development programs, we aim to build a stronger, healthier society.",
        image: "/images/sb-society-hero.jpg",
        features: [
            "Free schooling for 2,000+ underprivileged children",
            "Annual free health camps in rural areas",
            "Vocational training & skill development centers",
            "Scholarships for meritorious students",
            "Women empowerment & literacy programs"
        ],
        cta: "Support Our Mission",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "apon-housing": {
        title: "RM Apon Housing",
        tagline: "Dream Homes, Built with Trust",
        description: "🌍 New Journey Bangladesh Ltd. – Building Dreams with Transparency | স্বচ্ছতায় গড়ে তুলি স্বপ্নের ঠিকানা 🏡\n" +
            "✨ Our Vision | আমাদের লক্ষ্য:\n" +
            "To transform well-located land into valuable opportunities by offering transparent, secure, and fair land transactions that help buyers build their future with confidence.\n" +
            "ভালো অবস্থানের জমিকে মূল্যবান সুযোগে রূপান্তর করা — স্বচ্ছ, নিরাপদ ও ন্যায্য লেনদেনের মাধ্যমে ক্রেতাদের আত্মবিশ্বাসের সঙ্গে ভবিষ্যৎ গড়তে সহায়তা করা।\n" +
            "📍 Project Location | প্রকল্পের অবস্থান:\n" +
            "Mouja Boro Kamalpur No. 148\n" +
            "RS No. 673\n" +
            "📌 Available Plots | বিক্রয়যোগ্য প্লটসমূহ:\n" +
            "Plot No. 6: 4.65 Decimal Land | ৪.৬৫ ডেসিমেল জমি\n" +
            "Plot No. 12: 5 Decimal Land | ৫ ডেসিমেল জমি\n" +
            "🌿 Invest in a future built on trust, value, and growth.\n" +
            "বিশ্বাস, মূল্য ও উন্নয়নের ভিত্তিতে গড়ে তুলুন আপনার ভবিষ্যৎ।\n" +
            "Join New Journey Bangladesh Ltd. today and take the first step toward your dream property!\n" +
            "আজই যোগ দিন নিউ জার্নি বাংলাদেশ লিমিটেড-এর সাথে, শুরু করুন আপনার স্বপ্নের ঠিকানার যাত্রা!",
        image: "/images/apon-housing-hero.jpg",
        features: [
            "Gated communities with 24/7 security",
            "Modern apartment & duplex designs",
            "Child-friendly parks & playgrounds",
            "Eco-friendly & energy-efficient buildings",
            "Flexible payment plans"
        ],
        cta: "Explore Projects",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ],
    },
    "sb-hotel": {
        title: "SB 3 Star Hotel",
        tagline: "Comfort, Elegance, and Warm Hospitality",
        description: "SB 3 Star Hotel offers a perfect blend of comfort, convenience, and Bangladeshi hospitality. Located in the heart of the city, it's the ideal choice for business travelers, families, and tourists.",
        image: "/images/sb-hotel-hero.jpg",
        features: [
            "120+ well-appointed rooms & suites",
            "Multi-cuisine restaurant & rooftop café",
            "Conference & banquet halls",
            "Fitness center & spa services",
            "Complimentary high-speed Wi-Fi"
        ],
        cta: "Book Now",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-resort": {
        title: "SB Resort & Housing",
        tagline: "Where Luxury Meets Nature",
        description: "Escape to SB Resort & Housing — a premium residential resort community offering serene living surrounded by lush greenery, modern amenities, and world-class leisure facilities.",
        image: "/images/sb-resort-hero.jpg",
        features: [
            "Luxury villas & apartments",
            "Private lake, swimming pools & clubhouse",
            "Sports complex & jogging tracks",
            "Organic farming & green zones",
            "24/7 security & power backup"
        ],
        cta: "Discover the Lifestyle",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-developer": {
        title: "SB Developer",
        tagline: "Building Tomorrow's Bangladesh Today",
        description: "SB Developer is a trusted name in real estate development, delivering high-quality commercial, residential, and mixed-use projects with integrity, innovation, and timely delivery.",
        image: "/images/sb-developer-hero.jpg",
        features: [
            "Iconic commercial towers",
            "Integrated townships & housing societies",
            "Retail malls & office complexes",
            "Sustainable & green building practices",
            "Transparent booking & handover process"
        ],
        cta: "View Our Portfolio",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-construction": {
        title: "SB Construction",
        tagline: "Strength, Precision, Reliability",
        description: "SB Construction specializes in high-quality infrastructure, commercial buildings, and residential projects. With decades of experience and a skilled workforce, we deliver excellence on every site.",
        image: "/images/sb-construction-hero.jpg",
        features: [
            "High-rise building construction",
            "Bridge, road & flyover projects",
            "Industrial plants & factories",
            "Renovation & retrofitting expertise",
            "Quality control & safety first"
        ],
        cta: "Partner With Us",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-cosmetics": {
        title: "SB Cosmetics",
        tagline: "Beauty Crafted with Care",
        description: "SB Cosmetics brings you premium skincare, haircare, and makeup products made with natural ingredients and modern formulations — designed to enhance natural beauty safely and effectively.",
        image: "/images/sb-cosmetics-hero.jpg",
        features: [
            "Paraben-free & dermatologically tested",
            "Natural & herbal formulations",
            "Cruelty-free & vegan options",
            "Affordable luxury range",
            "Made in Bangladesh"
        ],
        cta: "Shop Now",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    },
    "sb-pharma": {
        title: "SB Pharmaceuticals",
        tagline: "Trusted Medicine for Every Family",
        description: "SB Pharmaceuticals manufactures and distributes high-quality generic and branded medicines across Bangladesh, ensuring affordability without compromising on safety and efficacy.",
        image: "/images/sb-pharma-hero.jpg",
        features: [
            "WHO-GMP certified manufacturing",
            "Wide range of therapeutic segments",
            "Export to multiple countries",
            "Affordable essential medicines",
            "Strong distribution network"
        ],
        cta: "Learn More",
        gallery: [
            "/images/apon/apon-housing-1.jpg",   // master plan / aerial view
            "/images/apon/apon-housing-2.jpg",   // entrance gate
            "/images/apon/apon-housing-3.jpg",   // sample plot / road
            // "/images/apon/apon-housing-4.jpg",   // residential block
            // "/images/apon/apon-housing-5.jpg",   // green space / park
            // "/images/apon/apon-housing-6.jpg",   // night view / lighting
        ],
        videos: [
            "/videos/apon-housing-overview.mp4",
            "/videos/apon-housing-drone.mp4",
        ]
    }
};

export default function SisterConcernPage() {
    const params = useParams();
    const slug = params.slug as string;

    const concern = sisterConcerns[slug as keyof typeof sisterConcerns];

    if (!concern) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
                <div className="text-center px-6">
                    <h1 className="text-5xl font-serif font-bold text-emerald-100 mb-6">Page Not Found</h1>
                    <p className="text-xl text-emerald-300 mb-10">The sister concern you're looking for doesn't exist or has been moved.</p>
                    <Link
                        href="/sister-concern"
                        className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-4 rounded-full text-xl font-medium transition shadow-xl"
                    >
                        Back to Sister Concerns
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
                     style={{ backgroundImage: `url(${concern.image})` }}>
                <div className="absolute inset-0 bg-black/65" />
                <div className="relative z-10 px-6 max-w-5xl">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-wider mb-6 text-emerald-50 drop-shadow-2xl">
                        {concern.title}
                    </h1>
                    <p className="text-2xl md:text-3xl font-light text-emerald-200 drop-shadow-lg">
                        {concern.tagline}
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-emerald-900/40 backdrop-blur-xl rounded-3xl border border-emerald-800/40 p-10 md:p-16 shadow-2xl">
                    <h2 className="text-4xl font-serif font-bold text-emerald-100 mb-8">
                        About {concern.title.split(" ")[0]}
                    </h2>

                    <div className="text-emerald-200 text-lg leading-relaxed mb-10 whitespace-pre-line">
                        {concern.description}
                    </div>

                    {/* New: Gallery Section – only shown if gallery exists */}
                    {concern.gallery && concern.gallery.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-3xl font-serif font-bold text-emerald-100 mb-6 text-center">
                                Project Gallery
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {concern.gallery.map((imgSrc, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden rounded-2xl shadow-lg group aspect-[4/3]"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={`${concern.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-medium px-4 py-2 bg-black/50 rounded-full">
                        View Larger
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos Section */}
                    {concern.videos && concern.videos.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-3xl font-serif font-bold text-emerald-100 mb-6 text-center">
                                Project Videos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {concern.videos.map((videoUrl, index) => (
                                    <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg aspect-video">
                                        <iframe
                                            src={videoUrl}
                                            title={`${concern.title} - Video ${index + 1}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {concern.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-300 text-xl">✓</span>
                                </div>
                                <p className="text-emerald-100 text-lg">{feature}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="#"
                            className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-5 rounded-full text-xl font-medium transition shadow-xl"
                        >
                            {concern.cta}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}