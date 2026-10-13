# BabyCare E-Commerce Store (Bangladesh)

A complete, production-ready, full-stack BabyCare e-commerce platform built to match the reference screenshots pixel-by-pixel, including responsive catalog grids, category filtering, detailed product pages, customer authentication, shopping cart, checkout with Cash on Delivery (COD), customer accounts, and an administrative dashboard at `/admin`.

---

## 1. Features Overview

### Storefront Experience
- **Header & Navigation**:
  - Logo with colorful baby wordmark and arch.
  - Centered live search bar with autocomplete.
  - Special Deal promotional trigger.
  - Account menu and live shopping cart badge.
  - Secondary navigation bar with dropdown menus for Diapering, Baby Foods, Feeding, School, Grooming & Care, and Toys.
- **Homepage Sections**:
  1. Header & secondary navigation.
  2. Side-by-side promotional hero banners (Baby extra care shampoo & School essentials).
  3. Featured Category circular icons with item counts.
  4. Featured Products grid in 4 columns.
  5. Diapering collection grid with size indicator badges.
  6. Baby Foods collection grid with Aptamil, Cow & Gate, SMA, Eldobaby, Nido, etc.
  7. Top Brands showcase with genuine logos.
  8. SEO informational content ("Ultimate Destination for Baby Essentials in Bangladesh!").
  9. Baby-themed footer illustration (smiling sun, fluffy clouds, butterflies, bird, balloon).
  10. Full footer with hotline `09614332211`, support email, policies, and payment method logos.
- **Category Listing Page (`/category/[slug]`)**:
  - Breadcrumb navigation.
  - Short SEO category description.
  - Subcategory pills / quick filter buttons.
  - Dual price range slider and availability filter.
  - 3-column product grid with sort and pagination.
  - Rich SEO content article below products.
- **Product Details Page (`/product/[id]`)**:
  - Breadcrumbs.
  - Large product image gallery with zoom/thumbnail selection.
  - Stock availability badge, pricing, original price, and discount percentage.
  - Summary key feature bullet points and quantity stepper.
  - Buy Now, Add to Cart, and Share button.
  - Detailed Description and Ingredients.
  - Bangladeshi pricing guide info box.
  - Customer Reviews section with "Write Your Review" modal.
  - Related Products sidebar.
- **Customer Authentication (`/login`, `/register`, `/forgot-password`)**:
  - Centered rounded card design.
  - 11-digit Bangladeshi mobile number validation (`01XXXXXXXXX`).
  - Secure bcrypt password hashing.
  - Password recovery flow with SMS/OTP mock simulation.
  - Remember me and session persistence.
- **Shopping Cart & Checkout (`/checkout`)**:
  - Slide-over cart drawer with quantity steppers and subtotal.
  - Cash on Delivery (COD) and Online Payment options.
  - Inside Dhaka (৳60) and Outside Dhaka (৳120) shipping calculations.
  - Instant order confirmation and receipt.

### Protected Admin Dashboard (`/admin`)
- **Dashboard Overview**: Summary metric cards (Total Categories, Subcategories, Products, Orders) and recent orders table.
- **Category Management (`/admin/categories`)**: Full CRUD with auto-slug generation, display ordering, and deletion safety checks.
- **Subcategory Management (`/admin/subcategories`)**: Full CRUD attached to parent categories with filtering.
- **Product Management (`/admin/products`)**: Full CRUD with price, discount, SKU, stock quantity, homepage section assignment, and images.
- **Order Management (`/admin/orders`)**: View order details, track customer info, update statuses (Pending, Processing, Shipped, Delivered, Cancelled).
- **Customer Management (`/admin/customers`)**: View registered parents, inspect order history, toggle account status. Passwords are never exposed.
- **Review Moderation (`/admin/reviews`)**: Approve or reject customer reviews before public display.

---

## 2. Default Administrator Credentials

As specified in the project requirements:
- **Admin Email**: `ashiquldeveloper11@gmail.com`
- **Admin Password**: `455014As`

*Note: Initial setup credentials are read from backend environment variables and hashed using bcrypt on first boot seed.*

---

## 3. Technology Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js REST API routes (`/app/api/*`) with JSON Web Tokens (JWT) and HTTP-only secure cookies.
- **Database & Persistence**: Resilient persistent document layer with MongoDB Mongoose compatibility (`lib/db/index.ts` and `.data/db.json`), persisting all CRUD operations seamlessly across restarts.
- **Security**: bcryptjs password hashing, server-side price and stock validation.

---

## 4. Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 5. External Services Configuration

| Service | Purpose | Configuration Variable |
|---|---|---|
| **MongoDB** | Remote MongoDB Cluster | `MONGODB_URI` (optional, falls back to disk-persisted document database) |
| **JWT** | Auth Token Signing | `JWT_SECRET` |
| **Cloudinary / S3** | Remote Image Storage | Optional configuration via media upload route |
| **bKash / SSLCommerz** | Online Payment Gateway | Optional provider keys |
