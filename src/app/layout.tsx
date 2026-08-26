import type { Metadata } from "next";
import "./globals.css";
import TheamContextComponent from "@/context/TheamContextComponent";
import ProfilerProvider from "@/context/ProfilerContext";

export const metadata: Metadata = {
  title: "ReactForge — 100 Hands-On React Machine Coding Challenges",
  description:
    "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers.",
  icons: {
    icon: "/react.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="T1u_nXL_NYU10GBforx9J6UgKzujcbZvRxlotkZWtJ8" />
      </head>
      <body suppressHydrationWarning className="bg-[#07090e] text-slate-100 antialiased">
        <TheamContextComponent>
          <ProfilerProvider>
            {children}
          </ProfilerProvider>
        </TheamContextComponent>
      </body>
    </html>
  );
}
