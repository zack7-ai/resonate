"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Wand2, FileText, Mic, ArrowRight, Check, Zap, Shield, Target, TrendingUp, Radar, DollarSign } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Logo variant="full" />
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm">
                  Go to Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Know Your True Market Value.
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-success bg-clip-text text-transparent">
                Command Your Career.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              The AI Operating System for Executives. Instant Salary Benchmarking, Job Radar, and Resume Tailoring in one workflow.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="group">
                    Start Scouting (Free)
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </SignedIn>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Visual Placeholder - Dashboard Screenshot */}
            <div className="mt-16 rounded-xl border border-border bg-card p-1 shadow-2xl">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-background to-success/10 p-8">
                <div className="mx-auto max-w-4xl">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="h-32 rounded bg-muted"></div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="h-32 rounded bg-muted"></div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="h-32 rounded bg-muted"></div>
                    </div>
                  </div>
                </div>
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-success/5 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Trusted by candidates at{" "}
            <span className="text-foreground">Google</span>,{" "}
            <span className="text-foreground">Netflix</span>,{" "}
            <span className="text-foreground">Microsoft</span>, and{" "}
            <span className="text-foreground">Amazon</span>
          </p>
        </div>
      </section>

      {/* The Intelligence Engine Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Stop Guessing. Start Negotiating.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our AI scans thousands of active roles to calculate your real market worth. See the gap between your current salary and your potential.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Instant Salary Benchmarking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">AI Fit Gap Analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Real-time Market Value Tracking</span>
                </li>
              </ul>
            </div>

            {/* Visual: Mock Market Value Chart */}
            <div className="relative">
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Market Value Comparison</h3>
                <div className="space-y-4">
                  {/* Bar 1: Your Current */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Current</span>
                      <span className="font-medium text-card-foreground">$85k</span>
                    </div>
                    <div className="h-6 rounded bg-muted">
                      <div className="h-full w-[45%] rounded bg-muted-foreground/40"></div>
                    </div>
                  </div>
                  {/* Bar 2: Market Median */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Median</span>
                      <span className="font-medium text-primary">$120k</span>
                    </div>
                    <div className="h-6 rounded bg-muted">
                      <div className="h-full w-[65%] rounded bg-primary"></div>
                    </div>
                  </div>
                  {/* Bar 3: Top Opportunities */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Top Opportunities</span>
                      <span className="font-medium text-success">$150k</span>
                    </div>
                    <div className="h-6 rounded bg-muted">
                      <div className="h-full w-[80%] rounded bg-success"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-success/20 bg-success/5 p-3">
                  <p className="text-sm font-medium text-success">
                    Potential Uplift: +$65k (76%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Land Your Dream Role
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete career management platform built for executives and high-intent job seekers.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1: AI Auto-Alignment */}
            <div className="group relative rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">AI Auto-Alignment</h3>
              <p className="mt-2 text-muted-foreground">
                One-click resume optimization. Our AI analyzes job descriptions and automatically tailors your resume with the right keywords and impact statements.
              </p>
            </div>

            {/* Feature 2: Executive PDF Engine */}
            <div className="group relative rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Executive PDF Engine</h3>
              <p className="mt-2 text-muted-foreground">
                Harvard/McKinsey standard resume formatting. ATS-compliant PDFs that look professional and pass through applicant tracking systems.
              </p>
            </div>

            {/* Feature 3: Job Radar */}
            <div className="group relative rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Radar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Job Radar</h3>
              <p className="mt-2 text-muted-foreground">
                Outbound Discovery. We find the top 15 roles that match your DNA. AI-powered recommendations with fit explanations and salary insights.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground">Resume Audit</h4>
                <p className="mt-1 text-sm text-muted-foreground">Deep analysis of impact, clarity, and completeness</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <Target className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground">Match Score</h4>
                <p className="mt-1 text-sm text-muted-foreground">Real-time compatibility scoring with job descriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <Mic className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground">Interview Simulator</h4>
                <p className="mt-1 text-sm text-muted-foreground">AI-powered practice with instant feedback</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <TrendingUp className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground">Application Tracking</h4>
                <p className="mt-1 text-sm text-muted-foreground">Monitor your entire job search pipeline in one place</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-y border-border bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Import LinkedIn PDF</h3>
                  <p className="mt-2 text-muted-foreground">
                    Upload your existing resume or LinkedIn PDF export. Our AI instantly parses and structures your experience.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Paste Job Description</h3>
                  <p className="mt-2 text-muted-foreground">
                    Copy the job posting URL or description. Our system analyzes keywords and requirements automatically.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Auto-Align & Apply</h3>
                  <p className="mt-2 text-muted-foreground">
                    Click &quot;Auto-Align&quot; to optimize your resume. Download the tailored PDF and submit with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your career search needs
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* Free Tier */}
            <div className="rounded-xl border-2 border-border bg-card p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-card-foreground">Scout</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold tracking-tight text-card-foreground">$0</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Perfect for getting started</p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Manual application tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Basic resume builder</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">PDF export with watermark</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Dashboard analytics</span>
                </li>
              </ul>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="mt-8 w-full" variant="outline">
                    Get Started Free
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="mt-8 w-full" variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Pro Tier */}
            <div className="relative rounded-xl border-2 border-primary bg-card p-8 shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-card-foreground">Executive</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold tracking-tight text-card-foreground">$20</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">For serious job seekers</p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Everything in Scout</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">AI Auto-Alignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Smart PDF import (LinkedIn)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Unlimited resume scans</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Interview Simulator</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Executive PDF export (no watermark)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Cover letter generator</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">90-day plan & resignation protocol</span>
                </li>
              </ul>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="mt-8 w-full">
                    Upgrade to Executive
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "/dashboard/settings"}>
                  <Button className="mt-8 w-full">
                    Upgrade to Executive
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <Logo variant="full" />
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                The career operating system for executives and high-intent job seekers. Command your career search.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Resonate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
