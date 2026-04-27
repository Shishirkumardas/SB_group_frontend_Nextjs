// app/projects/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function ProjectsOverview() {
    const projects = [
        { slug: "shopping-mall", title: "Shopping Mall", description: "Premier retail & lifestyle destination" },
        { slug: "shopping-mall-director", title: "Shopping Mall Director", description: "Management & analytics portal" },
        { slug: "delivery-food-package", title: "Food Delivery with Customer Reward System", description: "Food" },
        { slug: "double-benefit-program", title: "Double Advantage Reward & Benefit Program", description: "Double Advantage Reward & Benefit" },

        { slug: "truck-sale-food-distribution", title: "Truck Sale Food Distribution Network", description: "Truck Sale Food Distribution" },
        { slug: "ramadan-project", title: "Ramadan Special Project", description: "Ramadan Special" },
        { slug: "apon-housing", title: "Apon Housing Project", description: "Apon Housing" },
        { slug: "amar-bazar", title: "Amar Bazar Project", description: "Amar Bazar" },
        { slug: "woman-entrepreneurship-program", title: "woman entrepreneurship program", description: "woman entrepreneurship" },
        { slug: "development-officer-benefit", title: "Development Officer Benefit", description: "Development Officer" },
        { slug: "dealer", title: "Dealer Network", description: "Partner & dealer portal" },
        { slug: "amrityu-subidha", title: "Life Long Benefit", description: "Life Long Benefit" },
    ];

    return (
        <div className="min-h-screen bg-emerald-950 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-emerald-100 text-center mb-16">
                    SB Group Projects
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((proj) => (
                        <Link
                            key={proj.slug}
                            href={`/projects/${proj.slug}`}
                            className="group bg-emerald-900/40 backdrop-blur-md rounded-2xl border border-emerald-800/40 p-10 hover:border-emerald-600 hover:shadow-2xl transition-all hover:-translate-y-2"
                        >
                            <h2 className="text-3xl font-serif font-medium text-emerald-100 mb-4 group-hover:text-emerald-300 transition-colors">
                                {proj.title}
                            </h2>
                            <p className="text-emerald-300 mb-6">{proj.description}</p>
                            <span className="text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
                Learn more <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}