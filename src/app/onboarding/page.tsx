"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import StudioNav from "@/components/studio/StudioNav";
import GlobalFooter from "@/components/common/GlobalFooter";
import RegistrationOnboardingModal from "@/components/auth/RegistrationOnboardingModal";

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, mongoUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && mongoUser?.isRegistrationComplete) {
      router.push("/profile");
    }
  }, [isAuthenticated, mongoUser, loading, router]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      <StudioNav />

      <main className="flex-1 flex items-center justify-center p-6">
        <RegistrationOnboardingModal />
      </main>

      <GlobalFooter />
    </div>
  );
}
