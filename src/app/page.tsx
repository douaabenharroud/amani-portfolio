import Navbar from "@/components/navbar";

const sections = [
  { id: "projects", title: "Projects", description: "A selection of my work." },
  { id: "skills", title: "Skills & Tools", description: "Technologies and tools I use." },
  { id: "about", title: "About Me", description: "A short introduction about me." },
  { id: "contact", title: "Contact Me", description: "Let’s connect." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-dark-text)]">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8">
        <section
          id="home"
          className="rounded-[2rem] border border-[color:var(--color-highlight)] bg-[color:var(--color-surface)] p-8 shadow-sm lg:p-12"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-[color:var(--color-highlight)] px-3 py-1 text-sm font-medium text-[color:var(--color-primary)]">
                Creative developer & designer
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
                Hello, I&apos;m <span className="text-[color:var(--color-primary)]">Douaa Amani Benharroud</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-[color:var(--color-dark-text)]/80">
                I build polished web experiences with thoughtful visuals, strong structure, and a calm, modern feel.
              </p>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-highlight)] bg-[color:var(--color-background)] p-5">
              <p className="text-sm font-medium text-[color:var(--color-primary)]">Current focus</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[color:var(--color-primary)] px-3 py-1 text-sm text-[color:var(--color-surface)]">
                  UI Design
                </span>
                <span className="rounded-full bg-[color:var(--color-accent-gold)] px-3 py-1 text-sm text-[color:var(--color-dark-text)]">
                  Frontend
                </span>
                <span className="rounded-full bg-[color:var(--color-secondary)] px-3 py-1 text-sm text-[color:var(--color-surface)]">
                  Next.js
                </span>
              </div>
            </div>
          </div>
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="rounded-2xl border border-[color:var(--color-highlight)] bg-[color:var(--color-surface)] p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-[color:var(--color-primary)]">
              {section.title}
            </h2>
            <p className="mt-3 text-[color:var(--color-dark-text)]/80">
              {section.description}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
