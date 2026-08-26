"use client";

import React, { useState } from "react";
import ProjectHeader from "@/components/common/ProjectHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, CreditCard, User, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";

interface FormData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2: Shipping
  address: string;
  city: string;
  zipCode: string;
  country: string;
  // Step 3: Payment
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  plan: "starter" | "pro" | "enterprise";
}

const INITIAL_DATA: FormData = {
  firstName: "Elena",
  lastName: "Rostova",
  email: "elena.rostova@devlab.io",
  phone: "+1 (555) 349-2180",
  address: "742 Evergreen Terrace",
  city: "San Francisco",
  zipCode: "94107",
  country: "United States",
  cardNumber: "4532 8901 2345 6789",
  cardExpiry: "12/28",
  cardCvv: "892",
  plan: "pro",
};

export default function MultiStepFormPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { num: 1, title: "Personal Details", icon: <User className="w-4 h-4" /> },
    { num: 2, title: "Shipping Address", icon: <MapPin className="w-4 h-4" /> },
    { num: 3, title: "Payment Info", icon: <CreditCard className="w-4 h-4" /> },
    { num: 4, title: "Review & Confirm", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <ProjectHeader
        title="Multi-Step Form Wizard"
        description="Build a multi-step checkout workflow with field validation per stage, breadcrumb step navigation, and an immutable state machine."
        level="intermediate"
        category="Forms & Validation"
        skills={["State Machine Step Logic", "Controlled Multi-Page Forms", "Validation Gatekeeping"]}
        estimatedMinutes={40}
        whatYouWillBuild="A 4-step e-commerce checkout form that validates inputs step-by-step and produces an order receipt upon confirmation."
        keyTakeaways={[
          "Managing multi-stage form state within a single unified object",
          "Preventing users from skipping ahead without satisfying field validations",
          "Rendering conditional step components with smooth Framer Motion transitions",
        ]}
      />

      <main className="w-[92%] lg:w-[80%] mx-auto pb-24 space-y-8">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl space-y-8">
          {/* Stepper Breadcrumbs */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 font-bold"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden sm:inline text-[10px] text-slate-400 font-medium line-clamp-1">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleNext} className="space-y-6">
              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white">Step 1: Personal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">First Name</label>
                      <input
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">Last Name</label>
                      <input
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SHIPPING */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white">Step 2: Shipping Destination</h3>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400">Street Address</label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">City</label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">Postal / Zip Code</label>
                      <input
                        required
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => updateField("zipCode", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white">Step 3: Payment Details</h3>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400">Card Number</label>
                    <input
                      required
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => updateField("cardNumber", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">Expiry (MM/YY)</label>
                      <input
                        required
                        type="text"
                        value={formData.cardExpiry}
                        onChange={(e) => updateField("cardExpiry", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">CVV Security Code</label>
                      <input
                        required
                        type="password"
                        maxLength={4}
                        value={formData.cardCvv}
                        onChange={(e) => updateField("cardCvv", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4 text-xs"
                >
                  <h3 className="text-xl font-bold text-white">Step 4: Review Your Order</h3>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="font-semibold text-white">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-300">{formData.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400">Destination:</span>
                      <span className="text-slate-300">
                        {formData.address}, {formData.city} {formData.zipCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment:</span>
                      <span className="font-mono text-amber-300">
                        •••• •••• •••• {formData.cardNumber.slice(-4)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <span>{currentStep === 4 ? "Place Order & Pay" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* ORDER SUCCESS */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">
                  A receipt has been dispatched to{" "}
                  <span className="text-amber-300 font-medium">{formData.email}</span>.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Create Another Order
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
