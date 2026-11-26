import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectAnimation } from "@/components/project-animation";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { projects, getProject } from "@/content/projects";
import { ProjectSpecs } from "@/components/project-specs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = getProject(resolvedParams.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to projects
          </Link>

          <header className="mb-16">
            <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground text-balance mb-6">
              {project.title}
            </h1>
            <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-3xl mb-10">
              {project.shortDescription}
            </p>
            <div className="max-w-md">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground mb-2">Specification</p>
              <ProjectSpecs project={project} maxStack={project.tags.length} wrap className="border-t border-white/[0.07]" />
            </div>
          </header>

          {(project.link || project.github) && (
            <div className="flex flex-wrap gap-4 mb-12">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full font-sans text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full font-sans text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>
          )}

          {project.animation && (
            <ProjectAnimation animation={project.animation} className="mb-10 rounded-2xl border border-border" />
          )}

          <div className="prose prose-neutral max-w-none font-sans text-lg text-muted-foreground leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          </div>

          <footer className="mt-16 pt-12 border-t border-border">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all projects
            </Link>
          </footer>
        </div>
      </section>
    </article>
  );
}