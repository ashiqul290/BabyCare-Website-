export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  addresses?: {
    address: string;
    city: string;
    postalCode?: string;
    isDefault?: boolean;
  }[];
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  fullDescription?: string;
  images: string[];
  categoryId: string;
  categorySlug?: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  brand: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  homepageSection?: 'featured' | 'diapering' | 'baby-foods' | 'none';
  tags: string[];
  badge?: string; // e.g. "NB 0-5 KG 40 PCS Belt"
  features?: string[];
  ingredients?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stockQuantity: number;
  sku?: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: {
    address: string;
    city: string; // e.g. 'Inside Dhaka' | 'Outside Dhaka'
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  productId: string;
  productName?: string;
  userId?: string;
  userName: string;
  userPhone?: string;
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
