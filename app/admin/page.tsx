'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, FolderTree, Package, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { IOrder } from '@/lib/types';

interface DashboardStats {
  totalCategories: number;
  totalSubcategories: number;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: IOrder[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error('Failed to load dashboard stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Shipped</span>;
      case 'processing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Processing</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Pending</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Welcome */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store operations and vital catalog metrics at a glance.
          </p>
        </div>

        {/* 4 Essential Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Categories
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006778] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-3 tabular-nums">
              {loading ? '...' : stats?.totalCategories || 0}
            </p>
          </div>

          {/* Total Subcategories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Subcategories
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-3 tabular-nums">
              {loading ? '...' : stats?.totalSubcategories || 0}
            </p>
          </div>

          {/* Total Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-3 tabular-nums">
              {loading ? '...' : stats?.totalProducts || 0}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-3 tabular-nums">
              {loading ? '...' : stats?.totalOrders || 0}
            </p>
          </div>
        </div>

        {/* Small Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#006778] hover:underline"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Items</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 font-mono font-bold text-slate-800">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-5">
                        <p className="font-bold text-slate-900">{order.customer.name}</p>
                        <p className="text-[11px] text-slate-400">{order.customer.phone}</p>
                      </td>
                      <td className="py-3 px-5 text-slate-600">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} items
                      </td>
                      <td className="py-3 px-5 font-bold text-slate-900">
                        ৳ {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-5">{getStatusBadge(order.orderStatus)}</td>
                      <td className="py-3 px-5 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
