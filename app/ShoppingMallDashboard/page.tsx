'use client';

import { useState } from 'react';
import {
    Users, ShoppingCart, Package, CreditCard, BarChart3,
    UserPlus, PlusCircle, List, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ShoppingMallManagement() {
    const router = useRouter();

    const modules = [
        {
            title: "Customer Registration",
            description: "Register new mall customers",
            icon: UserPlus,
            color: "bg-green-500",
            path: "/shopping-mall/register",
            bg: "from-green-50 to-emerald-50"
        },
        {
            title: "Point of Sale (POS)",
            description: "Fast billing & checkout",
            icon: ShoppingCart,
            color: "bg-blue-500",
            path: "/pos",
            bg: "from-blue-50 to-cyan-50"
        },
        {
            title: "Customer Data",
            description: "View & manage all customers",
            icon: Users,
            color: "bg-purple-500",
            path: "/shopping-mall-customer",
            bg: "from-purple-50 to-violet-50"
        },
        {
            title: "Master Data",
            description: "Areas, Categories & Settings",
            icon: List,
            color: "bg-amber-500",
            path: "/shoppingmall-masterdata",
            bg: "from-amber-50 to-yellow-50"
        },
        {
            title: "Products Management",
            description: "Add & manage products",
            icon: Package,
            color: "bg-rose-500",
            path: "/products",
            bg: "from-rose-50 to-pink-50"
        },
        {
            title: "Reward Cards",
            description: "Manage loyalty cards",
            icon: Award,
            color: "bg-indigo-500",
            path: "/rewards",
            bg: "from-indigo-50 to-blue-50"
        },
        {
            title: "Payments History",
            description: "All transactions & reports",
            icon: CreditCard,
            color: "bg-teal-500",
            path: "/shopping-mall-customer/all-payments",
            bg: "from-teal-50 to-cyan-50"
        },
        {
            title: "Analytics & Reports",
            description: "Sales & performance insights",
            icon: BarChart3,
            color: "bg-orange-500",
            path: "/shopping-mall/analytics",
            bg: "from-orange-50 to-amber-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white py-8 shadow-lg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">Shopping Mall Management</h1>
                            <p className="text-emerald-100 mt-2 text-lg">Shuvo Bangla Group - NJBL Mall</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-75">Today</p>
                            <p className="text-2xl font-semibold">{new Date().toLocaleDateString('en-GB')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Management Modules</h2>
                    <p className="text-gray-600 mt-2">Choose an operation to continue</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden"
                        >
                            <div className={`h-2 bg-gradient-to-r ${module.bg}`} />
                            <CardHeader>
                                <div className={`w-14 h-14 rounded-2xl ${module.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <module.icon size={28} />
                                </div>
                                <CardTitle className="text-xl">{module.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-6 min-h-[44px]">
                                    {module.description}
                                </p>
                                <Button
                                    onClick={() => router.push(module.path)}
                                    className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-12 text-base font-medium"
                                >
                                    Open Module
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">1,284</p>
                            <p className="text-emerald-600 text-sm mt-1">↑ 12% this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Today's Sales</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">৳84,250</p>
                            <p className="text-emerald-600 text-sm mt-1">↑ 8% from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Active Reward Cards</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">437</p>
                            <p className="text-amber-600 text-sm mt-1">12 issued today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Low Stock Items</p>
                            <p className="text-4xl font-bold text-red-600 mt-2">18</p>
                            <p className="text-red-600 text-sm mt-1">Requires attention</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}