"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Replace these with your real details before deploying               */
/* ------------------------------------------------------------------ */
const CONTACT = {
  email: "douaa@example.com", // ← replace
  linkedin: "https://www.linkedin.com/in/your-handle", // ← replace
  github: "https://github.com/your-handle", // ← replace
  formspreeId: "YOUR_FORMSPREE_ID", // ← replace (e.g. "xpzgkqwe")
};

/* ------------------------------------------------------------------ */
/* Floating dots                                                       */
/* ------------------------------------------------------------------ */
function FloatingDots({ isMobile }) {
  const dots = Array.from({ length: isMobile ? 8 : 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isMobile ? 2.5 : 4) + 1,
    duration: Math.random() * 18 + 14,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.2 + 0.05,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {dots.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: "var(--color-accent)",
            opacity: d.opacity,
          }}
          animate={{
            y: [0, -20, 0, 14, 0],
            x: [0, 10, -8, 4, 0],
            opacity: [
              d.opacity,
              d.opacity * 1.8,
              d.opacity,
              d.opacity * 1.4,
              d.opacity,
            ],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Arch glow — same as inside the exhibition arch                      */
/* ------------------------------------------------------------------ */
function ArchGlow({ isMobile }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: isMobile ? "140vw" : "110vw",
        height: isMobile ? "60vh" : "70vh",
        background:
          "radial-gradient(ellipse at bottom center, var(--color-accent-soft) 0%, color-mix(in srgb, var(--color-secondary) 8%, transparent) 30%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
      animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.04, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Subtle top edge line                                                */
/* ------------------------------------------------------------------ */
function TopArchLine() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(60%, 720px)",
        height: "1px",
        background:
          "linear-gradient(to right, transparent, var(--color-accent), transparent)",
        opacity: 0.25,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Ornate frame around the short statement                             */
/* ------------------------------------------------------------------ */
function OrnateFrame({ children }) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "20px 32px",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid var(--color-accent)",
          opacity: 0.35,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "6px",
          border: "1px solid var(--color-secondary)",
          opacity: 0.2,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />
      {[
        { top: -4, left: -4, rotate: 0 },
        { top: -4, right: -4, rotate: 90 },
        { bottom: -4, right: -4, rotate: 180 },
        { bottom: -4, left: -4, rotate: 270 },
      ].map((pos, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          style={{
            position: "absolute",
            ...pos,
            transform: `rotate(${pos.rotate}deg)`,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        >
          <path
            d="M 0 8 L 0 0 L 8 0"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle
            cx="3"
            cy="3"
            r="1.2"
            fill="var(--color-secondary)"
            opacity="0.6"
          />
        </svg>
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Contact Section                                                */
/* ------------------------------------------------------------------ */
export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Swap this for your own endpoint if you're not using Formspree.
      const res = await fetch(
        `https://formspree.io/f/${CONTACT.formspreeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 14px",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    color: "var(--color-text)",
    background: "var(--color-surface)",
    border: `1px solid ${
      focused === field ? "var(--color-accent)" : "var(--color-border)"
    }`,
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow:
      focused === field ? "0 0 0 3px var(--color-accent-soft)" : "none",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--color-text-secondary)",
    marginBottom: "6px",
    opacity: 0.75,
  };

  return (
    <section
      id="contact"
      className="relative w-full"
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "var(--color-surface-alt)",
        overflow: "hidden",
        padding: isMobile ? "72px 20px" : "96px 48px",
      }}
    >
      <ArchGlow isMobile={isMobile} />
      <FloatingDots isMobile={isMobile} />
      <TopArchLine />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Museum-style label + heading — centered above both columns */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-secondary)",
              marginBottom: "14px",
            }}
          >
            Final Exhibition · Contact
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: isMobile
                ? "clamp(1.75rem, 6vw, 2.4rem)"
                : "clamp(2.25rem, 4vw, 3.25rem)",
              fontWeight: 600,
              color: "var(--color-text)",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Let&apos;s Build Something
          </motion.h2>
        </div>

        {/* Two-column layout: info (left) + form (right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1.05fr)",
            gap: isMobile ? "40px" : "72px",
            alignItems: "start",
          }}
        >
          {/* ------------------- LEFT: info ------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              textAlign: isMobile ? "center" : "left",
              alignItems: isMobile ? "center" : "flex-start",
            }}
          >
            {/* Ornate framed statement */}
            <div style={{ maxWidth: "460px", width: "100%" }}>
              <OrnateFrame>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.05rem",
                    fontStyle: "italic",
                    color: "var(--color-text)",
                    lineHeight: 1.6,
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Every project starts with a conversation.
                </p>
              </OrnateFrame>
            </div>

            {/* Availability line — replaces the redundant paragraph */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--color-text)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "380px",
                opacity: 0.85,
              }}
            >
              Available for freelance projects, collaborations, and
              professional opportunities.
            </p>

            {/* Direct contact block — more prominent than the form */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                alignItems: isMobile ? "center" : "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--color-text-secondary)",
                  opacity: 0.7,
                }}
              >
                Email
              </span>
              <a
                href={`mailto:${CONTACT.email}`}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.15rem, 2.4vw, 1.45rem)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--color-accent)",
                  paddingBottom: "3px",
                  transition: "color 0.25s ease, border-color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                  e.currentTarget.style.borderBottomColor =
                    "var(--color-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                  e.currentTarget.style.borderBottomColor =
                    "var(--color-accent)";
                }}
              >
                {CONTACT.email}
              </a>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                }}
              >
                {[
                  { label: "LinkedIn", href: CONTACT.linkedin },
                  { label: "GitHub", href: CONTACT.github },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                      transition: "color 0.25s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-text-secondary)")
                    }
                  >
                    ✦ {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ------------------- RIGHT: form ------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ width: "100%" }}
          >
            {status === "success" ? (
              <div
                style={{
                  padding: "36px 28px",
                  borderRadius: "10px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  Thank you for reaching out.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "var(--color-text-secondary)",
                    marginTop: "10px",
                    marginBottom: 0,
                  }}
                >
                  I&apos;ll get back to you as soon as I can.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  position: "relative",
                  padding: isMobile ? "24px 20px" : "32px 28px",
                  borderRadius: "10px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "0 1px 0 var(--color-accent-soft)",
                }}
              >
                {/* Museum-style tag on the form */}
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--color-secondary)",
                    opacity: 0.7,
                    marginBottom: "4px",
                  }}
                >
                  Inquiry Form · 01
                </span>

                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("name")}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("email")}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle("message"),
                      resize: "vertical",
                      minHeight: "120px",
                    }}
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "var(--color-secondary)",
                      margin: 0,
                    }}
                  >
                    Something went wrong. Please email me directly at{" "}
                    {CONTACT.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    alignSelf: "flex-start",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 26px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "#fff",
                    background: "var(--color-primary)",
                    border: "none",
                    borderRadius: "9999px",
                    cursor: status === "sending" ? "wait" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                    transition:
                      "opacity 0.25s ease, transform 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "sending") {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== "sending") {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: isMobile ? "56px" : "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "var(--color-text)",
            }}
          >
            DOUAA ✦
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-text-secondary)",
              opacity: 0.7,
            }}
          >
            AI · Data · Software
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              opacity: 0.4,
              marginTop: "4px",
            }}
          >
            End of Exhibition
          </span>
        </motion.div>
      </div>
    </section>
  );
}