"use client";

import { useUser, SignInButton, useClerk } from "@clerk/nextjs";
// Using polished shadcn/ui components
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
      // Redirect to the dashboard if signed in
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return <p className="text-center text-gray-400">Loading...</p>; // Updated text color for dark theme

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Dynamic Background Texture/Effect for depth */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm relative z-20 p-4">
        {" "}
        {/* Reduced max-width slightly for focus */}
        {/* Polished Card with Gradient Border Effect */}
        <div className="p-px rounded-2xl bg-gradient-to-br from-indigo-500/50 to-purple-500/50 shadow-2xl">
          <Card className="shadow-2xl rounded-2xl border-none bg-gray-900/90 backdrop-blur-md">
            <CardHeader className="text-center p-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {isSignedIn
                  ? `Welcome back, ${user?.firstName || "User"}! 👋`
                  : "Expense Manager"}
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {isSignedIn
                  ? "Redirecting you to your financial hub..."
                  : "Track, analyze, and master your spending. Sign in to start."}
              </p>
            </CardHeader>

            {!isSignedIn && (
              <CardContent className="flex flex-col items-center p-8 pt-0">
                <SignInButton mode="modal">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-lg text-white font-semibold shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                    Sign In Securely
                  </Button>
                </SignInButton>
              </CardContent>
            )}

            {isSignedIn && (
              <CardFooter className="flex justify-center p-6 pt-0">
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-300"
                  onClick={handleSignOut}>
                  Sign Out
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
// Note: You would need to define the 'animate-blob' and 'animation-delay-4000' in your global CSS or tailwind.config.js for the background effect.
