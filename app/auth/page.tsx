"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // go to dashboard after login
    }
  }, [isSignedIn, router]);

  if (!isLoaded) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Stars/noise background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-white">Expense Manager</h1>
            <p className="text-gray-300 text-sm mt-1">Sign in to get started</p>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <SignInButton mode="modal">
              <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition">
                Sign In
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
