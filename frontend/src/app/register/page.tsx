"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  AlertCircle,
  ArrowRight,
  User,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = identifier.trim();
    if (!trimmed) {
      setError("Please enter a username or email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter identical passwords.");
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = trimmed.includes("@");
      await register({
        email: isEmail ? trimmed : `${trimmed}@futurepath.edu`,
        username: isEmail ? trimmed.split("@")[0] : trimmed,
        password,
        full_name: isEmail ? trimmed.split("@")[0] : trimmed,
      });

      showToast("Account created successfully! Welcome to FuturePath AI.", "success");
      // Direct immediately to student profile setup
      router.push("/onboarding");
    } catch (err: any) {
      const msg = err.message || "Failed to create account. Please try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-navy">FuturePath</span>
          <span className="text-xl font-light text-primary">AI</span>
        </Link>
        <h2 className="text-2xl font-bold text-navy tracking-tight">Create Your Student Account</h2>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          Sign up with your username or email and password. In the next step, you will customize your academic profile.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sgsayeshika@gmail.com or ayeshika"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-muted mt-1">
                You can use this username/email anytime to sign in.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full shadow-sm"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Continue
              </Button>
            </div>
          </form>

          {/* Quick Perks / Next Step Info */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] font-semibold text-navy uppercase tracking-wider mb-2">
              Next: Customize Your Career Engine
            </p>
            <div className="space-y-1.5 text-xs text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                <span>Fill in your University, Degree, and Academic Year</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                <span>Select your Target Career & baseline skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                <span>Automatically generates your custom Roadmap & Digital Twin</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
