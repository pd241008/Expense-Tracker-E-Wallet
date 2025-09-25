"use client";

import { useUser, SignInButton, useClerk } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return <p className="text-center text-white">Loading...</p>;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-white">
              {isSignedIn
                ? `Welcome, ${user?.firstName || "User"}!`
                : "Welcome to Expense Manager"}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              {isSignedIn
                ? "Redirecting you to your dashboard..."
                : "Please sign in to get started."}
            </p>
          </CardHeader>

          {!isSignedIn && (
            <CardContent className="flex flex-col items-center gap-4">
              <SignInButton mode="modal">
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition">
                  Sign In
                </Button>
              </SignInButton>
            </CardContent>
          )}

          {isSignedIn && (
            <CardFooter className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-xl border-white/20 text-grey hover:bg-biege/300"
                onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
