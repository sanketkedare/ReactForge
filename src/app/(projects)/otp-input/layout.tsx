import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP 6-Digit Verification Box — Junior SDE-1 React Challenge",
  description: "6-digit OTP verification input in React 19 with auto-focus shifting, backspace navigation, and clipboard paste splitting.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/otp-input",
  },
  openGraph: {
    title: "OTP 6-Digit Verification Box — Junior SDE-1 React Challenge | ReactForge",
    description: "6-digit OTP verification input in React 19 with auto-focus shifting, backspace navigation, and clipboard paste splitting.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "OTP 6-Digit Verification Box — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
