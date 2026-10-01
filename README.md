# 💰 Expense Manager

A modern, secure, and responsive expense management web application built with **Next.js 14 (App Router)**, **Convex** for backend and database, and **Clerk** for authentication. This app empowers users to track, categorize, and manage their daily transactions with an intuitive and visually appealing interface.

---

## ✨ Features

- **🔐 Secure Authentication**: Seamless and secure sign-in/sign-up with Clerk.
- **🗂️ Category Management**: Create, edit, and manage expense categories effortlessly.
- **💵 Transaction Tracking**: Add, edit, delete, and view transactions with ease.
- **📊 Yearly Expense History**: Visualize and analyze expenses year-by-year.
- **⚡ Serverless Backend**: Powered by Convex for real-time database and serverless functions.
- **🎨 Modern UI**: Built with Tailwind CSS, shadcn/ui, and Framer Motion for smooth animations.
- **🌙 Dark Mode Support**: Toggle between light and dark themes for a comfortable user experience.
- **📱 Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)**: React framework with App Router for optimized routing and API routes.
- **[Convex](https://convex.dev/)**: Serverless backend, database, and real-time API functions.
- **[Clerk](https://clerk.com/)**: Authentication and user management with a secure and customizable interface.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid and responsive styling.
- **[shadcn/ui](https://ui.shadcn.com/)**: Accessible and customizable UI components.
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth and engaging animations for a polished user experience.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transactions/route.ts        # API for transaction CRUD operations
│   │   ├── categories/route.ts          # API for category management
│   │   └── yearhistory/route.ts         # API for yearly expense history
│   ├── dashboard/                       # Main dashboard pages
│   └── auth/page.tsx                    # Authentication page
├── components/                          # Reusable UI components
├── lib/
│   └── convexClient.ts                  # Convex client configuration
└── convex/                              # Convex backend functions and schema
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Convex CLI**: For managing the Convex backend
- **Clerk Account**: For authentication setup
- **Vercel Account**: For deployment (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Convex
Install the Convex CLI globally:
```bash
npm install -g convex
```

Initialize Convex in your project:
```bash
npx convex dev
```

Deploy Convex functions after making changes:
```bash
npx convex deploy
```

### 4. Set Up Clerk
1. Create a project in the [Clerk Dashboard](https://clerk.com/).
2. Obtain your **Frontend API Key** and **Secret Key**.
3. Create a `.env.local` file in the project root and add the following:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 5. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 6. Deploy to Vercel
Deploy your app effortlessly with Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/expense-manager)

---

## 📸 Screenshots & Demo

### 🔐 Authentication
![Clerk Authentication](https://via.placeholder.com/800x400?text=Clerk+Authentication+Modal)  
Secure login and sign-up powered by Clerk.

### 📊 Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Expense+Manager+Dashboard)  
Track and manage categories, transactions, and yearly history in one place.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository**: Click the "Fork" button on GitHub.
2. **Create a Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Commit Changes**: `git commit -m "Add your feature description"`
4. **Push to Your Fork**: `git push origin feature/your-feature-name`
5. **Submit a Pull Request**: Open a pull request with a clear description of your changes.

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

Happy expense tracking! 💸


## 🎯 Project Roadmap
- [x] **Phase 1**: Full-Stack Monolith Scaffolding (Next.js).
- [x] **Phase 2**: Database Layer Setup (Convex).
- [ ] **Phase 3**: Core Logic Implementation.
- [ ] **Phase 4**: UI Polish & Release.
