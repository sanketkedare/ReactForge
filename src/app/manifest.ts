import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReactForge — 100 Hands-On React Machine Coding Challenges",
    short_name: "ReactForge",
    description:
      "Master frontend developer machine coding rounds with ReactForge. 100 practical hands-on tasks, live interactive workbenches, AI coaching, and interview dossiers.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090e",
    theme_color: "#07090e",
    icons: [
      {
        src: "/ReactForge_Icon.png",
        sizes: "192x192 512x512",
        type: "image/png",
      },
    ],
  };
}
