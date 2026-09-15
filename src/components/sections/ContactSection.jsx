export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full px-4 sm:px-6 lg:px-8 py-16"
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-[color:var(--color-primary)] bg-[color:var(--color-surface-alt)] p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[color:var(--color-primary)]">
          Contact Me
        </h2>
        <p className="mt-3 text-[color:var(--color-dark-text)]/80">
          Let&apos;s connect.
        </p>
      </div>
    </section>
  );
}