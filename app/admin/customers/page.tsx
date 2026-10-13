'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, X, UserCheck, UserX } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { IUser, IOrder } from '@/lib/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState<IUser | null>(null);
  const [customerOrders, setCustomerOrders] = useState<IOrder[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const url = search.trim()
        ? `/api/customers?search=${encodeURIComponent(search.trim())}`
        : '/api/customers';
      const res = await fetch(url);
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const viewCustomerDetails = async (c: IUser) => {
    setSelectedCustomer(c);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/customers/${c._id}`);
      const data = await res.json();
      if (data.orders) setCustomerOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const toggleCustomerActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c))
        );
        if (selectedCustomer && selectedCustomer._id === id) {
          setSelectedCustomer({ ...selectedCustomer, isActive: !currentStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered parents, order histories, and account statuses.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, or email..."
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-teal-500 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <span className="text-slate-400 font-medium">
            {customers.length} registered customers
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Mobile Number</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Registered On</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading customer directory...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No registered customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-5 font-mono text-slate-700">{c.phone}</td>
                      <td className="py-3.5 px-5 text-slate-500">{c.email || '—'}</td>
                      <td className="py-3.5 px-5 text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewCustomerDetails(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#006778] text-slate-700 hover:text-white rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </button>
                          <button
                            onClick={() => toggleCustomerActive(c._id, c.isActive)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              c.isActive
                                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={c.isActive ? 'Deactivate Customer' : 'Activate Customer'}
                          >
                            {c.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Detail & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h2>
              <p className="text-slate-400 mt-0.5">{selectedCustomer.phone} • {selectedCustomer.email}</p>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-[11px] text-slate-400">Account Status</p>
                  <p className="font-bold text-slate-800 capitalize">
                    {selectedCustomer.isActive ? 'Active Member' : 'Deactivated'}
                  </p>
                </div>
                <button
                  onClick={() => toggleCustomerActive(selectedCustomer._id, selectedCustomer.isActive)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white"
                >
                  {selectedCustomer.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Customer Order History</h3>
                {loadingDetail ? (
                  <p className="text-slate-400 py-4 text-center">Loading orders...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-slate-400 py-4 text-center bg-slate-50 rounded-xl">
                    No orders placed by this customer yet.
                  </p>
                ) : (
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                    {customerOrders.map((ord) => (
                      <div key={ord._id} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-slate-800">{ord.orderNumber}</p>
                          <p className="text-slate-400 text-[11px]">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">৳ {ord.total.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-teal-800 uppercase">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
