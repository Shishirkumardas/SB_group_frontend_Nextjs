"use client";

import Link from "next/link";
import { ArrowRight, Users, Heart, Building2, Globe, Briefcase, User } from "lucide-react";

export default function AboutUsPage() {
    // Grouped team data by department/role level
    const teamData = {
        topLeadership: [
            {
                name: "Shuvo Chowdhury",
                position: "Chairman",
                image: "/images/chairman.jpg",
                bio: "Visionary founder guiding the group's strategic direction and long-term vision.",
            }
        ],
        directors: [
            {
                name: "Topan Kumar Biswas",
                position: "Managing Director",
                image: "/images/placeholder-leader.jpg",
                bio: "Oversees overall operations, business development, and execution of group strategies.",
            },
            {
                name: "Atikur Rahman",
                position: "Deputy Managing Director",
                image: "/images/atikur_rahman.jpeg",
                bio: "Leads daily management, cross-functional coordination, and performance optimization.",
            },
            {
                name: "Md. Saidur Rahman",
                position: "Director - Healthcare & Pharmaceuticals",
                image: "/images/saidur.jpg",
                bio: "Responsible for healthcare initiatives, quality standards, and pharmaceutical innovation.",
            },
            {
                name: "Md. Habibur Rahman",
                position: "Director - Healthcare & Pharmaceuticals",
                image: "/images/habibur.jpg",
                bio: "Responsible for healthcare initiatives, quality standards, and pharmaceutical innovation.",
            },
            {
                name: "Sarmin Azan Muskan",
                position: "Chief Executive Officer (Marketing)",
                image: "/images/muskan.jpg",
                bio: "Manages financial strategy, compliance, and sustainable growth planning.",
            },
            {
                name: "Mahfuzur Rahman",
                position: "Head Of IT & ADMIN",
                image: "/images/placeholder-leader.jpg",
                bio: "Drives infrastructure projects, housing developments, and engineering excellence.",
            },
        ],
        additional_directors: [
            {
                name: "Md. Saidur Rahman",
                position: "Director - Healthcare & Pharmaceuticals",
                image: "/images/placeholder-leader.jpg",
                bio: "Responsible for healthcare initiatives, quality standards, and pharmaceutical innovation.",
            },
            {
                name: "Md. Habibur Rahman",
                position: "Director - Healthcare & Pharmaceuticals",
                image: "/images/placeholder-leader.jpg",
                bio: "Responsible for healthcare initiatives, quality standards, and pharmaceutical innovation.",
            },
        ],
        executives: [
            {
                name: "Sarmin Azan Muskan",
                position: "Chief Executive Officer (Marketing)",
                image: "/images/muskan.jpg",
                bio: "Manages financial strategy, compliance, and sustainable growth planning.",
            },
            {
                name: "Mahfuzur Rahman",
                position: "Head Of IT & ADMIN",
                image: "/images/placeholder-leader.jpg",
                bio: "Drives infrastructure projects, housing developments, and engineering excellence.",
            },
        ],
        IT_Account: [
            {
                name: "Shishir Kumar Das",
                position: "Head of Human Resources",
                image: "/images/shishir.jpg",
                bio: "Focuses on talent development, employee welfare, and organizational culture.",
            },
            {
                name: "Taslima Akand",
                position: "Head of Operations",
                image: "/images/taslima_akand.jpeg",
                bio: "Ensures smooth operations across all sister concerns and efficiency improvements.",
            },
            {
                name: "Sadia Zaman",
                position: "Head of Operations",
                image: "/images/sadia_zaman.jpeg",
                bio: "Ensures smooth operations across all sister concerns and efficiency improvements.",
            },
            {
                name: "Salafi Sabbir",
                position: "Head of Operations",
                image: "/images/placeholder-leader.jpg",
                bio: "Ensures smooth operations across all sister concerns and efficiency improvements.",
            },
        ],
    };

    const renderTeamCard = (leader: any, index: number) => (
        <div
            key={index}
            className="bg-emerald-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-emerald-800/40 hover:border-emerald-600 transition-all hover:shadow-xl group"
        >
            <div className="h-64 overflow-hidden">
                <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="p-6 text-center">
                <h3 className="text-2xl font-serif font-bold text-emerald-100 mb-2">{leader.name}</h3>
                <p className="text-lg text-emerald-400 mb-4 font-medium">{leader.position}</p>
                <p className="text-emerald-200 text-base">{leader.bio}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-emerald-950 text-emerald-50">
            {/* Hero Section */}
            <section
                className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: "url('/about-hero.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-emerald-950/90" />
                <div className="relative z-10 px-6 max-w-5xl">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 drop-shadow-2xl">
                        About SB Group
                    </h1>
                    <p className="text-xl md:text-3xl font-light text-emerald-200 max-w-4xl mx-auto drop-shadow-lg">
                        Building a Stronger, Healthier, and More Prosperous Bangladesh
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-8">Who We Are</h2>
                            <p className="text-lg md:text-xl text-emerald-200 leading-relaxed mb-8">
                                SB Group is a diversified Bangladeshi conglomerate with a deep commitment to excellence, innovation, and social responsibility.
                                From life-saving healthcare and quality education to modern housing, hospitality, construction, cosmetics, and pharmaceuticals —
                                we strive to create lasting value for communities, partners, and the nation.
                            </p>
                            <p className="text-lg md:text-xl text-emerald-200 leading-relaxed">
                                Founded on the principles of trust, integrity, and forward-thinking leadership, SB Group has grown into a trusted name
                                that touches millions of lives every day through its nine sister concerns and ambitious projects.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Users, label: "Dedicated Team", value: "500+" },
                                { icon: Heart, label: "Lives Impacted", value: "100K+" },
                                { icon: Building2, label: "Sister Concerns", value: "9" },
                                { icon: Globe, label: "Vision for Tomorrow", value: "Nationwide" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-800/40 text-center"
                                >
                                    <stat.icon className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
                                    <div className="text-4xl font-bold text-emerald-100 mb-2">{stat.value}</div>
                                    <div className="text-emerald-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Chairman's Message */}
            <section className="py-20 md:py-28 px-6 bg-emerald-900/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-4">Chairman's Message</h2>
                        <p className="text-xl text-emerald-400 italic">A word from our visionary leader</p>
                    </div>

                    <div className="bg-emerald-900/50 backdrop-blur-xl rounded-3xl border border-emerald-800/40 p-10 md:p-16 shadow-2xl">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed mb-10 font-light italic">
                                "At SB Group, our journey is not just about building businesses — it is about building trust,
                                nurturing communities, and creating opportunities that uplift lives. Every hospital we establish,
                                every home we deliver, every child we educate, and every medicine we produce carries the promise
                                of a better tomorrow. We remain deeply committed to integrity, innovation, and inclusive growth
                                as we continue to serve Bangladesh with pride and purpose."
                            </p>

                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-emerald-700/50 flex-shrink-0">
                                    <img
                                        src="/images/chairman.jpg"
                                        alt="Chairman SB Group"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-emerald-100">
                                        Shuvo Chowdhury
                                    </h3>
                                    <p className="text-xl text-emerald-300 mt-2">Chairman, SB Group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Team - Department Wise */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-4">
                            Our Leadership Team
                        </h2>
                        <p className="text-xl text-emerald-300 max-w-3xl mx-auto">
                            Guided by experienced leaders across key roles — from Managing Director to department heads and core team members —
                            our leadership drives innovation, integrity, and sustainable growth for SB Group.
                        </p>
                    </div>

                    {/* Top Leadership */}
                    <div className="mb-20">
                        <h3 className="text-3xl font-serif font-bold text-emerald-200 mb-10 text-center">Top Leadership</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
                            {teamData.topLeadership.map(renderTeamCard)}
                        </div>
                    </div>

                    {/* Directors */}
                    <div className="mb-20">
                        <h3 className="text-3xl font-serif font-bold text-emerald-200 mb-10 text-center">Directors and Executives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
                            {teamData.directors.map(renderTeamCard)}
                        </div>
                    </div>

                    {/*/!* Additional Directors *!/*/}
                    {/*<div className="mb-20">*/}
                    {/*    <h3 className="text-3xl font-serif font-bold text-emerald-200 mb-10 text-center">Additional Directors</h3>*/}
                    {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">*/}
                    {/*        {teamData.additional_directors?.map(renderTeamCard) || null}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*/!* Executives *!/*/}
                    {/*<div className="mb-20">*/}
                    {/*    <h3 className="text-3xl font-serif font-bold text-emerald-200 mb-10 text-center">Executives</h3>*/}
                    {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto justify-items-center">*/}
                    {/*        {teamData.executives.map(renderTeamCard)}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Department Heads - example for IT & Admin or similar */}
                    <div className="mb-12">
                        <h3 className="text-3xl font-serif font-bold text-emerald-200 mb-10 text-center"></h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center">
                            { teamData.IT_Account?.map(renderTeamCard) || null}
                        </div>
                    </div>

                    <div className="text-center mt-16 text-emerald-300">
                        <p className="text-lg">
                            And many more dedicated professionals across our sister concerns working every day to serve Bangladesh.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-16">Our Core Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Integrity", desc: "We operate with honesty, transparency, and ethical standards in everything we do." },
                            { title: "Excellence", desc: "We pursue the highest quality in products, services, and customer experience." },
                            { title: "Innovation", desc: "We embrace change and continuously seek better ways to serve our nation." },
                            { title: "Community", desc: "We are committed to uplifting lives and contributing to societal progress." },
                        ].map((value, i) => (
                            <div
                                key={i}
                                className="bg-emerald-900/40 backdrop-blur-md rounded-2xl p-10 border border-emerald-800/40 hover:border-emerald-600 transition-all hover:shadow-xl"
                            >
                                <h3 className="text-2xl font-serif font-bold text-emerald-300 mb-6">{value.title}</h3>
                                <p className="text-emerald-200 text-lg">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-emerald-900/30 to-emerald-950">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-100 mb-8">Be Part of Our Journey</h2>
                    <p className="text-xl md:text-2xl text-emerald-300 mb-12 max-w-4xl mx-auto">
                        Whether you're a customer, partner, investor, or someone who shares our vision —
                        together we can build a brighter future for Bangladesh.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-6 rounded-full text-xl font-medium transition shadow-2xl"
                        >
                            Get in Touch
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                            href="/careers"
                            className="inline-flex items-center gap-3 bg-transparent border-2 border-emerald-600 hover:bg-emerald-900/40 text-emerald-300 px-12 py-6 rounded-full text-xl font-medium transition backdrop-blur-sm"
                        >
                            Join Our Team
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}