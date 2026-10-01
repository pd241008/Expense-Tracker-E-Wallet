"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useUser, SignInButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/Navbar"

const FEATURES = [
  {
    title: "Effortless tracking",
    body: "Record income and expenses in seconds with a form that stays out of your way.",
  },
  {
    title: "Categories that make sense",
    body: "Start with sensible defaults, then shape them to match how you actually spend.",
  },
  {
    title: "A year at a glance",
    body: "Activity heatmap, yearly totals, and breakdowns that turn raw entries into answers.",
  },
]

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-dotted">
      <React.Suspense fallback={<Skeleton className="h-14 w-full rounded-none" />}>
        <Navbar />
      </React.Suspense>

      <main className="relative flex flex-1 items-center justify-center px-4 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-3xl rounded-full bg-primary/15 blur-[140px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Free · Private · No spreadsheets
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Know where your{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              money goes
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Spendly is a fast, private expense tracker. Log transactions,
            organize categories, and see your whole year on one screen.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DashboardButton />
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card p-4 text-left">
                <dt className="text-sm font-semibold">{f.title}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {f.body}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Spendly — personal finance, minus the clutter.
      </footer>
    </div>
  )
}

function DashboardButton() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return <Skeleton className="h-10 w-40 rounded-md" />
  }

  if (isSignedIn) {
    return (
      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => router.push("/dashboard")}
      >
        Open dashboard
      </Button>
    )
  }

  return (
    <SignInButton mode="modal">
      <Button size="lg" className="w-full sm:w-auto">
        Get started — it&apos;s free
      </Button>
    </SignInButton>
  )
}
