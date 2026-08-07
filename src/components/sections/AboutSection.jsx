export default function AboutSection() {
  return (
    <section
      id="about"
      className="rounded-2xl border border-[color:var(--color-success)] bg-[color:var(--color-surface)] p-8 shadow-sm"
    >
      <h2 className="text-2xl font-semibold text-[color:var(--color-success)]">
        About Me
      </h2>
      <p className="mt-3 text-[color:var(--color-dark-text)]/80">
        A short introduction about me.
      </p>
    </section>
  );
}