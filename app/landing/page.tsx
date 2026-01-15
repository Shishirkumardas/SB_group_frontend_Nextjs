'use client';

import Link from "next/link";
import Image from "next/image";
import {JSX, useState} from "react";

// Simple Tab Component
const Tabs = ({ tabs }: { tabs: { title: string; content: JSX.Element }[] }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex border-b border-emerald-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-8 py-4 font-medium text-lg transition-all duration-300 ${
                            activeTab === index
                                ? "text-emerald-700 border-b-4 border-emerald-600"
                                : "text-gray-600 hover:text-emerald-700"
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="p-8 bg-white rounded-b-3xl shadow-inner">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

// Dummy Data for Products/Packages
const products = [
    { name: "Package A", description: "Basic package for starters", price: "৳5,000", image: "/package-a.jpg" },
    { name: "Package B", description: "Advanced package with extras", price: "৳10,000", image: "/package-b.jpg" },
    { name: "Package C", description: "Premium all-inclusive", price: "৳20,000", image: "/package-c.jpg" },
];

// Hero Section
function Hero() {
    return (
        <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-emerald-700 to-teal-700 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <Image src="/hero-bg.jpg" alt="Background" fill className="object-cover" />
            </div>
            <div className="relative z-10 text-center px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Welcome to SB Group
                </h1>
                <p className="text-xl md:text-3xl mb-10 max-w-3xl mx-auto">
                    Empowering innovation through sister concerns, projects, and investment opportunities.
                </p>
                <Link
                    href="#new-journey"
                    className="bg-white text-emerald-800 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:bg-emerald-100 transition-all duration-300"
                >
                    Explore Our Journey
                </Link>
            </div>
        </section>
    );
}

// Sister Concerns Section
function SisterConcerns() {
    const concerns = [
        { name: "SB Tech", description: "Leading in technology solutions", logo: "/sb-tech-logo.png" },
        { name: "SB Finance", description: "Financial services and investments", logo: "/sb-finance-logo.png" },
        { name: "SB Health", description: "Healthcare innovations", logo: "/sb-health-logo.png" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-emerald-800 text-center mb-12">
                    Our Sister Concerns
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {concerns.map((concern, index) => (
                        <div
                            key={index}
                            className="bg-emerald-50 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 text-center"
                        >
                            <Image
                                src={concern.logo}
                                alt={concern.name}
                                width={150}
                                height={150}
                                className="mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
                                {concern.name}
                            </h3>
                            <p className="text-gray-600">
                                {concern.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Projects Section
function Projects() {
    const projects = [
        { name: "Project Alpha", description: "Innovative tech platform", image: "/project-alpha.jpg" },
        { name: "Project Beta", description: "Sustainable finance initiative", image: "/project-beta.jpg" },
        { name: "Project Gamma", description: "Healthcare AI system", image: "/project-gamma.jpg" },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-100 to-teal-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-emerald-800 text-center mb-12">
                    Our Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <Image
                                src={project.image}
                                alt={project.name}
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
                                    {project.name}
                                </h3>
                                <p className="text-gray-600">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// New Journey Tab Content
function NewJourneyTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-emerald-700 mb-2">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {product.description}
                        </p>
                        <p className="text-xl font-bold text-teal-700">
                            {product.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Investment Policy Tab Content
function InvestmentPolicyTab() {
    return (
        <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
            <p>
                At SB Group, we believe in transparent and sustainable investment practices. Our policy ensures high returns with minimized risks.
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Minimum investment: ৳50,000</li>
                <li>Expected ROI: 15-20% annually</li>
                <li>Risk mitigation through diversified portfolios</li>
                <li>Quarterly reporting and audits</li>
                <li>Ethical investment in sustainable projects</li>
            </ul>
            <p>
                For detailed terms, please contact our investment team.
            </p>
        </div>
    );
}

// Chairman's Message Section
function ChairmansMessage() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/3">
                    <Image
                        src="/chairman.jpg"
                        alt="Chairman's Portrait"
                        width={400}
                        height={400}
                        className="rounded-full shadow-2xl"
                    />
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-4xl font-bold text-emerald-800 mb-6">
                        Chairman's Message
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Dear Stakeholders,
                        <br /><br />
                        At SB Group, we are committed to innovation and excellence. Our journey has been one of growth and transformation, and we look forward to many more successes together.
                        <br /><br />
                        Thank you for your continued support.
                        <br /><br />
                        Sincerely,
                        <br />
                        [Chairman's Name]
                    </p>
                </div>
            </div>
        </section>
    );
}

// Footer
function Footer() {
    return (
        <footer className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">SB Group</h3>
                        <p className="text-emerald-100">
                            Empowering tomorrow through innovation.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="#sister-concerns" className="hover:text-emerald-300">Sister Concerns</Link></li>
                            <li><Link href="#projects" className="hover:text-emerald-300">Projects</Link></li>
                            <li><Link href="#new-journey" className="hover:text-emerald-300">New Journey</Link></li>
                            <li><Link href="#investment" className="hover:text-emerald-300">Investment Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <p className="text-emerald-100">
                            Email: info@sbgroup.com<br />
                            Phone: +880 1234-567890<br />
                            Address: Dhaka, Bangladesh
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="text-2xl hover:text-emerald-300">📱</Link>
                            <Link href="#" className="text-2xl hover:text-emerald-300">🐦</Link>
                            <Link href="#" className="text-2xl hover:text-emerald-300">📸</Link>
                            <Link href="#" className="text-2xl hover:text-emerald-300">🔗</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-emerald-200">
                    © 2026 SB Group. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

// Main Landing Page
export default function LandingPage() {
    const tabs = [
        {
            title: "New Journey",
            content: <NewJourneyTab />,
        },
        {
            title: "Investment Policy",
            content: <InvestmentPolicyTab />,
        },
    ];

    return (
        <div>
            <Hero />
            <SisterConcerns />
            <Projects />
            <section id="tabs" className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-emerald-800 text-center mb-12">
                        Explore More
                    </h2>
                    <Tabs tabs={tabs} />
                </div>
            </section>
            <ChairmansMessage />
            <Footer />
        </div>
    );
}