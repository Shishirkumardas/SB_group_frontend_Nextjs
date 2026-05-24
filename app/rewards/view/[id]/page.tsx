// app/(dashboard)/rewards/view/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Edit3, Save, User, Phone, BadgeCheck, BadgeX, CreditCard, Star, Printer, QrCode, DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RewardCard {
    id: string;
    cardNumber: string;
    totalPoints: number;
    issuedAt: string;
    isActive: boolean;
    customer?: {
        id: string;
        name: string;
        phone: string;
    };
}

export default function RewardCardViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [card, setCard] = useState<RewardCard | null>(null);
    const [form, setForm] = useState({ totalPoints: 0, isActive: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [barcodeUrl, setBarcodeUrl] = useState('');
    const [qrUrl, setQrUrl] = useState('');

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchCard();
        fetchBarcode();
        fetchQRCode();
    }, [id]);

    useEffect(() => {
        return () => {
            if (barcodeUrl) URL.revokeObjectURL(barcodeUrl);
            if (qrUrl) URL.revokeObjectURL(qrUrl);
        };
    }, [barcodeUrl, qrUrl]);

    const fetchCard = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8080/api/rewards/${id}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch card');
            const data: RewardCard = await res.json();
            setCard(data);
            setForm({ totalPoints: data.totalPoints, isActive: data.isActive });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load reward card' });
        } finally {
            setLoading(false);
        }
    };

    const fetchBarcode = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/rewards/${id}/barcode`, { credentials: 'include' });
            if (res.ok) {
                const blob = await res.blob();
                setBarcodeUrl(URL.createObjectURL(blob));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchQRCode = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/rewards/${id}/qr`, { credentials: 'include' });
            if (res.ok) {
                const blob = await res.blob();
                setQrUrl(URL.createObjectURL(blob));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const saveChanges = async () => {
        if (!card) return;
        setSaving(true);
        setMessage(null);

        try {
            if (form.totalPoints !== card.totalPoints) {
                const diff = form.totalPoints - card.totalPoints;
                await fetch(`http://localhost:8080/api/rewards/add-points?cardId=${card.id}&points=${diff}&reason=Manual%20Update`, {
                    method: 'POST',
                    credentials: 'include'
                });
            }

            if (form.isActive !== card.isActive) {
                const endpoint = form.isActive ? '/activate' : '/deactivate';
                const res = await fetch(`http://localhost:8080/api/rewards/${card.id}${endpoint}`, {
                    method: 'PUT',
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to update status');
            }

            setMessage({ type: 'success', text: '✅ Changes saved successfully!' });
            setIsEditing(false);
            await fetchCard();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to save changes' });
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        if (!card) return;
        setForm({ totalPoints: card.totalPoints, isActive: card.isActive });
        setIsEditing(false);
    };

    const printCard = () => window.print();

    // Navigate to Customer Payments Page
    const goToCustomerPayments = () => {
        if (card?.customer?.id) {
            router.push(`/shopping-mall-customer/${card.customer.id}/payments`);
        } else {
            alert("Customer information is not linked to this reward card.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={70} />
        </div>
    );

    if (!card) return (
        <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">
            Reward Card Not Found
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-emerald-700 hover:text-emerald-900">
                        <ArrowLeft size={18} /> Back
                    </Button>

                    <div className="flex gap-3">
                        <Button onClick={() => setIsEditing(!isEditing)} className="gap-2 rounded-xl shadow-lg">
                            <Edit3 size={18} /> {isEditing ? 'Close Edit' : 'Edit Card'}
                        </Button>

                        <Button
                            onClick={goToCustomerPayments}
                            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg"
                            disabled={!card.customer?.id}
                        >
                            <DollarSign size={18} />
                            View Payment History
                        </Button>

                        <Button onClick={printCard} className="gap-2 bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-lg">
                            <Printer size={18} /> Print Card
                        </Button>
                    </div>
                </div>

                {/* Main Details Card */}
                <Card className="overflow-hidden border-0 shadow-2xl rounded-[2rem] bg-white/90 backdrop-blur">
                    <CardHeader className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white p-10">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <CreditCard size={34} />
                                    <CardTitle className="text-4xl font-bold tracking-wide">{card.cardNumber}</CardTitle>
                                </div>
                                <p className="text-emerald-100 text-lg">Reward Membership Card</p>
                            </div>
                            <div className={`px-6 py-3 rounded-2xl text-lg font-semibold flex items-center gap-2 shadow-lg ${form.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {form.isActive ? <><BadgeCheck size={22} /> Active</> : <><BadgeX size={22} /> Inactive</>}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 md:p-10 space-y-10">
                        {message && (
                            <div className={`p-5 rounded-2xl border text-center font-semibold shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-emerald-100 text-lg">Reward Points</p>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    value={form.totalPoints}
                                                    onChange={(e) => setForm({ ...form, totalPoints: Number(e.target.value) })}
                                                    className="mt-4 text-5xl h-20 bg-white text-black font-bold"
                                                />
                                            ) : (
                                                <div className="text-6xl font-black mt-3">{form.totalPoints}</div>
                                            )}
                                        </div>
                                        <Star size={90} className="opacity-20" />
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-8 border">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Customer Information</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-emerald-100 p-4 rounded-2xl"><User className="text-emerald-700" /></div>
                                            <div>
                                                <p className="text-slate-500">Customer Name</p>
                                                <p className="text-2xl font-semibold">{card.customer?.name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-cyan-100 p-4 rounded-2xl"><Phone className="text-cyan-700" /></div>
                                            <div>
                                                <p className="text-slate-500">Phone Number</p>
                                                <p className="text-xl font-medium">{card.customer?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white border rounded-3xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center gap-2"><CreditCard size={22} /> Barcode</h2>
                                    {barcodeUrl ? <img src={barcodeUrl} alt="Barcode" className="mx-auto rounded-2xl shadow-md" /> : <div className="text-slate-500 text-center py-8">Barcode unavailable</div>}
                                </div>

                                <div className="bg-white border rounded-3xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center gap-2"><QrCode size={22} /> QR Code</h2>
                                    {qrUrl ? (
                                        <div className="text-center">
                                            <img src={qrUrl} alt="QR Code" className="mx-auto rounded-2xl shadow-md w-48 h-48" />
                                            <p className="text-xs text-slate-500 mt-3">Scan for instant verification</p>
                                        </div>
                                    ) : <div className="text-slate-500 text-center py-8">QR Code unavailable</div>}
                                </div>

                                <div className="bg-white border rounded-3xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-slate-700 mb-6">Card Status</h2>
                                    <div className="flex gap-3">
                                        <Button onClick={() => setForm({ ...form, isActive: true })} disabled={!isEditing} className={`flex-1 h-12 ${form.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                            <BadgeCheck className="mr-2" size={20} /> Active
                                        </Button>
                                        <Button onClick={() => setForm({ ...form, isActive: false })} disabled={!isEditing} className={`flex-1 h-12 ${!form.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 text-gray-700'}`}>
                                            <BadgeX className="mr-2" size={20} /> Inactive
                                        </Button>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="space-y-4">
                                        <Button onClick={saveChanges} disabled={saving} className="w-full h-14 text-lg rounded-2xl shadow-xl">
                                            {saving ? <><Loader2 className="animate-spin mr-3" size={20} /> Saving...</> : <><Save className="mr-3" size={20} /> Save Changes</>}
                                        </Button>
                                        <Button variant="outline" onClick={cancelEdit} disabled={saving} className="w-full h-14 text-lg rounded-2xl">
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ====================== PRINTABLE LANDSCAPE CARD ====================== */}
            <div className="hidden print:block fixed inset-0 bg-white z-[100] p-8 flex items-center justify-center">
                <div className="w-[720px] h-[380px] border-[14px] border-emerald-800 rounded-3xl overflow-hidden shadow-2xl bg-white relative flex">
                    {/* Left Branding */}
                    <div className="w-2/5 bg-gradient-to-br from-emerald-700 to-teal-700 p-8 flex flex-col justify-between text-white">
                        <div>
                            <img src="/images/njbl-hero.jpg" alt="NJBL Logo" className="h-14 mb-6" />
                            <div className="text-5xl font-bold tracking-widest">NJBL</div>
                            <p className="text-sm opacity-90 mt-1">SHOPPING MALL</p>

                            <div className="mt-8">
                                <p className="text-xs opacity-75 tracking-widest">CARD NUMBER</p>
                                <p className="font-mono text-2xl font-bold tracking-widest mt-1">{card.cardNumber}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs opacity-75">PREMIUM LOYALTY CARD</p>
                        </div>
                    </div>

                    {/* Right Details */}
                    <div className="w-3/5 p-8 flex flex-col justify-between bg-white relative">
                        <div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">CARD HOLDER</p>
                                    <p className="text-3xl font-semibold text-gray-800 mt-1">{card.customer?.name}</p>
                                    <p className="text-lg text-gray-600 mt-2">{card.customer?.phone}</p>
                                </div>
                                <CreditCard size={52} className="text-emerald-700" />
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-500">POINTS BALANCE</p>
                                <p className="text-6xl font-black text-emerald-700 leading-none">{card.totalPoints}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">ISSUED ON</p>
                                <p className="text-base font-medium">{new Date(card.issuedAt).toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>

                        {/* QR Code */}
                        {qrUrl && (
                            <div className="absolute top-6 right-6">
                                <img src={qrUrl} alt="QR Code" className="h-28 w-28 border border-gray-300 rounded-xl shadow" />
                            </div>
                        )}
                    </div>

                    {/* Barcode */}
                    {barcodeUrl && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <img src={barcodeUrl} alt="Barcode" className="h-20" />
                        </div>
                    )}

                    <div className="absolute bottom-3 text-center w-full text-[10px] text-gray-400 tracking-widest">
                        NJBL SHOPPING MALL • NON-TRANSFERABLE • VALID FOR ALL OUTLETS
                    </div>
                </div>
            </div>
        </div>
    );
}