export default function ContactSection() {
  const links = [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'CV', href: '/CV_Douaa_Amani.pdf', download: true },
  ];

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
      <div
        className="mx-auto max-w-3xl rounded-2xl border p-8 shadow-sm"
        style={{
          borderColor: 'var(--color-primary)',
          backgroundColor: 'var(--color-surface-alt)',
        }}
      >
        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          Let&apos;s build something.
        </h2>
        <p
          className="mt-3 text-base"
          style={{ color: 'rgba(23, 27, 30, 0.8)' }}
        >
          Have a project, opportunity, or idea you&apos;d like to discuss?
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              download={link.download ? 'CV_Douaa_Amani.pdf' : undefined}
              className="inline-flex items-center justify-center rounded-full border px-4 py-2 transition-colors hover:opacity-90"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'transparent',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}