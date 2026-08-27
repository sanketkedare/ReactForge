import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARNING_PROJECTS, LearningProject } from "@/data/learningProjects";
import DynamicTaskClient from "@/components/studio/DynamicTaskClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LEARNING_PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const project = LEARNING_PROJECTS.find(
    (p) => p.id === slug || p.path === `/${slug}`
  );

  if (!project) {
    return {
      title: "Task Not Found | ReactForge",
      description: "The requested machine coding challenge could not be found.",
    };
  }

  const trackLabel =
    project.level === "beginner"
      ? "Junior SDE-1"
      : project.level === "intermediate"
      ? "Mid-Level SDE-2"
      : "Senior & System Design SDE-3";

  const canonicalUrl = `https://reactforge.sanketkedare.com${
    project.path.startsWith("/") ? project.path : `/${project.path}`
  }`;

  const title = `${project.title} — ${trackLabel} React Machine Coding Challenge`;
  const description = `${project.description} Architected with React 19, TypeScript, and modern state patterns. Estimated time: ${project.estimatedMinutes} mins. Key skills: ${project.skills.join(", ")}.`;

  return {
    title,
    description,
    keywords: [
      project.title,
      ...project.skills,
      trackLabel,
      "React Machine Coding",
      "Frontend Interview Question",
      "React 19 Practice",
      "Sanket Kedare",
      "ReactForge",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ReactForge`,
      description,
      url: canonicalUrl,
      type: "article",
      authors: ["https://www.sanketkedare.com"],
      images: [
        {
          url: "/ReactForge.png",
          width: 1200,
          height: 630,
          alt: `${project.title} — React Machine Coding Challenge`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ReactForge`,
      description,
      images: ["/ReactForge.png"],
      creator: "@sanketkedare",
    },
  };
}

export default async function DynamicTaskPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const project: LearningProject | undefined = LEARNING_PROJECTS.find(
    (p) => p.id === slug || p.path === `/${slug}`
  );

  if (!project) {
    notFound();
  }

  const canonicalUrl = `https://reactforge.sanketkedare.com${
    project.path.startsWith("/") ? project.path : `/${project.path}`
  }`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${project.title} — React Machine Coding Challenge`,
    description: project.description,
    image: "https://reactforge.sanketkedare.com/ReactForge.png",
    url: canonicalUrl,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: "Sanket Kedare",
      url: "https://www.sanketkedare.com",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "ReactForge",
      url: "https://reactforge.sanketkedare.com",
      logo: "https://reactforge.sanketkedare.com/ReactForge.png",
    },
    proficiencyLevel: project.levelLabel,
    timeRequired: `PT${project.estimatedMinutes}M`,
    keywords: project.skills.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://reactforge.sanketkedare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tasks Curriculum",
        item: "https://reactforge.sanketkedare.com/tasks",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DynamicTaskClient slug={slug} />
    </>
  );
}
