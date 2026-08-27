import { MetadataRoute } from "next";
import { LEARNING_PROJECTS } from "@/data/learningProjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reactforge.sanketkedare.com";
  const now = new Date();

  // Root & Primary Index Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tasks`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Map each of the 100 Learning Projects dynamically
  const projectRoutes: MetadataRoute.Sitemap = LEARNING_PROJECTS.map((project) => {
    // Determine canonical path (e.g. /image_slider or /projects/image_slider)
    const routePath = project.path.startsWith("/") ? project.path : `/${project.path}`;

    // Priority based on difficulty track
    const priority =
      project.level === "expert"
        ? 0.85
        : project.level === "intermediate"
        ? 0.8
        : 0.75;

    return {
      url: `${baseUrl}${routePath}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  return [...staticRoutes, ...projectRoutes];
}
