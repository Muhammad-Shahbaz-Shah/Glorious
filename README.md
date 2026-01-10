# Glorious 🛍️

**Glorious** is a premium, full-stack E-commerce platform built with Next.js 15, offering a seamless shopping experience for customers and a robust management dashboard for administrators.

## ✨ Features

### 🛍️ Customer Facing
- **Dynamic Product Catalog:** Explore products across various categories with advanced filtering.
- **Smart Shopping Cart:** Persistent cart management with real-time updates.
- **Secure Checkout:** Streamlined checkout process with order tracking.
- **User Authentication:** Secure sign-in/up powered by Better-Auth, including Google Social Login.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.

### 🔐 Admin Dashboard
- **Comprehensive Analytics:** Track total sales, orders, and customer growth at a glance.
- **Product Management:** Full CRUD operations for products, including multi-image uploads.
- **Category Management:** Organise products into dynamic categories.
- **Order Tracking:** Monitor and update order statuses (Pending, Processing, Shipped, Delivered, etc.).
- **Payment Verification:** Verify manual payment screenshots and manage transactions.
- **PDF Invoice Generation:** Generate and download professional PDF invoices for orders.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS 4 with Glassmorphism effects
- **Authentication:** [Better-Auth](https://better-auth.com/)
- **Database:** MongoDB with [Mongoose](https://mongoosejs.com/)
- **Storage:** [Supabase](https://supabase.com/) (for product/category images)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Animations:** [Motion](https://motion.dev/) (formerly Framer Motion)
- **Forms:** React Hook Form with Zod validation
- **Email:** Nodemailer with Gmail SMTP

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Muhammad-Shahbaz-Shah/Glorious.git
cd glorious
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_here

# Supabase (Storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Nodemailer)
GOOGLE_APP_PASSWORD=your_gmail_app_password
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Database, Auth, and utility configurations.
- `src/Models`: Mongoose schemas for MongoDB.
- `public`: Static assets like images and fonts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---
Created by **Syed** with ❤️ and ☕
