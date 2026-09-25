"use client";

import QuoteClient from "@/app/(main)/get-free-quote/QuoteClient";

export default function GetFreeQuote() {
  return (
    <section id="get-free-quote" className="w-full">
      <QuoteClient showBreadcrumb={false} />
    </section>
  );
}
