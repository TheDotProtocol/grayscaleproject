"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONTACT } from "./content";
import { LuxuryCard, PrimaryButton } from "./primitives";

type ContactTopic = (typeof CONTACT.emails)[number];

export function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState<ContactTopic>(CONTACT.emails[0]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectTopic = (item: ContactTopic) => {
    setTopic(item);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Email routing will be wired to backend later — show success for now
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  if (submitted) {
    return (
      <LuxuryCard className="mx-auto max-w-2xl p-10 text-center">
        <p className="text-lg font-medium text-white">Thank you for reaching out.</p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          We have received your message and will get back to you shortly.
        </p>
      </LuxuryCard>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACT.emails.map((item) => (
          <button
            key={item.address}
            type="button"
            onClick={() => selectTopic(item)}
            className={`landing-card landing-card-hover p-5 text-left transition ${
              topic.address === item.address ? "border-primary/30 ring-1 ring-primary/20" : ""
            }`}
          >
            <h2 className="text-sm font-medium text-white">{item.label}</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/45">{item.desc}</p>
            <p className="mt-3 text-xs font-medium link-accent">{item.address}</p>
          </button>
        ))}
      </div>

      <div ref={formRef}>
        <LuxuryCard className="p-8 md:p-10">
        <p className="landing-eyebrow mb-2">Send a message</p>
        <h2 className="text-lg font-medium text-white">{topic.label}</h2>
        <p className="mt-1 text-xs text-white/40">Routing to {topic.address}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="contact-name" required>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="landing-field"
              />
            </Field>
            <Field label="Email" id="contact-email" required>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="landing-field"
              />
            </Field>
          </div>

          <Field label="Phone number" id="contact-phone">
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className="landing-field"
            />
          </Field>

          <Field label="Message" id="contact-message" required>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder="How can we help?"
              className="landing-field landing-textarea min-h-[120px] resize-y"
            />
          </Field>

          <input type="hidden" name="topic" value={topic.label} />
          <input type="hidden" name="recipient" value={topic.address} />

          <PrimaryButton type="submit" className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send message"}
          </PrimaryButton>
        </form>
        </LuxuryCard>
      </div>

      <LuxuryCard className="p-8 text-center">
        <p className="text-sm text-white/55">{CONTACT.company}</p>
        <p className="mt-1 text-xs text-white/35">{CONTACT.parent}</p>
      </LuxuryCard>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium tracking-wide text-white/55 uppercase">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  );
}
