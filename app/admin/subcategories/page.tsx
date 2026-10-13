'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ICategory, ISubcategory } from '@/lib/types';

export default function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [selectedParentFilter, setSelectedParentFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<ISubcategory | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/subcategories'),
      ]);
      const [catData, subData] = await Promise.all([catRes.json(), subRes.json()]);
      if (catData.categories) setCategories(catData.categories);
      if (subData.subcategories) setSubcategories(subData.subcategories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSub(null);
    setFormName('');
    setFormSlug('');
    setFormCategoryId(categories[0]?._id || '');
    setFormDescription('');
    setFormActive(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: ISubcategory) => {
    setEditingSub(sub);
    setFormName(sub.name);
    setFormSlug(sub.slug);
    setFormCategoryId(sub.categoryId);
    setFormDescription(sub.description || '');
    setFormActive(sub.isActive);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingSub) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoryId) {
      setErrorMsg('Please select a parent category');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim(),
        categoryId: formCategoryId,
        description: formDescription.trim(),
        isActive: formActive,
      };

      let res;
      if (editingSub) {
        res = await fetch(`/api/subcategories/${editingSub._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save subcategory');
      } else {
        setIsModalOpen(false);
        loadData();
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteError('');
    try {
      const res = await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Cannot delete subcategory');
      } else {
        setDeleteConfirmId(null);
        loadData();
      }
    } catch {
      setDeleteError('Network error. Please try again.');
    }
  };

  const filteredSubs = selectedParentFilter
    ? subcategories.filter((s) => s.categoryId === selectedParentFilter)
    : subcategories;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Subcategory Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Every subcategory belongs directly to a parent category.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory</span>
          </button>
        </div>

        {/* Filter by Parent Category */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
          <span className="font-bold text-slate-700">Filter by Parent:</span>
          <select
            value={selectedParentFilter}
            onChange={(e) => setSelectedParentFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:border-teal-500 outline-hidden"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {deleteError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Subcategories Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Subcategory Name</th>
                  <th className="py-3 px-5">Slug</th>
                  <th className="py-3 px-5">Parent Category</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading subcategories...
                    </td>
                  </tr>
                ) : filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No subcategories found for this selection.
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub) => {
                    const parent = categories.find((c) => c._id === sub.categoryId);
                    return (
                      <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900">{sub.name}</span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-[11px] text-teal-800">
                          {sub.slug}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-1 bg-[#e4eff5] text-[#006778] rounded-full font-bold text-[11px]">
                            {parent?.name || sub.categoryName || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                          {sub.description || '—'}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sub.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(sub)}
                              className="p-1.5 text-slate-500 hover:text-[#006778] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Subcategory"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(sub._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">Attach subcategory to its appropriate department.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Category *</label>
                <select
                  required
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500 font-medium"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Diaper Pants"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. diaper-pants"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={formActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormActive(e.target.value === 'active')}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingSub ? 'Update Subcategory' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this subcategory? If any products are assigned to it, deletion will be blocked.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
