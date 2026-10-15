// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
// import { AdminLayout } from '@/components/admin/AdminLayout';
// import { ICategory } from '@/lib/types';

// export default function AdminCategoriesPage() {
//   const [categories, setCategories] = useState<ICategory[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
//   const [formName, setFormName] = useState('');
//   const [formSlug, setFormSlug] = useState('');
//   const [formDescription, setFormDescription] = useState('');
//   const [formIcon, setFormIcon] = useState('diaper');
//   const [formOrder, setFormOrder] = useState(1);
//   const [formActive, setFormActive] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   // Delete Confirmation State
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
//   const [deleteError, setDeleteError] = useState('');

//   const loadCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/categories');
//       const data = await res.json();
//       if (data.categories) setCategories(data.categories);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const openAddModal = () => {
//     setEditingCategory(null);
//     setFormName('');
//     setFormSlug('');
//     setFormDescription('');
//     setFormIcon('diaper');
//     setFormOrder(categories.length + 1);
//     setFormActive(true);
//     setErrorMsg('');
//     setIsModalOpen(true);
//   };

//   const openEditModal = (cat: ICategory) => {
//     setEditingCategory(cat);
//     setFormName(cat.name);
//     setFormSlug(cat.slug);
//     setFormDescription(cat.description || '');
//     setFormIcon(cat.icon || 'diaper');
//     setFormOrder(cat.displayOrder);
//     setFormActive(cat.isActive);
//     setErrorMsg('');
//     setIsModalOpen(true);
//   };

//   const handleNameChange = (val: string) => {
//     setFormName(val);
//     if (!editingCategory) {
//       setFormSlug(
//         val
//           .toLowerCase()
//           .replace(/[^\w\s-]/g, '')
//           .replace(/[\s_-]+/g, '-')
//       );
//     }
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg('');
//     setSubmitting(true);

//     try {
//       const payload = {
//         name: formName.trim(),
//         slug: formSlug.trim(),
//         description: formDescription.trim(),
//         icon: formIcon,
//         displayOrder: Number(formOrder),
//         isActive: formActive,
//       };

//       let res;
//       if (editingCategory) {
//         res = await fetch(`/api/categories/${editingCategory._id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         res = await fetch('/api/categories', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//       }

//       const data = await res.json();
//       if (!res.ok) {
//         setErrorMsg(data.error || 'Failed to save category');
//       } else {
//         setIsModalOpen(false);
//         loadCategories();
//       }
//     } catch {
//       setErrorMsg('Network error. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     setDeleteError('');
//     try {
//       const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
//       const data = await res.json();
//       if (!res.ok) {
//         setDeleteError(data.error || 'Cannot delete category');
//       } else {
//         setDeleteConfirmId(null);
//         loadCategories();
//       }
//     } catch {
//       setDeleteError('Network error. Please try again.');
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6 max-w-6xl">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
//               Category Management
//             </h1>
//             <p className="text-xs text-slate-500 mt-0.5">
//               Create, organize, and manage primary store product departments.
//             </p>
//           </div>

//           <button
//             onClick={openAddModal}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Category</span>
//           </button>
//         </div>

//         {deleteError && (
//           <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
//             <AlertCircle className="w-4 h-4 shrink-0" />
//             <span>{deleteError}</span>
//           </div>
//         )}

//         {/* Categories Table */}
//         <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-xs">
//               <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
//                 <tr>
//                   <th className="py-3 px-5">Order</th>
//                   <th className="py-3 px-5">Category Name</th>
//                   <th className="py-3 px-5">Slug</th>
//                   <th className="py-3 px-5">Description</th>
//                   <th className="py-3 px-5">Status</th>
//                   <th className="py-3 px-5 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="py-8 text-center text-slate-400">
//                       Loading categories...
//                     </td>
//                   </tr>
//                 ) : categories.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-8 text-center text-slate-400">
//                       No categories created yet. Click Add Category above.
//                     </td>
//                   </tr>
//                 ) : (
//                   categories.map((cat) => (
//                     <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
//                       <td className="py-3.5 px-5 font-bold text-slate-400 tabular-nums">
//                         #{cat.displayOrder}
//                       </td>
//                       <td className="py-3.5 px-5">
//                         <span className="font-bold text-slate-900">{cat.name}</span>
//                       </td>
//                       <td className="py-3.5 px-5 font-mono text-[11px] text-teal-800">
//                         {cat.slug}
//                       </td>
//                       <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
//                         {cat.description || '—'}
//                       </td>
//                       <td className="py-3.5 px-5">
//                         <span
//                           className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
//                             cat.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
//                           }`}
//                         >
//                           {cat.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="py-3.5 px-5 text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={() => openEditModal(cat)}
//                             className="p-1.5 text-slate-500 hover:text-[#006778] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
//                             title="Edit Category"
//                           >
//                             <Edit2 className="w-3.5 h-3.5" />
//                           </button>
//                           <button
//                             onClick={() => setDeleteConfirmId(cat._id)}
//                             className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
//                             title="Delete Category"
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add / Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
//           <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h2 className="text-base font-bold text-slate-900 mb-1">
//               {editingCategory ? 'Edit Category' : 'Add New Category'}
//             </h2>
//             <p className="text-xs text-slate-400 mb-4">Configure department attributes and ordering.</p>

//             {errorMsg && (
//               <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 shrink-0" />
//                 <span>{errorMsg}</span>
//               </div>
//             )}

//             <form onSubmit={handleSave} className="space-y-4 text-xs">
//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formName}
//                   onChange={(e) => handleNameChange(e.target.value)}
//                   placeholder="e.g. Baby Foods"
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Slug (URL identifier)</label>
//                 <input
//                   type="text"
//                   required
//                   value={formSlug}
//                   onChange={(e) => setFormSlug(e.target.value)}
//                   placeholder="e.g. baby-foods"
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] outline-hidden focus:border-teal-500"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Description</label>
//                 <textarea
//                   rows={2}
//                   value={formDescription}
//                   onChange={(e) => setFormDescription(e.target.value)}
//                   placeholder="Short description for SEO and category page header..."
//                   className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">Display Order</label>
//                   <input
//                     type="number"
//                     value={formOrder}
//                     onChange={(e) => setFormOrder(Number(e.target.value))}
//                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">Status</label>
//                   <select
//                     value={formActive ? 'active' : 'inactive'}
//                     onChange={(e) => setFormActive(e.target.value === 'active')}
//                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="px-5 py-2 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer"
//                 >
//                   {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {deleteConfirmId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
//           <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
//             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
//               <Trash2 className="w-6 h-6" />
//             </div>
//             <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
//             <p className="text-xs text-slate-500">
//               Are you sure you want to delete this category? The deletion will be prevented if any subcategories or products still belong to it.
//             </p>
//             <div className="flex gap-3 justify-center pt-2">
//               <button
//                 onClick={() => setDeleteConfirmId(null)}
//                 className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirmId)}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
//               >
//                 Delete Category
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }
