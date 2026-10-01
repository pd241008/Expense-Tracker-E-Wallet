# 💰 Spendly — Expense Manager

A polished, production-minded expense tracker built with **Next.js 15 (App Router)**, **Convex**, and **Clerk**.

## ✨ Features

- **🔐 Auth that's actually enforced** — Clerk sessions protect every page and API route (no trusting client-supplied user IDs).
- **💵 Transactions** — add, edit, and delete with optimistic UI, validation, and toast feedback.
- **🗂️ Categories** — sensible defaults plus custom categories with an icon picker and duplicate protection.
- **📊 Insights** — YTD income/expense/net stats, expenses-by-category donut, and a 12-month activity heatmap.
- **🎨 Design system** — Tailwind v4 tokens, shadcn/ui components, full light/dark theming, skeleton loading, empty and error states everywhere.
- **📱 Responsive** — sidebar on desktop, bottom tab bar on mobile.

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router + route groups (`(app)` shell, `(marketing)` pages)
- [Convex](https://convex.dev/) — serverless database & functions
- [Clerk](https://clerk.com/) — authentication
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — styling & components
- [Recharts](https://recharts.org/) — charts · [Sonner](https://sonner.emilkowal.ski/) — toasts
- [zod](https://zod.dev/) — API input validation

## 📂 Project Structure

```
src/
├── app/
│   ├── (app)/               # Authenticated shell (navbar + sidebar + mobile nav)
│   │   ├── dashboard/
│   │   ├── transaction/
│   │   └── manage/
│   ├── (marketing)/auth/    # Public sign-in page
│   ├── api/                 # Route handlers (all Clerk-checked, zod-validated)
│   ├── layout.tsx           # Providers, metadata, toaster
│   └── globals.css          # Design tokens (light/dark), utilities
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── transactions/        # List, edit dialog, heatmap
│   └── ...                  # Navbar, Sidebar, MobileNav, etc.
├── lib/                     # types + zod schemas, auth helper, formatting utils
└── data/                    # Default categories
convex/                      # Backend functions & schema
```

## ⚙️ Setup

```bash
npm install

# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

npx convex dev    # push schema + functions
npm run dev
```

## 📜 Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx convex dev` | Sync Convex functions |

---

Happy tracking! 💸
