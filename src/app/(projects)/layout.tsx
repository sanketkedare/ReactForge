import ProjectPageWrapper from "@/components/Home/ProjectPageWrapper";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectPageWrapper>{children}</ProjectPageWrapper>;
}
