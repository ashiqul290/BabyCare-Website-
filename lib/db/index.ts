import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  IUser,
  ICategory,
  ISubcategory,
  IProduct,
  IOrder,
  IReview,
} from '@/lib/types';
import {
  SEED_CATEGORIES,
  SEED_SUBCATEGORIES,
  SEED_PRODUCTS,
  SEED_REVIEWS,
} from './seed-data';

interface DatabaseSchema {
  users: IUser[];
  categories: ICategory[];
  subcategories: ISubcategory[];
  products: IProduct[];
  orders: IOrder[];
  reviews: IReview[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let memoryDb: DatabaseSchema | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function getDb(): Promise<DatabaseSchema> {
  if (memoryDb) {
    return memoryDb;
  }

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      if (memoryDb && memoryDb.products && memoryDb.categories) {
        return memoryDb;
      }
    } catch (e) {
      console.warn('Failed to parse existing DB file, reinitializing', e);
    }
  }

  // Initialize DB from Seeds
  const adminEmail = process.env.ADMIN_EMAIL || 'ashiquldeveloper11@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '455014As';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const initialAdmin: IUser = {
    _id: 'user-admin-1',
    name: 'BabyCare Administrator',
    email: adminEmail,
    phone: '01912345678',
    password: hashedAdminPassword,
    role: 'admin',
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const initialDemoCustomer: IUser = {
    _id: 'user-customer-demo',
    name: 'Farhana Ahmed',
    email: 'farhana@example.com',
    phone: '01711002233',
    password: await bcrypt.hash('customer123', 10),
    role: 'customer',
    isActive: true,
    addresses: [
      {
        address: 'House 42, Road 11, Block D, Banani',
        city: 'Inside Dhaka',
        postalCode: '1213',
        isDefault: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const initialOrder: IOrder = {
    _id: 'ord-1001',
    orderNumber: 'BC-2026-1001',
    customer: {
      userId: 'user-customer-demo',
      name: 'Farhana Ahmed',
      phone: '01711002233',
      email: 'farhana@example.com',
    },
    shippingAddress: {
      address: 'House 42, Road 11, Block D, Banani',
      city: 'Inside Dhaka',
      notes: 'Please call before delivery',
    },
    items: [
      {
        productId: 'prod-heinz-creamy-porridge',
        name: 'Heinz Creamy n Lumpy Fruits and Yogurt Porridge 125g (6M+)',
        image: '/images/products/heinz-porridge.svg',
        price: 1000,
        quantity: 2,
        subtotal: 2000,
      },
      {
        productId: 'prod-molfix-nb-40',
        name: 'Molfix Twin Newborn Belt 0-5 Kg 40 Pcs',
        image: '/images/products/molfix-nb.svg',
        price: 1090,
        quantity: 1,
        subtotal: 1090,
      },
    ],
    subtotal: 3090,
    shippingFee: 60,
    discount: 0,
    total: 3150,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    orderStatus: 'processing',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  };

  memoryDb = {
    users: [initialAdmin, initialDemoCustomer],
    categories: [...SEED_CATEGORIES],
    subcategories: [...SEED_SUBCATEGORIES],
    products: [...SEED_PRODUCTS],
    orders: [initialOrder],
    reviews: [...SEED_REVIEWS],
  };

  saveDbSync(memoryDb);
  return memoryDb;
}

export function saveDbSync(db: DatabaseSchema) {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write db to disk', e);
  }
}

// User methods
export async function findUserByEmail(email: string): Promise<IUser | null> {
  const db = await getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserByPhone(phone: string): Promise<IUser | null> {
  const db = await getDb();
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return db.users.find((u) => u.phone.replace(/[\s-]/g, '') === cleanPhone) || null;
}

export async function findUserById(id: string): Promise<IUser | null> {
  const db = await getDb();
  return db.users.find((u) => u._id === id) || null;
}

export async function createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
  const db = await getDb();
  const newUser: IUser = {
    ...userData,
    _id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDbSync(db);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
  const db = await getDb();
  const index = db.users.findIndex((u) => u._id === id);
  if (index === -1) return null;
  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDbSync(db);
  return db.users[index];
}

export async function getCustomers(): Promise<IUser[]> {
  const db = await getDb();
  return db.users.filter((u) => u.role === 'customer');
}

// Category methods
export async function getCategories(): Promise<ICategory[]> {
  const db = await getDb();
  return db.categories.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function findCategoryById(id: string): Promise<ICategory | null> {
  const db = await getDb();
  return db.categories.find((c) => c._id === id) || null;
}

export async function findCategoryBySlug(slug: string): Promise<ICategory | null> {
  const db = await getDb();
  return db.categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(cat: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ICategory> {
  const db = await getDb();
  const newCat: ICategory = {
    ...cat,
    _id: `cat-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.categories.push(newCat);
  saveDbSync(db);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<ICategory>): Promise<ICategory | null> {
  const db = await getDb();
  const index = db.categories.findIndex((c) => c._id === id);
  if (index === -1) return null;
  db.categories[index] = {
    ...db.categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDbSync(db);
  return db.categories[index];
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message?: string }> {
  const db = await getDb();
  const subcats = db.subcategories.filter((s) => s.categoryId === id);
  if (subcats.length > 0) {
    return { success: false, message: `Cannot delete: ${subcats.length} subcategories depend on this category.` };
  }
  const products = db.products.filter((p) => p.categoryId === id);
  if (products.length > 0) {
    return { success: false, message: `Cannot delete: ${products.length} products depend on this category.` };
  }
  db.categories = db.categories.filter((c) => c._id !== id);
  saveDbSync(db);
  return { success: true };
}

// Subcategory methods
export async function getSubcategories(categoryId?: string): Promise<ISubcategory[]> {
  const db = await getDb();
  if (categoryId) {
    return db.subcategories.filter((s) => s.categoryId === categoryId);
  }
  return db.subcategories;
}

export async function findSubcategoryById(id: string): Promise<ISubcategory | null> {
  const db = await getDb();
  return db.subcategories.find((s) => s._id === id) || null;
}

export async function findSubcategoryBySlug(slug: string): Promise<ISubcategory | null> {
  const db = await getDb();
  return db.subcategories.find((s) => s.slug === slug) || null;
}

export async function createSubcategory(sub: Omit<ISubcategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISubcategory> {
  const db = await getDb();
  const newSub: ISubcategory = {
    ...sub,
    _id: `sub-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.subcategories.push(newSub);
  saveDbSync(db);
  return newSub;
}

export async function updateSubcategory(id: string, updates: Partial<ISubcategory>): Promise<ISubcategory | null> {
  const db = await getDb();
  const index = db.subcategories.findIndex((s) => s._id === id);
  if (index === -1) return null;
  db.subcategories[index] = {
    ...db.subcategories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDbSync(db);
  return db.subcategories[index];
}

export async function deleteSubcategory(id: string): Promise<{ success: boolean; message?: string }> {
  const db = await getDb();
  const products = db.products.filter((p) => p.subcategoryId === id);
  if (products.length > 0) {
    return { success: false, message: `Cannot delete: ${products.length} products belong to this subcategory.` };
  }
  db.subcategories = db.subcategories.filter((s) => s._id !== id);
  saveDbSync(db);
  return { success: true };
}

// Product methods
export async function getProducts(query?: {
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  subcategorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  homepageSection?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}): Promise<{ products: IProduct[]; total: number; page: number; totalPages: number }> {
  const db = await getDb();
  let list = [...db.products].filter((p) => p.isActive);

  if (query?.homepageSection && query.homepageSection !== 'all') {
    list = list.filter((p) => p.homepageSection === query.homepageSection);
  }

  if (query?.categoryId) {
    list = list.filter((p) => p.categoryId === query.categoryId);
  }

  if (query?.categorySlug) {
    list = list.filter((p) => p.categorySlug === query.categorySlug);
  }

  if (query?.subcategorySlug) {
    list = list.filter((p) => p.subcategorySlug === query.subcategorySlug);
  }

  if (query?.brand) {
    list = list.filter((p) => p.brand.toLowerCase() === query.brand?.toLowerCase());
  }

  if (query?.inStock !== undefined) {
    list = list.filter((p) => p.inStock === query.inStock);
  }

  if (query?.isFeatured !== undefined) {
    list = list.filter((p) => p.isFeatured === query.isFeatured);
  }

  if (query?.minPrice !== undefined) {
    list = list.filter((p) => p.currentPrice >= (query.minPrice || 0));
  }

  if (query?.maxPrice !== undefined) {
    list = list.filter((p) => p.currentPrice <= (query.maxPrice || 999999));
  }

  if (query?.search) {
    const s = query.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(s)) ||
        p.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Sorting
  if (query?.sortBy === 'price-low') {
    list.sort((a, b) => a.currentPrice - b.currentPrice);
  } else if (query?.sortBy === 'price-high') {
    list.sort((a, b) => b.currentPrice - a.currentPrice);
  } else if (query?.sortBy === 'popularity') {
    list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  } else if (query?.sortBy === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = list.length;
  const page = query?.page || 1;
  const limit = query?.limit || 24;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    totalPages,
  };
}

export async function findProductById(id: string): Promise<IProduct | null> {
  const db = await getDb();
  return db.products.find((p) => p._id === id) || null;
}

export async function findProductBySlug(slug: string): Promise<IProduct | null> {
  const db = await getDb();
  return db.products.find((p) => p.slug === slug) || null;
}

export async function createProduct(prod: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
  const db = await getDb();
  const discountPercentage =
    prod.originalPrice && prod.originalPrice > prod.currentPrice
      ? Math.round(((prod.originalPrice - prod.currentPrice) / prod.originalPrice) * 100)
      : 0;

  const newProd: IProduct = {
    ...prod,
    discountPercentage,
    _id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProd);
  saveDbSync(db);
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
  const db = await getDb();
  const index = db.products.findIndex((p) => p._id === id);
  if (index === -1) return null;

  const current = db.products[index];
  const currentPrice = updates.currentPrice !== undefined ? updates.currentPrice : current.currentPrice;
  const originalPrice = updates.originalPrice !== undefined ? updates.originalPrice : current.originalPrice;
  let discountPercentage = current.discountPercentage;

  if (originalPrice && originalPrice > currentPrice) {
    discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  } else {
    discountPercentage = 0;
  }

  db.products[index] = {
    ...current,
    ...updates,
    discountPercentage,
    updatedAt: new Date().toISOString(),
  };
  saveDbSync(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const beforeLen = db.products.length;
  db.products = db.products.filter((p) => p._id !== id);
  if (db.products.length !== beforeLen) {
    saveDbSync(db);
    return true;
  }
  return false;
}

// Order methods
export async function getOrders(userId?: string): Promise<IOrder[]> {
  const db = await getDb();
  if (userId) {
    return db.orders
      .filter((o) => o.customer.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function findOrderById(id: string): Promise<IOrder | null> {
  const db = await getDb();
  return db.orders.find((o) => o._id === id || o.orderNumber === id) || null;
}

export async function createOrder(orderData: Omit<IOrder, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<IOrder> {
  const db = await getDb();
  const orderNumber = `BC-${Date.now().toString().slice(-6)}`;
  const newOrder: IOrder = {
    ...orderData,
    _id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Decrement product stock
  for (const item of newOrder.items) {
    const prod = db.products.find((p) => p._id === item.productId);
    if (prod) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      if (prod.stockQuantity === 0) {
        prod.inStock = false;
      }
    }
  }

  db.orders.unshift(newOrder);
  saveDbSync(db);
  return newOrder;
}

export async function updateOrder(id: string, updates: Partial<IOrder>): Promise<IOrder | null> {
  const db = await getDb();
  const index = db.orders.findIndex((o) => o._id === id || o.orderNumber === id);
  if (index === -1) return null;
  db.orders[index] = {
    ...db.orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDbSync(db);
  return db.orders[index];
}

// Review methods
export async function getReviews(productId?: string, onlyApproved = true): Promise<IReview[]> {
  const db = await getDb();
  let list = db.reviews;
  if (productId) {
    list = list.filter((r) => r.productId === productId);
  }
  if (onlyApproved) {
    list = list.filter((r) => r.status === 'approved');
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createReview(rev: Omit<IReview, '_id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<IReview> {
  const db = await getDb();
  const newRev: IReview = {
    ...rev,
    status: 'pending', // Admins can approve
    _id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.reviews.push(newRev);
  saveDbSync(db);
  return newRev;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<IReview | null> {
  const db = await getDb();
  const index = db.reviews.findIndex((r) => r._id === id);
  if (index === -1) return null;
  db.reviews[index].status = status;
  db.reviews[index].updatedAt = new Date().toISOString();
  saveDbSync(db);
  return db.reviews[index];
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = await getDb();
  const beforeLen = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r._id !== id);
  if (db.reviews.length !== beforeLen) {
    saveDbSync(db);
    return true;
  }
  return false;
}

// Admin Dashboard stats
export async function getAdminStats() {
  const db = await getDb();
  const totalCategories = db.categories.length;
  const totalSubcategories = db.subcategories.length;
  const totalProducts = db.products.length;
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter((u) => u.role === 'customer').length;
  const pendingOrders = db.orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);

  return {
    totalCategories,
    totalSubcategories,
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalRevenue,
    recentOrders: db.orders.slice(0, 5),
  };
}
