"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Activity, Loader2 } from "lucide-react";

export default function AuthPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle ambient background glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 px-4">
        <Card className="border-border bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Expense Manager
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Securely sign in to manage your finances
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <SignInButton mode="modal">
              <Button
                className="w-full h-11 text-md font-medium transition-all"
                variant="default">
                Sign In to Continue
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
