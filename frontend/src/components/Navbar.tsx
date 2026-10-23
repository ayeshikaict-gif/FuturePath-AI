"use client";

import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-navy">FuturePath</span>
            <span className="text-lg font-light text-primary ml-0.5">AI</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <Link href="#features" className="hover:text-navy transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-navy transition-colors">
            How It Works
          </Link>
          <Link href="#opportunities" className="hover:text-navy transition-colors">
            Opportunities
          </Link>
          <Link href="#evidence" className="hover:text-navy transition-colors">
            Skill Evidence
          </Link>
          <Link href="#faq" className="hover:text-navy transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
