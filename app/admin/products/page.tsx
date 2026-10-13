'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { IProduct, ICategory, ISubcategory } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formSubcategoryId, setFormSubcategoryId] = useState('');
  const [formBrand, setFormBrand] = useState('BabyCare');
  const [formCurrentPrice, setFormCurrentPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState<number>(50);
  const [formInStock, setFormInStock] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formHomepageSection, setFormHomepageSection] = useState<'featured' | 'diapering' | 'baby-foods' | 'none'>('none');
  const [formTags, setFormTags] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formActive, setFormActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadDependencies = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/subcategories'),
      ]);
      const [cData, sData] = await Promise.all([cRes.json(), sRes.json()]);
      if (cData.categories) setCategories(cData.categories);
      if (sData.subcategories) setSubcategories(sData.subcategories);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchQuery.trim()) query.set('search', searchQuery.trim());
      if (selectedCatFilter) query.set('categoryId', selectedCatFilter);
      query.set('page', page.toString());
      query.set('limit', '15');

      const res = await fetch(`/api/products?${query.toString()}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCatFilter, page]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormSku(`BC-${Date.now().toString().slice(-6)}`);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormImageUrl('/images/products/feeder-brush.svg');
    setFormCategoryId(categories[0]?._id || '');
    setFormSubcategoryId('');
    setFormBrand('BabyCare');
    setFormCurrentPrice(500);
    setFormOriginalPrice(undefined);
    setFormStock(50);
    setFormInStock(true);
    setFormIsFeatured(false);
    setFormHomepageSection('none');
    setFormTags('');
    setFormBadge('');
    setFormActive(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormSku(p.sku);
    setFormShortDesc(p.shortDescription || '');
    setFormFullDesc(p.fullDescription || '');
    setFormImageUrl(p.images[0] || '/images/products/feeder-brush.svg');
    setFormCategoryId(p.categoryId);
    setFormSubcategoryId(p.subcategoryId || '');
    setFormBrand(p.brand);
    setFormCurrentPrice(p.currentPrice);
    setFormOriginalPrice(p.originalPrice);
    setFormStock(p.stockQuantity);
    setFormInStock(p.inStock);
    setFormIsFeatured(p.isFeatured);
    setFormHomepageSection(p.homepageSection || 'none');
    setFormTags(p.tags ? p.tags.join(', ') : '');
    setFormBadge(p.badge || '');
    setFormActive(p.isActive);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingProduct) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
      );
    }
  };

  const calculatedDiscount =
    formOriginalPrice && formOriginalPrice > formCurrentPrice
      ? Math.round(((formOriginalPrice - formCurrentPrice) / formOriginalPrice) * 100)
      : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId) {
      setErrorMsg('Please specify product name and category');
      return;
    }

    if (formCurrentPrice < 0 || (formOriginalPrice !== undefined && formOriginalPrice < 0)) {
      setErrorMsg('Prices cannot be negative');
      return;
    }

    if (formStock < 0) {
      setErrorMsg('Stock quantity cannot be negative');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim(),
        sku: formSku.trim(),
        shortDescription: formShortDesc.trim(),
        fullDescription: formFullDesc.trim(),
        images: [formImageUrl.trim() || '/images/products/feeder-brush.svg'],
        categoryId: formCategoryId,
        subcategoryId: formSubcategoryId || undefined,
        brand: formBrand.trim(),
        currentPrice: Number(formCurrentPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        stockQuantity: Number(formStock),
        inStock: formStock > 0 ? formInStock : false,
        isFeatured: formIsFeatured,
        homepageSection: formHomepageSection,
        tags: formTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        badge: formBadge.trim() || undefined,
        isActive: formActive,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save product');
      } else {
        setIsModalOpen(false);
        loadProducts();
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmId(null);
        loadProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const availableSubcategories = formCategoryId
    ? subcategories.filter((s) => s.categoryId === formCategoryId)
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Product Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add, update prices, manage stock, and assign products to homepage sections.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product name..."
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-teal-500 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-bold text-slate-600">Category:</span>
            <select
              value={selectedCatFilter}
              onChange={(e) => {
                setSelectedCatFilter(e.target.value);
                setPage(1);
              }}
              className="border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-teal-500 outline-hidden"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Brand</th>
                  <th className="py-3 px-5">Price (BDT)</th>
                  <th className="py-3 px-5">Stock</th>
                  <th className="py-3 px-5">Homepage</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No products found. Add products above.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const cat = categories.find((c) => c._id === p.categoryId);
                    return (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3 max-w-xs">
                            <img
                              src={p.images[0] || '/images/products/feeder-brush.svg'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg border border-slate-100 object-contain p-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-medium">
                          {cat?.name || p.categorySlug || '—'}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-700">{p.brand}</td>
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900">৳ {p.currentPrice.toLocaleString()}</span>
                          {p.discountPercentage && p.discountPercentage > 0 && (
                            <span className="ml-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                              -{p.discountPercentage}%
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 tabular-nums">
                          <span
                            className={`font-bold ${
                              p.stockQuantity <= 5 ? 'text-red-600' : 'text-slate-800'
                            }`}
                          >
                            {p.stockQuantity} pcs
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#006778] capitalize">
                            {p.homepageSection || 'none'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-slate-500 hover:text-[#006778] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {products.length} of {totalItems} items</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-2 font-bold text-slate-800">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">Complete all product specifications and pricing.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Molfix Twin Newborn Belt"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unique Slug</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Molfix"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variant Badge (Optional)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. NB 0-5 KG 40 PCS Belt"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => {
                      setFormCategoryId(e.target.value);
                      setFormSubcategoryId('');
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
                  <select
                    value={formSubcategoryId}
                    onChange={(e) => setFormSubcategoryId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  >
                    <option value="">None / General</option>
                    {availableSubcategories.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formCurrentPrice}
                    onChange={(e) => setFormCurrentPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Regular price"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calculated Discount</label>
                  <div className="px-3 py-2 bg-amber-100 text-amber-800 rounded-xl font-extrabold text-center">
                    {calculatedDiscount > 0 ? `-${calculatedDiscount}%` : '0%'}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Image & Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL / Path</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/images/products/heinz-porridge.svg"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500 font-mono text-[11px]"
                  />
                  {formImageUrl && (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg border border-slate-200 object-contain p-0.5 bg-slate-50 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary Description</label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Key summary for card and highlights..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="Full paragraphs, specifications, nutrition facts..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Homepage Placement & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Homepage Section</label>
                  <select
                    value={formHomepageSection}
                    onChange={(e) => setFormHomepageSection(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  >
                    <option value="none">None (Catalog only)</option>
                    <option value="featured">Featured Products Grid</option>
                    <option value="diapering">Diapering Section</option>
                    <option value="baby-foods">Baby Foods Section</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="diaper, infant, formula"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Status</label>
                  <select
                    value={formActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormActive(e.target.value === 'active')}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
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
              Are you sure you want to delete this product? It will be removed from all public listings.
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
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
