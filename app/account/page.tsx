'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, User, MapPin, LogOut, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { useAuth } from '@/lib/auth-context';
import { IOrder } from '@/lib/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      async function loadOrders() {
        try {
          const res = await fetch('/api/orders', { credentials: 'include' });
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
          }
        } catch (err) {
          console.error('Failed to load user orders', err);
        } finally {
          setLoadingOrders(false);
        }
      }
      loadOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#006778] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">Shipped</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Processing</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700">My Account</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Menu */}
          <aside className="md:col-span-4 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-[#006778] text-white flex items-center justify-center font-bold text-base">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">{user.name}</h2>
                <p className="text-xs text-slate-500 truncate">{user.phone}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#006778] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'bg-[#006778] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account Profile</span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer pt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="md:col-span-8">
            {activeTab === 'orders' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h1 className="text-lg font-bold text-slate-900">Order History</h1>
                  <span className="text-xs text-slate-400 font-medium">{orders.length} total orders</span>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-12 text-slate-400 text-xs">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 mb-1">No Orders Found</p>
                    <p className="text-xs text-slate-400 mb-4">You have not placed any orders yet.</p>
                    <Link
                      href="/"
                      className="px-5 py-2 bg-[#006778] text-white rounded-xl text-xs font-bold"
                    >
                      Shop Baby Essentials
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 mr-2">Order #</span>
                            <span className="font-mono font-bold text-slate-800">{ord.orderNumber}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                            {getStatusBadge(ord.orderStatus)}
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-700">
                              <span className="truncate pr-4">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-bold text-slate-900 shrink-0">
                                ৳ {item.subtotal.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-bold">
                          <span className="text-slate-500">Total (including shipping)</span>
                          <span className="text-sm text-[#006778]">৳ {ord.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
                <h1 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Profile Details
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Full Name</label>
                    <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {user.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Mobile Number</label>
                    <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {user.phone}
                    </p>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Email</label>
                    <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {user.email || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Account Role</label>
                    <p className="font-bold text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-100 uppercase">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.addresses && user.addresses.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>Saved Delivery Address</span>
                    </h3>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {user.addresses[0].address}, {user.addresses[0].city}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
