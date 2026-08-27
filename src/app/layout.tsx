import type { Metadata, Viewport } from "next";
import "./globals.css";
import TheamContextComponent from "@/context/TheamContextComponent";
import ProfilerProvider from "@/context/ProfilerContext";

export const viewport: Viewport = {
  themeColor: "#07090e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://reactforge.sanketkedare.com"),
  title: {
    default: "ReactForge — 100 Hands-On React Machine Coding Challenges",
    template: "%s | ReactForge",
  },
  description:
    "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers architected by Sanket Kedare.",
  keywords: [
    "React 19",
    "React Machine Coding",
    "Frontend System Design",
    "Machine Coding Interview",
    "SDE-1 Frontend Interview",
    "SDE-2 Frontend Interview",
    "SDE-3 Frontend Interview",
    "React Coding Challenges",
    "JavaScript Interview Practice",
    "React Tasks",
    "Frontend Practice Lab",
    "Sanket Kedare",
    "ReactForge",
    "DOM Reconciliation",
    "Virtual DOM",
    "State Management",
  ],
  authors: [{ name: "Sanket Kedare", url: "https://www.sanketkedare.com" }],
  creator: "Sanket Kedare",
  publisher: "ReactForge by Sanket Kedare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://reactforge.sanketkedare.com",
    languages: {
      "en-US": "https://reactforge.sanketkedare.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reactforge.sanketkedare.com",
    siteName: "ReactForge",
    title: "ReactForge — 100 Hands-On React Machine Coding Challenges",
    description:
      "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers architected by Sanket Kedare.",
    images: [
      {
        url: "/ReactForge.png",
        width: 1200,
        height: 630,
        alt: "ReactForge — 100 React Machine Coding Challenges",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReactForge — 100 Hands-On React Machine Coding Challenges",
    description:
      "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers.",
    images: ["/ReactForge.png"],
    creator: "@sanketkedare",
  },
  icons: {
    icon: [
      { url: "/ReactForge_Icon.png", href: "/ReactForge_Icon.png" },
    ],
    shortcut: ["/ReactForge_Icon.png"],
    apple: [
      { url: "/ReactForge_Icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://reactforge.sanketkedare.com/#website",
      url: "https://reactforge.sanketkedare.com",
      name: "ReactForge",
      description:
        "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers.",
      publisher: {
        "@type": "Person",
        name: "Sanket Kedare",
        url: "https://www.sanketkedare.com",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "ReactForge Machine Coding Hub",
      operatingSystem: "Web",
      applicationCategory: "DeveloperApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Person",
        name: "Sanket Kedare",
        url: "https://www.sanketkedare.com",
      },
    },
    {
      "@type": "EducationalOrganization",
      name: "ReactForge",
      url: "https://reactforge.sanketkedare.com",
      logo: "https://reactforge.sanketkedare.com/ReactForge.png",
      image: "https://reactforge.sanketkedare.com/ReactForge.png",
      founder: {
        "@type": "Person",
        name: "Sanket Kedare",
        url: "https://www.sanketkedare.com",
      },
      sameAs: [
        "https://github.com/sanketkedare/ReactForge",
        "https://www.sanketkedare.com",
        "https://www.linkedin.com/in/sanket-kedare-dev/",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ReactForge_Icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ReactForge_Icon.png" />
        <meta name="google-site-verification" content="T1u_nXL_NYU10GBforx9J6UgKzujcbZvRxlotkZWtJ8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
