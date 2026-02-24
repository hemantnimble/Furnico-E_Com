# Furnico 🪑

A full-stack furniture e-commerce platform built with **Next.js 14**, **Prisma**, **MongoDB**, and **Redux Toolkit**. Furnico lets customers browse, purchase, and review furniture, while admins manage products and orders from a dedicated dashboard.

---

## ✨ Features

### Customer
- Browse and search products with live debounced search
- Filter products by category (tables, chairs, lamps, sofas)
- Product detail page with image gallery, **interactive 3D viewer** (Three.js), specs, and reviews
- Add to cart, update quantities, remove items
- Checkout with **Razorpay** payment integration
- Order history with status tracking
- Saved delivery addresses (add, edit, delete)
- Leave reviews (only for purchased products)
- Password change and OTP-based account recovery (SendGrid)

### Admin
- Dashboard with revenue metrics and recent orders overview
- Manage products: add, edit, update stock, delete
- Update order statuses (Pending / Delivered / Cancelled)
- Image uploads via **UploadThing**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB (via Prisma ORM) |
| Auth | NextAuth v5 (Credentials + Google OAuth) |
| State Management | Redux Toolkit |
| Payments | Razorpay |
| File Uploads | UploadThing |
| Email | SendGrid |
| Styling | Tailwind CSS + shadcn/ui |
| 3D Rendering | Three.js (r128) |
| Animations | Framer Motion, GSAP, Lenis (smooth scroll) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (e.g. MongoDB Atlas)
- Accounts for: Google OAuth, Razorpay, UploadThing, SendGrid

### Installation

```bash
git clone https://github.com/your-username/furnico.git
cd furnico
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Razorpay
NEXT_PUBLIC_PAYMENT_PUBLIC="rzp_test_..."
PAYMENT_SECRET="..."

# UploadThing
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# SendGrid
SEND_GRID_API="SG...."
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
furnico/
├── app/
│   ├── admin/          # Admin dashboard, add/update product pages
│   ├── api/            # API routes (auth, cart, orders, products, user)
│   ├── explore/        # Product browse & filter page
│   ├── product/[id]/   # Product detail page
│   ├── user/           # Cart, checkout, orders, account, addresses
│   └── lib/store/      # Redux store, slices (cart, products)
├── components/         # Reusable UI components
├── prisma/
│   └── schema.prisma   # Database schema
├── auth.ts             # NextAuth configuration
├── db.ts               # Prisma client
└── middleware.ts       # Route protection
```

---

## 🗄️ Data Models

- **User** — Auth, roles (USER / ADMIN), addresses, orders, reviews
- **Products** — Title, price, category, images, stock, reviews
- **Order / OrderItem** — Links users to purchased products with payment details
- **CartItem** — Per-user cart with quantity
- **Address** — Saved delivery addresses linked to users and orders
- **Review** — Rating + content, restricted to verified purchasers

---

## 🔐 Authentication & Authorization

- **Google OAuth** and **email/password** sign-in via NextAuth v5
- JWT sessions with role claims (`USER` / `ADMIN`)
- Middleware protects `/user/account`, `/user/checkout`, and all `/admin` routes
- Admin API routes verify the `ADMIN` role server-side

---

## 💳 Payment Flow

1. Client calls `/api/orders/createrazor` → creates a Razorpay order
2. Razorpay checkout opens in the browser
3. On success, client calls `/api/orders/createrazor` (PUT) to verify the signature
4. On verified, `/api/orders/create` persists the order in MongoDB and clears the cart

---

## 📦 Build & Deploy

```bash
npm run build   # runs prisma generate + next build
npm start
```

Deploy easily to **Vercel** — set all environment variables in the Vercel dashboard.

---

## 📄 License

MIT
