import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drag & Drop File Uploader — Mid-Level SDE-2 React Challenge",
  description: "Multi-file drag and drop uploader in React 19 with progress bars, file type validation, and image previews.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/file-uploader",
  },
  openGraph: {
    title: "Drag & Drop File Uploader — Mid-Level SDE-2 React Challenge | ReactForge",
    description: "Multi-file drag and drop uploader in React 19 with progress bars, file type validation, and image previews.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Drag & Drop File Uploader — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
