"use client";

import ContactClient from "@/app/(main)/contact/ContactClient";

export default function Contact() {
  return (
    <section id="contact-us" className="w-full">
      <ContactClient isSection={true} />
    </section>
  );
}
