"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthPage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard")
    }
  }, [isSignedIn, router])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dotted px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[360px] max-w-2xl rounded-full bg-primary/15 blur-[130px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Welcome to Spendly
            </CardTitle>
            <CardDescription>
              Sign in to track your expenses and income.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isLoaded ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : isSignedIn ? (
              <Button
                className="w-full"
                onClick={() => router.replace("/dashboard")}
              >
                Continue to dashboard
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full">Sign in to continue</Button>
              </SignInButton>
            )}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secured by Clerk. We never see your password.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
