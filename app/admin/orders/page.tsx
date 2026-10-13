'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, X, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { IOrder, OrderStatus, PaymentStatus } from '@/lib/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
        setSuccessMsg(`Status updated to ${newStatus}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    const matchesStatus = !statusFilter || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Shipped</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Processing</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Pending</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Order Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming orders, dispatch shipments, and track payments.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer name, phone..."
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-teal-500 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-teal-500 outline-hidden"
            >
              <option value="">All Statuses ({orders.length})</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">City / Area</th>
                  <th className="py-3 px-5">Items</th>
                  <th className="py-3 px-5">Total (BDT)</th>
                  <th className="py-3 px-5">Payment</th>
                  <th className="py-3 px-5">Order Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-800">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <p className="font-bold text-slate-900">{ord.customer.name}</p>
                        <p className="text-[11px] text-slate-400">{ord.customer.phone}</p>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-medium">
                        {ord.shippingAddress.city}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {ord.items.length} products ({ord.items.reduce((s, it) => s + it.quantity, 0)} pcs)
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-slate-900 tabular-nums">
                        ৳ {ord.total.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3.5 px-5">{getStatusBadge(ord.orderStatus)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setSuccessMsg('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#006778] text-slate-700 hover:text-white rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-100">
              <span className="text-slate-400 text-[11px]">Order Details</span>
              <h2 className="text-lg font-bold text-slate-900 font-mono">
                {selectedOrder.orderNumber}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {successMsg && (
              <div className="my-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="py-4 space-y-4">
              {/* Customer & Shipping info */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                <p className="font-bold text-slate-800">
                  {selectedOrder.customer.name} ({selectedOrder.customer.phone})
                </p>
                <p className="text-slate-600">
                  {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                </p>
                {selectedOrder.shippingAddress.notes && (
                  <p className="text-slate-500 italic">Notes: {selectedOrder.shippingAddress.notes}</p>
                )}
              </div>

              {/* Status Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Update Order Status</label>
                  <select
                    disabled={updatingStatus}
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value as OrderStatus)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-hidden focus:border-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Update Payment Status</label>
                  <select
                    disabled={updatingStatus}
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value as PaymentStatus)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-hidden focus:border-teal-500"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-800 block">Ordered Products</span>
                <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-9 h-9 object-contain bg-slate-50 rounded border p-0.5"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{it.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {it.quantity} × ৳ {it.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900">৳ {it.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-right">
                <p className="text-slate-500">
                  Subtotal: <span className="font-semibold text-slate-800">৳ {selectedOrder.subtotal.toLocaleString()}</span>
                </p>
                <p className="text-slate-500">
                  Shipping Fee: <span className="font-semibold text-slate-800">৳ {selectedOrder.shippingFee}</span>
                </p>
                <p className="text-sm font-black text-[#006778] pt-1">
                  Grand Total: ৳ {selectedOrder.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
