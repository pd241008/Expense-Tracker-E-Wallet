import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar"; // Added Sidebar import
import { ThemeProvider } from "@/components/ThemeProvider"; // Added ThemeProvider
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Wallet Expense Manger",
  description: "Next.js based Expense Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html
        lang="en"
        suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
          {/* Defaulting to dark theme for that premium sleek look */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}>
            <ConvexClientProvider>
              {/* 1. Navbar stays fixed at the top */}
              <Navbar />

              {/* 2. Main app layout below the Navbar */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar on the left (hidden on mobile via standard Tailwind classes in the component) */}
                <Sidebar />

                {/* Scrollable main content area */}
                <main className="flex-1 overflow-y-auto bg-background/50">
                  {/* Optional: Add a max-width container here if you don't want ultra-wide screens to stretch the content too much */}
                  <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>
              </div>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
