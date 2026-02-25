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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
