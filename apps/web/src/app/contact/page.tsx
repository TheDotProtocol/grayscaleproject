import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/os-v1/contact-form";
import { MarketingShell } from "@/components/landing/os-v1/marketing-shell";

export const metadata: Metadata = {
  title: "Contact — Grayscale OS",
  description: "Get in touch with Project Grayscale for platform inquiries, enterprise sales, and billing.",
};

export default function ContactPage() {
  return (
    <MarketingShell
      title="Contact Us"
      subtitle="Whether you're exploring Grayscale OS for your organization or need account support — we're here to help."
    >
      <ContactForm />
    </MarketingShell>
  );
}
