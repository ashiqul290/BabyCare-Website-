'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, AlertCircle, ShoppingBag, Truck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { IOrder } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<IOrder | null>(null);

  const shippingFee = city === 'Outside Dhaka' ? 120 : 60;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number starting with 01');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            userId: user?._id || undefined,
            name: name.trim(),
            phone: cleanPhone,
            email: email.trim() || undefined,
          },
          shippingAddress: {
            address: address.trim(),
            city,
            notes: notes.trim(),
          },
          items: cart.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
          })),
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to place order');
      } else {
        setConfirmedOrder(data.order);
        clearCart();
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
        <Header />
        <Navbar />

        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your order reference number is{' '}
              <strong className="text-slate-900 font-mono text-sm">{confirmedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">Delivery Address</span>
              <span className="text-slate-600">{confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">Recipient</span>
              <span className="text-slate-600">{confirmedOrder.customer.name} ({confirmedOrder.customer.phone})</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">Payment Option</span>
              <span className="font-semibold text-teal-800 uppercase">{confirmedOrder.paymentMethod} (৳ {confirmedOrder.total.toLocaleString()})</span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-slate-800 block">Ordered Items:</span>
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-semibold text-slate-800">৳ {it.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#006778] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#09545f] transition-colors"
            >
              Track in My Orders
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700">Checkout</span>
        </nav>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-slate-500 mb-6">
              Add diapers, baby milk formula, toys, or accessories to begin checkout.
            </p>
            <Link
              href="/category/all"
              className="px-6 py-2.5 bg-[#006778] text-white rounded-xl text-xs font-bold"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Delivery & Customer Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Truck className="w-4 h-4 text-[#006778]" />
                  <h2 className="text-sm font-bold text-slate-900">1. Delivery Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Farhana Ahmed"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number (Bangladesh) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-2">Delivery Area *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        city === 'Inside Dhaka'
                          ? 'border-[#006778] bg-teal-50/50 text-[#006778]'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <input
                          type="radio"
                          name="city"
                          value="Inside Dhaka"
                          checked={city === 'Inside Dhaka'}
                          onChange={() => setCity('Inside Dhaka')}
                          className="mr-2 text-teal-600"
                        />
                        <span className="font-bold">Inside Dhaka</span>
                      </div>
                      <span className="font-bold">৳ 60</span>
                    </label>

                    <label
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        city === 'Outside Dhaka'
                          ? 'border-[#006778] bg-teal-50/50 text-[#006778]'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <input
                          type="radio"
                          name="city"
                          value="Outside Dhaka"
                          checked={city === 'Outside Dhaka'}
                          onChange={() => setCity('Outside Dhaka')}
                          className="mr-2 text-teal-600"
                        />
                        <span className="font-bold">Outside Dhaka</span>
                      </div>
                      <span className="font-bold">৳ 120</span>
                    </label>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Full Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat / Road / Area / Landmark"
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, deliver in afternoon"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                  2. Payment Method
                </h2>

                <div className="space-y-2.5 text-xs">
                  <label
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#006778] bg-teal-50/40 text-[#006778]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-teal-600"
                      />
                      <div>
                        <span className="font-bold block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-slate-500">Pay cash in hand when you receive your baby products.</span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#006778] bg-teal-50/40 text-[#006778]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="text-teal-600"
                      />
                      <div>
                        <span className="font-bold block text-pink-600">bKash Online Payment</span>
                        <span className="text-[11px] text-slate-500">Instant bKash payment gateway processing.</span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#006778] bg-teal-50/40 text-[#006778]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="text-teal-600"
                      />
                      <div>
                        <span className="font-bold block text-orange-600">Nagad Online Payment</span>
                        <span className="text-[11px] text-slate-500">Instant Nagad wallet payment.</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4 lg:sticky lg:top-24 bg-white">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg border border-slate-100 object-contain p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee ({city})</span>
                    <span className="font-semibold text-slate-800">৳ {shippingFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-[#006778] text-base">৳ {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? 'Processing Order...' : 'Confirm Order'}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  By confirming order, you agree to our terms and genuine product return policy.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
