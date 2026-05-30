'use client';

import { useEffect, useRef, useState } from 'react';
import { Trash2, Search, ShoppingCart, CreditCard, UserCheck, X, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
    id: number;
    barcode: string;
    name: string;
    price: number;
    stock: number;
}

interface CartItem extends Product {
    quantity: number;
    total: number;
}

interface BillingResponse {
    billNumber: string;
    totalAmount: number;
    isMember: boolean;
    customerName?: string;
    message: string;
}

export default function POSBilling() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerPhone, setCustomerPhone] = useState('');
    const [customer, setCustomer] = useState<any>(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const searchRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Live Search
    const handleLiveSearch = async (value: string) => {
        setSearchInput(value);
        setErrorMessage('');

        if (value.trim().length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/shoppingmall-products/search?query=${encodeURIComponent(value)}`,
                { credentials: 'include' }
            );

            if (res.ok) {
                const products: Product[] = await res.json();
                setSearchResults(products);
                setShowDropdown(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            setErrorMessage(`❌ ${product.name} is out of stock!`);
            return;
        }

        const existingIndex = cart.findIndex(item => item.barcode === product.barcode);

        if (existingIndex !== -1) {
            const updatedCart = [...cart];
            const newQty = updatedCart[existingIndex].quantity + 1;

            if (newQty > product.stock) {
                setErrorMessage(`❌ Only ${product.stock} available for ${product.name}`);
                return;
            }

            updatedCart[existingIndex].quantity = newQty;
            updatedCart[existingIndex].total = updatedCart[existingIndex].price * newQty;
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1, total: Number(product.price) }]);
        }

        setSearchInput('');
        setShowDropdown(false);
        setErrorMessage('');
        searchRef.current?.focus();
    };

    const updateQuantity = (index: number, amount: number) => {
        const updatedCart = [...cart];
        const newQty = updatedCart[index].quantity + amount;

        if (newQty > updatedCart[index].stock) {
            setErrorMessage(`❌ Only ${updatedCart[index].stock} available`);
            return;
        }

        if (newQty <= 0) {
            removeItem(index);
            return;
        }

        updatedCart[index].quantity = newQty;
        updatedCart[index].total = updatedCart[index].price * newQty;
        setCart(updatedCart);
        setErrorMessage('');
    };

    const removeItem = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
        setErrorMessage('');
    };

    const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

    // ✅ FIXED: Customer Membership Check
    const checkMembership = async () => {
        if (!customerPhone || customerPhone.length < 10) {
            setCustomer(null);
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/pos/customer/search?phone=${customerPhone}`,
                { credentials: 'include' }
            );

            if (res.ok) {
                const data = await res.json();
                setCustomer(data);
            } else {
                setCustomer(null);
            }
        } catch (e) {
            console.error(e);
            setCustomer(null);
        }
    };

    const completeSale = async () => {
        if (cart.length === 0) {
            setErrorMessage("Cart is empty!");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const payload = {
            customerPhone: customerPhone || null,
            items: cart.map(item => ({
                barcode: item.barcode,
                quantity: item.quantity
            })),
            discountAmount: 0,
            paymentMethod,
            trxId: 'POS-' + Date.now()
        };

        try {
            const res = await fetch('http://localhost:8080/api/pos/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const bill: BillingResponse = await res.json();
                alert('✅ Sale Completed Successfully!');
                printReceipt(bill);

                setCart([]);
                setCustomerPhone('');
                setCustomer(null);
                setErrorMessage('');
            } else {
                const errorText = await res.text();
                setErrorMessage(`❌ ${errorText || 'Failed to complete sale'}`);
            }
        } catch (e) {
            console.error(e);
            setErrorMessage('❌ Network Error');
        } finally {
            setIsLoading(false);
        }
    };

    const printReceipt = (bill: BillingResponse) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html><head><title>${bill.billNumber}</title>
            <style>
                body { font-family: Arial; padding: 30px; }
                .receipt { max-width: 400px; margin: auto; border: 2px dashed #166534; padding: 20px; }
                .center { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                td, th { padding: 8px; border-bottom: 1px solid #ddd; }
                .total { font-size: 24px; font-weight: bold; color: #166534; }
            </style>
            </head><body>
            <div class="receipt">
                <h2 class="center">SB GROUP</h2>
                <p class="center">Shopping Mall POS</p>
                <hr/>
                <p><strong>Bill No:</strong> ${bill.billNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Customer:</strong> ${bill.customerName || 'Walk-in'}</p>
                <hr/>
                <table>
                    <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
                    ${cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>৳${item.total}</td>
                        </tr>
                    `).join('')}
                </table>
                <hr/>
                <p class="total">Grand Total: ৳${bill.totalAmount}</p>
                <p>Payment: ${paymentMethod}</p>
                ${bill.isMember ? '<p style="color:green;">★ Loyalty Member ★</p>' : ''}
                <hr/>
                <p class="center">Thank You!</p>
            </div>
            </body></html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-green-800 mb-2">🛒 SB GROUP POS</h1>
                <p className="text-gray-600 mb-8">Smart Billing System</p>

                {errorMessage && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search */}
                        <Card className="border-green-200 shadow-xl">
                            <CardContent className="p-6">
                                <div className="relative">
                                    <Input
                                        ref={searchRef}
                                        value={searchInput}
                                        onChange={(e) => handleLiveSearch(e.target.value)}
                                        placeholder="Search by product name or barcode..."
                                        className="h-14 text-lg border-2 border-green-600"
                                        onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch(searchInput)}
                                    />

                                    {showDropdown && searchResults.length > 0 && (
                                        <div ref={dropdownRef} className="absolute z-50 w-full mt-2 bg-white border border-green-200 rounded-xl shadow-2xl max-h-96 overflow-auto">
                                            {searchResults.map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => addToCart(product)}
                                                    className="px-6 py-4 hover:bg-green-50 cursor-pointer flex justify-between border-b last:border-none"
                                                >
                                                    <div>
                                                        <p className="font-semibold">{product.name}</p>
                                                        <p className="text-sm text-gray-500">{product.barcode}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-green-700">৳{product.price}</p>
                                                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cart */}
                        <Card className="border-green-200 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <ShoppingCart className="text-green-700" />
                                    Cart Items ({cart.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-right">৳{item.price}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Button size="sm" variant="outline" onClick={() => updateQuantity(index, -1)}>-</Button>
                                                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                                                        <Button size="sm" variant="outline" onClick={() => updateQuantity(index, 1)}>+</Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-green-700">৳{item.total}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {cart.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-16 text-gray-500">
                                                    No items in cart yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>
                        <Card className="border-green-200 shadow-xl sticky top-6">
                            <CardContent className="p-6 space-y-6">
                                {/* Customer Phone */}
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">Customer Phone (Optional)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            onBlur={checkMembership}
                                            onKeyDown={(e) => e.key === 'Enter' && checkMembership()}
                                        />
                                        <Button onClick={checkMembership} className="bg-green-700 hover:bg-green-800">
                                            <UserCheck size={18} />
                                        </Button>
                                    </div>
                                    {customer && (
                                        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-xl">
                                            <p className="font-semibold text-green-800 flex items-center gap-2">
                                                <UserCheck size={18} />
                                                {customer.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Total & Payment */}
                                <div className="pt-6 border-t">
                                    <div className="text-6xl font-extrabold text-green-700 mb-6">
                                        ৳{grandTotal}
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-sm text-gray-600 mb-2 block">Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full h-14 border-2 border-green-600 rounded-xl px-4 text-lg"
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="BKASH">bKash</option>
                                            <option value="CARD">Card</option>
                                        </select>
                                    </div>

                                    <Button
                                        onClick={completeSale}
                                        disabled={cart.length === 0 || isLoading}
                                        className="w-full h-16 text-xl font-semibold bg-green-700 hover:bg-green-800"
                                    >
                                        <CreditCard className="mr-3" />
                                        {isLoading ? 'Processing...' : 'COMPLETE SALE'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}