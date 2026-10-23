"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({ full_name: fullName, email, password });
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check the details and try again.");
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
        <h2 className="text-2xl font-bold text-navy tracking-tight">Create your student profile</h2>
        <p className="mt-1 text-xs text-muted">Begin your evidence-based skill development journey</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Nimna Silva"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">University Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Create Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Onboarding
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in instead
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
