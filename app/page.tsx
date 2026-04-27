"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    Building2,
    HeartPulse,
    Globe,
    Briefcase,
    GraduationCap,
    Home,
    Hotel,
    Palette,
    ChevronRight,
    Quote,
    MapPin,
    Mail,
    Phone,
    Facebook,
    Linkedin,
    Youtube,
} from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function SBGroupLanding() {
    const [stats, setStats] = useState({
        employees: 0,
        medicines: 0,
        exports: 0,
        generics: 0,
    });

    useEffect(() => {
        const animateStats = () => {
            const target = {
                employees: 60,
                medicines: 30,
                exports: 10,
                generics: 30,
            };

            const duration = 2000;
            const steps = 60;

            // Explicit increments — no unsafe string indexing
            const increment = {
                employees: target.employees / steps,
                medicines: target.medicines / steps,
                exports: target.exports / steps,
                generics: target.generics / steps,
            };

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep >= steps) {
                    clearInterval(interval);
                    return;
                }

                setStats((prev) => ({
                    employees: Math.min(prev.employees + increment.employees, target.employees),
                    medicines: Math.min(prev.medicines + increment.medicines, target.medicines),
                    exports: Math.min(prev.exports + increment.exports, target.exports),
                    generics: Math.min(prev.generics + increment.generics, target.generics),
                }));

                currentStep++;
            }, duration / steps);
        };

        animateStats();
    }, []);

    return (
        <div className="min-h-screen bg-emerald-950 text-emerald-50 overflow-x-hidden">
            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/sb-group-hero.jpg')" }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-black/50" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-6xl"
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1.5}}
                >
                    <span className="notranslate">
                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold tracking-tight mb-6 md:mb-8 drop-shadow-2xl"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {opacity: 0},
                            visible: {
                                opacity: 1,
                                transition: {staggerChildren: 0.12},
                            },
                        }}
                    >

                        {/* Hidden readable text for Google Translate */}
                        <span className="sr-only">SB Group</span>

                        {"SB Group".split("").map((char, index) => (
                            <motion.span
                                key={index}
                                className="inline-block"
                                variants={{
                                    hidden: {opacity: 0, y: 40, filter: "blur(8px)"},
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                        transition: {duration: 0.9, ease: [0.22, 1, 0.36, 1]},
                                    },
                                }}
                                whileHover={{
                                    scale: 1.08,
                                    textShadow: "0 0 30px rgba(52, 211, 153, 0.7)",
                                    transition: {duration: 0.4},
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1>
                        </span>

                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-emerald-200 mb-10 md:mb-14 max-w-4xl mx-auto leading-tight drop-shadow-lg">
                        Healthcare • Education • Housing • Hospitality • Construction • Innovation
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center">
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 px-10 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                        >
                            Discover Our Vision
                            <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
                        </Link>

                        <Link
                            href="/sister-concern"
                            className="group inline-flex items-center gap-3 bg-transparent border-2 border-emerald-600 hover:bg-emerald-900/40 px-10 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-medium transition-all backdrop-blur-sm hover:shadow-xl"
                        >
                            Explore Our Companies
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse"}}
                >
                    <span className="text-sm text-emerald-300 mb-2">Scroll to explore</span>
                    <div
                        className="w-6 h-10 border-2 border-emerald-400 rounded-full flex items-start justify-center pt-2">
                        <div className="w-1.5 h-2 bg-emerald-400 rounded-full"/>
                    </div>
                </motion.div>
            </section>

            {/* Core Pillars */}
            <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-emerald-950 to-emerald-900/80">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-100 mb-16"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Our Core Pillars
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[
                            { icon: HeartPulse, title: "Healthcare", desc: "World-class hospitals & pharmaceuticals advancing medical science." },
                            { icon: GraduationCap, title: "Education", desc: "Empowering future generations through quality learning institutions." },
                            { icon: Home, title: "Real Estate", desc: "Modern homes & commercial spaces designed for sustainable living." },
                            { icon: Hotel, title: "Hospitality", desc: "Premium hotels & resorts offering unparalleled comfort and service." },
                            { icon: Building2, title: "Construction", desc: "Infrastructure & development expertise building the nation's future." },
                            { icon: Palette, title: "Cosmetics", desc: "Natural beauty products blending innovation with tradition." },
                            { icon: Briefcase, title: "Projects", desc: "Large-scale visionary initiatives driving economic growth." },
                            { icon: Globe, title: "Nation Building", desc: "Community & social impact programs for inclusive development." },
                        ].map((pillar, i) => (
                            <motion.div
                                key={i}
                                className="group bg-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-800/50 hover:border-emerald-600 transition-all hover:shadow-xl"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <pillar.icon className="h-14 w-14 mx-auto mb-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-serif font-bold text-emerald-100 mb-4 text-center">{pillar.title}</h3>
                                <p className="text-emerald-300 text-center">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 md:py-28 px-6 bg-emerald-900/50">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-16"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                    >
                        Our Impact in Numbers
                    </motion.h2>
                    <span className="notranslate">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            {label: "Dedicated Team", value: Math.round(stats.employees), suffix: "+"},
                            {label: "Lives Impacted", value: Math.round(stats.medicines), suffix: "K+"},
                            {label: "Projects Completed", value: Math.round(stats.exports), suffix: "+"},
                            {label: "Years of Excellence", value: Math.round(stats.generics), suffix: "+"},
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="p-8 bg-emerald-900/40 rounded-2xl border border-emerald-800/50"
                                initial={{opacity: 0, scale: 0.9}}
                                whileInView={{opacity: 1, scale: 1}}
                                viewport={{once: true}}
                                transition={{duration: 0.8, delay: i * 0.2}}
                            >
                                <div className="text-5xl font-bold text-emerald-100 mb-2">
                                    {stat.value}
                                    {stat.suffix}
                                </div>
                                <div className="text-emerald-300 text-xl">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                        </span>
                </div>
            </section>

            {/* Shopping Mall Gallery */}
            <section className="py-16 px-6 bg-emerald-950">
                <div className="max-w-7xl mx-auto text-center">

                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-100 mb-10">
                        Our Shopping Mall Projects
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            "/images/mall1.jpg",
                            "/images/mall2.jpg",
                            "/images/mall3.jpg",
                        ].map((src, i) => (
                            <div
                                key={i}
                                className="group overflow-hidden rounded-2xl border border-emerald-800/50 shadow-xl"
                            >
                                <img
                                    src={src}
                                    alt={`Shopping Mall ${i + 1}`}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Sister Concerns */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="notranslate">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-6"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                    >
                        Our Sister Concerns
                    </motion.h2>
                        </span>
                    <motion.p
                        className="text-xl text-emerald-300 mb-16 max-w-3xl mx-auto"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8, delay: 0.2}}
                    >
                        Nine dynamic companies working together to shape a better future.
                    </motion.p>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {slidesPerView: 2},
                            768: {slidesPerView: 3},
                            1024: {slidesPerView: 4},
                            1280: {slidesPerView: 5},
                        }}
                        navigation
                        pagination={{clickable: true}}
                        autoplay={{delay: 3000, disableOnInteraction: false}}
                        className="pb-12"
                    >
                        {[
                            {
                                name: "SB Medical",
                                href: "/sister-concern/sb-medical",
                                desc: "Advanced healthcare solutions"
                            },
                            {
                                name: "SB Education",
                                href: "/sister-concern/sb-society",
                                desc: "Quality education programs"
                            },
                            {
                                name: "RM Apon Housing",
                                href: "/sister-concern/apon-housing",
                                desc: "Affordable housing developments"
                            },
                            {name: "SB Hotel", href: "/sister-concern/sb-hotel", desc: "Luxury hospitality services"},
                            {name: "SB Resort", href: "/sister-concern/sb-resort", desc: "Premium resort experiences"},
                            {
                                name: "SB Developer",
                                href: "/sister-concern/sb-developer",
                                desc: "Real estate innovation"
                            },
                            {
                                name: "SB Construction",
                                href: "/sister-concern/sb-construction",
                                desc: "Infrastructure expertise"
                            },
                            {
                                name: "SB Cosmetics",
                                href: "/sister-concern/sb-cosmetics",
                                desc: "Natural beauty products"
                            },
                            {name: "SB Pharma", href: "/sister-concern/sb-pharma", desc: "Pharmaceutical advancements"},
                        ].map((item, i) => (
                            <SwiperSlide key={i}>
                                <Link
                                    href={item.href}
                                    className="group bg-emerald-900/40 backdrop-blur-md rounded-xl p-6 border border-emerald-800/50 hover:border-emerald-600 transition-all hover:shadow-lg hover:-translate-y-1 block h-full"
                                >
                                    <h3 className="text-lg font-medium text-emerald-100 group-hover:text-emerald-300 transition-colors mb-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-emerald-300 text-sm">{item.desc}</p>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <motion.div
                        className="mt-12"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                    >
                        <Link
                            href="/sister-concern"
                            className="inline-flex items-center gap-3 text-emerald-400 hover:text-emerald-300 text-xl font-medium transition"
                        >
                            View All Sister Concerns
                            <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Latest Updates */}
            <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-emerald-900/80 to-emerald-950">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-6"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Latest Updates & News
                    </motion.h2>
                    <motion.p
                        className="text-xl text-emerald-300 mb-16 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Stay informed about our latest initiatives, achievements, and industry insights.
                    </motion.p>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        className="pb-12"
                    >
                        {[
                            { title: "New Journey Shopping Malls Inagurated in Gazipur", date: "2026-01-15", desc: "New Journey Shopping Mall Inagurated in Gazipur" },
                            { title: "Amar Bazar Inagurated In Tangail", date: "2025-12-20", desc: "Amar Bazar Inagurated In Tangail" },
                            { title: "Development Seminar in Kaliakoir, Gazipur", date: "2025-11-10", desc: "Development Seminar in Kaliakoir, Gazipur" },
                            ].map((news, i) => (
                            <SwiperSlide key={i}>
                                <div className="bg-emerald-900/40 backdrop-blur-md rounded-2xl p-6 border border-emerald-800/50 h-full">
                                    <h3 className="text-xl font-bold text-emerald-100 mb-2">{news.title}</h3>
                                    <p className="text-emerald-400 text-sm mb-4">{news.date}</p>
                                    <p className="text-emerald-300 mb-4">{news.desc}</p>
                                    <Link
                                        href="#"
                                        className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                                    >
                                        Read More <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Chairman's Message */}
            <section className="py-20 md:py-28 px-6 bg-emerald-900/30">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        From Our Chairman
                    </motion.h2>

                    <motion.div
                        className="bg-emerald-900/50 backdrop-blur-xl rounded-3xl border border-emerald-800/40 p-10 md:p-16 shadow-2xl max-w-4xl mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed mb-10 font-light italic">
                            "Our mission has always been simple yet profound: to build institutions and opportunities that serve people first. Every project, every product, every life we touch — is a step toward a better tomorrow for Bangladesh."
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
                                <h3 className="text-2xl font-serif font-bold text-emerald-100">Shuvo Chowdhury</h3>
                                <p className="text-lg text-emerald-300">Chairman, SB Group</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-3 text-emerald-400 hover:text-emerald-300 text-xl font-medium transition"
                        >
                            Read Full Message & Our Story
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 md:py-28 px-6 bg-emerald-950">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        What Our Leaders Say
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                quote: "We strive for excellence in serving our communities and partners.",
                                name: "MD Solaiman Hossain",
                                position: "Managing Director(NJBL)",
                            },
                            {
                                quote: "Our team is dedicated to creating positive change in every sector we touch.",
                                name: "Atikur Rahman",
                                position: "CEO",
                            },
                            {
                                quote: "Quality and innovation are at the heart of everything we do at SB Group.",
                                name: "Tapan Kumar Biswas",
                                position: "Managing Director(SB Group)",
                            }


                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                className="bg-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-800/50 text-left"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.2 }}
                            >
                                <Quote className="h-8 w-8 text-emerald-400 mb-4" />
                                <p className="text-emerald-200 mb-6 italic">{testimonial.quote}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-800" />
                                    <div>
                                        <h4 className="text-emerald-100 font-bold">{testimonial.name}</h4>
                                        <p className="text-emerald-300 text-sm">{testimonial.position}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-emerald-900/30 to-emerald-950">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Discover SB Group in Action
                    </motion.h2>

                    <motion.div
                        className="aspect-video rounded-2xl overflow-hidden border border-emerald-800/50 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/N80qcoVD9X0"
                            title="SB Group Overview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-emerald-950 via-emerald-900/50 to-emerald-950">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-bold text-emerald-50 mb-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Together, We Build Tomorrow
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-emerald-300 mb-12 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        From healthcare to housing, from education to enterprise — SB Group is committed to creating meaningful impact across Bangladesh.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            href="https://www.facebook.com/sb.njbl"
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-6 rounded-full text-xl font-medium transition shadow-2xl hover:shadow-3xl hover:scale-105"
                        >
                            Contact Us Today
                        </Link>
                        <Link
                            href="https://www.linkedin.com/company/sb-group-bangladesh"
                            className="bg-transparent border-2 border-emerald-600 hover:bg-emerald-900/40 text-emerald-300 px-12 py-6 rounded-full text-xl font-medium transition backdrop-blur-sm hover:scale-105"
                        >
                            Join Our Team
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-emerald-950 border-t border-emerald-800/50 py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-emerald-100 mb-6">SB Group</h3>
                        <p className="text-emerald-400">Building trust. Creating value. Serving Bangladesh.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-emerald-300">
                            <li>
                                <Link href="/about" className="hover:text-emerald-200 transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/sister-concern" className="hover:text-emerald-200 transition">
                                    Sister Concerns
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="hover:text-emerald-200 transition">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/njbl-product-f" className="hover:text-emerald-200 transition">
                                    NJBL Products
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Contact</h4>
                        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                            <MapPin size={18} className="text-emerald-400" />
                            <p className="text-emerald-400">
                                Road No: 1/A, House No: 20, Block: J, Baridhara, Dhaka – 1212
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                            <Mail size={18} className="text-emerald-400" />
                            <p className="text-emerald-400">njbd0001@gmail.com</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                            <Phone size={18} className="text-emerald-400" />
                            <p className="text-emerald-400">+880 01901-926127</p>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-xl border border-emerald-800/50 shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.617806960991!2d90.42356747623464!3d23.796620478638925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70054741e73%3A0xdc7dc79f2689d066!2sNJBL%20Corporate%20Office!5e0!3m2!1sen!2sbd!4v1770536979025!5m2!1sen!2sbd"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="SB Group Location - Baridhara, Dhaka"
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-emerald-200 mb-6">Follow Us</h4>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <a
                                href="https://www.facebook.com/sb.njbl"
                                className="text-emerald-400 hover:text-emerald-200 transition"
                            >
                                <Facebook size={24} />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/sb-group-bangladesh"
                                className="text-emerald-400 hover:text-emerald-200 transition"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a href="https://www.youtube.com/@NewjourneyBangladeshLimited" className="text-emerald-400 hover:text-emerald-200 transition">
                                <Youtube size={24} />
                            </a>
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