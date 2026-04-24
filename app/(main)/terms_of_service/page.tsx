"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Shield,
  CreditCard,
  Copyright,
  AlertTriangle,
  Gavel,
  Globe,
  Mail,
  Calendar,
  ArrowUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

// Custom SVG Icons
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Terms Section Component
const TermsSection = ({
  id,
  title,
  icon: Icon,
  children,
  delay,
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="scroll-mt-24"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 bg-primary rounded-xl text-primary-light shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>

    <div className="pl-0 md:pl-16 text-gray-300 leading-relaxed space-y-4">
      {children}
    </div>
  </motion.section>
);

// Table of Contents Item
const TocItem = ({
  id,
  title,
  icon: Icon,
}: {
  id: string;
  title: string;
  icon: any;
}) => (
  <li>
    <a
      href={`#${id}`}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary-light transition-colors" />
      {title}
    </a>
  </li>
);

export default function TermsConditionsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastUpdated] = useState("January 15, 2025");
  const [effectiveDate] = useState("February 1, 2025");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-125 h-125 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="pt-20 md:pt-28 pb-12 border-b border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary rounded-2xl text-primary-light">
                  <FileText className="w-12 h-12" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                  Terms & Conditions
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
                Please read these terms carefully before using our services. By
                engaging with Country Communication, you agree to be bound by
                these terms and conditions.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Effective Date: {effectiveDate}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Table of Contents - Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 bg-linear-to-br from-gray-900/80 to-black/80 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-light" />
                    Contents
                  </h3>
                  <nav>
                    <ul className="space-y-1">
                      <TocItem
                        id="acceptance"
                        title="Acceptance of Terms"
                        icon={CheckCircle}
                      />
                      <TocItem
                        id="definitions"
                        title="Definitions"
                        icon={FileText}
                      />
                      <TocItem
                        id="services"
                        title="Services Provided"
                        icon={Shield}
                      />
                      <TocItem
                        id="client-obligations"
                        title="Client Obligations"
                        icon={CheckCircle}
                      />
                      <TocItem
                        id="intellectual-property"
                        title="Intellectual Property"
                        icon={Copyright}
                      />
                      <TocItem
                        id="payment"
                        title="Payment Terms"
                        icon={CreditCard}
                      />
                      <TocItem
                        id="cancellation"
                        title="Cancellation & Refunds"
                        icon={XCircle}
                      />
                      <TocItem
                        id="liability"
                        title="Limitation of Liability"
                        icon={AlertTriangle}
                      />
                      <TocItem
                        id="confidentiality"
                        title="Confidentiality"
                        icon={Shield}
                      />
                      <TocItem
                        id="termination"
                        title="Termination"
                        icon={XCircle}
                      />
                      <TocItem
                        id="disputes"
                        title="Dispute Resolution"
                        icon={Gavel}
                      />
                      <TocItem
                        id="governing-law"
                        title="Governing Law"
                        icon={Globe}
                      />
                      <TocItem
                        id="changes"
                        title="Changes to Terms"
                        icon={Calendar}
                      />
                      <TocItem
                        id="contact"
                        title="Contact Information"
                        icon={Mail}
                      />
                    </ul>
                  </nav>
                </div>
              </motion.aside>

              {/* Terms Content */}
              <div className="lg:col-span-3 space-y-16">
                {/* 1. Acceptance of Terms */}
                <TermsSection
                  id="acceptance"
                  title="1. Acceptance of Terms"
                  icon={CheckCircle}
                  delay={0.1}
                >
                  <p>
                    By accessing or using the services of Country Communication
                    ("Company," "we," "us," or "our"), you agree to be bound by
                    these Terms and Conditions ("Terms"). If you do not agree
                    with any part of these terms, you may not use our services.
                  </p>
                  <p>
                    These Terms apply to all clients, visitors, users, and
                    others who access or use our services, including but not
                    limited to exhibition booth design, event management,
                    interior design, and branding services.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                    <p className="text-white text-sm">
                      <span className="font-semibold text-primary-light">
                        Important:
                      </span>{" "}
                      By submitting a project inquiry, signing a contract, or
                      making a payment, you acknowledge that you have read,
                      understood, and agreed to these Terms and Conditions.
                    </p>
                  </div>
                </TermsSection>

                {/* 2. Definitions */}
                <TermsSection
                  id="definitions"
                  title="2. Definitions"
                  icon={FileText}
                  delay={0.15}
                >
                  <div className="space-y-3">
                    {[
                      {
                        term: '"Company"',
                        meaning:
                          "Refers to Country Communication, headquartered in Dhaka, Bangladesh.",
                      },
                      {
                        term: '"Client"',
                        meaning:
                          "Any individual, business, or organization that engages our services.",
                      },
                      {
                        term: '"Services"',
                        meaning:
                          "Exhibition booth design, fabrication, event management, interior design, branding, and related services.",
                      },
                      {
                        term: '"Project"',
                        meaning:
                          "A specific assignment or contract agreed upon between Company and Client.",
                      },
                      {
                        term: '"Deliverables"',
                        meaning:
                          "The final output, including 3D designs, fabricated booths, graphics, and installation services.",
                      },
                      {
                        term: '"Contract"',
                        meaning:
                          "The formal agreement signed by both parties outlining project scope, timeline, and costs.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <span className="text-primary-light font-semibold min-w-fit">
                          {item.term}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {item.meaning}
                        </span>
                      </div>
                    ))}
                  </div>
                </TermsSection>

                {/* 3. Services Provided */}
                <TermsSection
                  id="services"
                  title="3. Services Provided"
                  icon={Shield}
                  delay={0.2}
                >
                  <p>Country Communication provides the following services:</p>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {[
                      "3D Booth Design & Visualization",
                      "Custom Booth Fabrication",
                      "Modular Booth Systems",
                      "Event Management & Logistics",
                      "Interior & Exterior Design",
                      "Graphic Design & Printing",
                      "On-site Installation & Dismantling",
                      "Warehousing & Storage",
                    ].map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-gray-300 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4">
                    The specific scope of services for each project will be
                    detailed in the individual project contract or service
                    agreement signed by both parties.
                  </p>
                </TermsSection>

                {/* 4. Client Obligations */}
                <TermsSection
                  id="client-obligations"
                  title="4. Client Obligations"
                  icon={CheckCircle}
                  delay={0.25}
                >
                  <p>The Client agrees to:</p>

                  <div className="space-y-3 mt-3">
                    {[
                      {
                        title: "Provide Accurate Information",
                        description:
                          "Furnish complete and accurate information necessary for project execution, including brand guidelines, design preferences, and technical requirements.",
                      },
                      {
                        title: "Timely Approvals",
                        description:
                          "Review and approve designs, proposals, and deliverables within agreed timeframes to avoid project delays.",
                      },
                      {
                        title: "Prompt Payment",
                        description:
                          "Make payments according to the payment schedule outlined in the project contract.",
                      },
                      {
                        title: "Event Compliance",
                        description:
                          "Obtain necessary permits, venue approvals, and comply with exhibition organizer rules and regulations.",
                      },
                      {
                        title: "Material Ownership",
                        description:
                          "Ensure that any materials, logos, or content provided to the Company do not infringe on third-party intellectual property rights.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <h4 className="text-white font-semibold mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TermsSection>

                {/* 5. Intellectual Property */}
                <TermsSection
                  id="intellectual-property"
                  title="5. Intellectual Property Rights"
                  icon={Copyright}
                  delay={0.3}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    5.1 Company's IP Rights
                  </h3>
                  <p>
                    All 3D designs, drawings, concepts, and creative work
                    produced by Country Communication remain the intellectual
                    property of the Company until full payment is received. Upon
                    full payment, the Client receives a license to use the final
                    deliverables for the intended purpose.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    5.2 Client's IP Rights
                  </h3>
                  <p>
                    The Client retains all rights to their brand assets, logos,
                    trademarks, and proprietary information provided to the
                    Company for project execution.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    5.3 Portfolio Usage
                  </h3>
                  <p>
                    The Company reserves the right to showcase completed
                    projects in its portfolio, website, social media, and
                    marketing materials unless otherwise agreed in writing with
                    the Client.
                  </p>
                </TermsSection>

                {/* 6. Payment Terms */}
                <TermsSection
                  id="payment"
                  title="6. Payment Terms"
                  icon={CreditCard}
                  delay={0.35}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    6.1 Payment Schedule
                  </h3>
                  <p>
                    Unless otherwise specified in the project contract, our
                    standard payment schedule is:
                  </p>

                  <div className="space-y-2 mt-3">
                    {[
                      {
                        phase: "Initial Deposit",
                        percentage: "50%",
                        timing: "Upon contract signing",
                      },
                      {
                        phase: "Progress Payment",
                        percentage: "30%",
                        timing: "Before on-site installation",
                      },
                      {
                        phase: "Final Payment",
                        percentage: "20%",
                        timing: "Upon project completion",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <div>
                          <span className="text-white text-sm font-medium">
                            {item.phase}
                          </span>
                          <p className="text-gray-500 text-xs">{item.timing}</p>
                        </div>
                        <span className="text-primary-light font-bold text-lg">
                          {item.percentage}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    6.2 Late Payments
                  </h3>
                  <p>
                    Late payments may incur interest charges at 1.5% per month
                    or the maximum rate permitted by law. The Company reserves
                    the right to suspend work until outstanding payments are
                    received.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    6.3 Accepted Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Bank Transfer",
                      "Cash",
                      "Cheque",
                      "Online Payment",
                      "Mobile Banking",
                    ].map((method, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </TermsSection>

                {/* 7. Cancellation & Refunds */}
                <TermsSection
                  id="cancellation"
                  title="7. Cancellation & Refund Policy"
                  icon={XCircle}
                  delay={0.4}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    7.1 Client Cancellation
                  </h3>
                  <p>If the Client cancels a project after contract signing:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>
                      15+ days before event: 70% refund of deposit (30% retained
                      for design work)
                    </li>
                    <li>7-14 days before event: 40% refund of deposit</li>
                    <li>Less than 7 days: No refund</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    7.2 Company Cancellation
                  </h3>
                  <p>
                    The Company reserves the right to cancel a project due to
                    force majeure events, including but not limited to natural
                    disasters, venue cancellation, or government restrictions.
                    In such cases, payment for completed work will be retained,
                    and remaining amounts will be refunded.
                  </p>
                </TermsSection>

                {/* 8. Limitation of Liability */}
                <TermsSection
                  id="liability"
                  title="8. Limitation of Liability"
                  icon={AlertTriangle}
                  delay={0.45}
                >
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-4">
                    <p className="text-red-300 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>
                        This section limits our legal liability. Please read
                        carefully.
                      </span>
                    </p>
                  </div>

                  <p>
                    To the maximum extent permitted by law, Country
                    Communication shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Loss of profits, revenue, or business opportunities</li>
                    <li>Damages resulting from venue or organizer actions</li>
                    <li>
                      Delays caused by third-party suppliers or force majeure
                      events
                    </li>
                  </ul>
                  <p className="mt-4">
                    Our total liability for any claim shall not exceed the total
                    amount paid by the Client for the specific project in
                    question.
                  </p>
                </TermsSection>

                {/* 9. Confidentiality */}
                <TermsSection
                  id="confidentiality"
                  title="9. Confidentiality"
                  icon={Shield}
                  delay={0.5}
                >
                  <p>
                    Both parties agree to maintain the confidentiality of
                    proprietary information shared during the course of the
                    project. This includes but is not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>Business strategies and trade secrets</li>
                    <li>Client lists and contact information</li>
                    <li>Design concepts and technical specifications</li>
                    <li>Financial information and pricing</li>
                  </ul>
                  <p className="mt-4">
                    This obligation survives the termination of the contract for
                    a period of two (2) years.
                  </p>
                </TermsSection>

                {/* 10. Termination */}
                <TermsSection
                  id="termination"
                  title="10. Termination"
                  icon={XCircle}
                  delay={0.55}
                >
                  <p>
                    Either party may terminate the agreement under the following
                    conditions:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>Material breach of contract by the other party</li>
                    <li>Insolvency or bankruptcy of either party</li>
                    <li>Mutual written agreement</li>
                    <li>Force majeure events lasting more than 30 days</li>
                  </ul>
                  <p className="mt-4">
                    Upon termination, the Client shall pay for all services
                    rendered up to the date of termination.
                  </p>
                </TermsSection>

                {/* 11. Dispute Resolution */}
                <TermsSection
                  id="disputes"
                  title="11. Dispute Resolution"
                  icon={Gavel}
                  delay={0.6}
                >
                  <p>
                    In the event of any dispute arising from these Terms or the
                    services provided:
                  </p>

                  <div className="space-y-3 mt-3">
                    {[
                      {
                        step: "Step 1: Negotiation",
                        description:
                          "Both parties shall first attempt to resolve the dispute through good-faith negotiations.",
                      },
                      {
                        step: "Step 2: Mediation",
                        description:
                          "If negotiation fails, the dispute shall be referred to a mutually agreed mediator in Dhaka, Bangladesh.",
                      },
                      {
                        step: "Step 3: Arbitration",
                        description:
                          "If mediation is unsuccessful, the dispute shall be resolved through binding arbitration under the Arbitration Act of Bangladesh.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary-light font-bold text-sm shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {item.step}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TermsSection>

                {/* 12. Governing Law */}
                <TermsSection
                  id="governing-law"
                  title="12. Governing Law"
                  icon={Globe}
                  delay={0.65}
                >
                  <p>
                    These Terms and Conditions shall be governed by and
                    construed in accordance with the laws of the People's
                    Republic of Bangladesh.
                  </p>
                  <p>
                    Any legal action or proceeding arising out of these Terms
                    shall be brought exclusively in the courts of Dhaka,
                    Bangladesh.
                  </p>
                </TermsSection>

                {/* 13. Changes to Terms */}
                <TermsSection
                  id="changes"
                  title="13. Changes to Terms & Conditions"
                  icon={Calendar}
                  delay={0.7}
                >
                  <p>
                    We reserve the right to modify or replace these Terms at any
                    time. Material changes will be communicated to active
                    clients via email at least 15 days before they take effect.
                  </p>
                  <p>
                    Continued use of our services after any modifications
                    constitutes acceptance of the updated Terms.
                  </p>
                </TermsSection>

                {/* 14. Contact Information */}
                <TermsSection
                  id="contact"
                  title="14. Contact Information"
                  icon={Mail}
                  delay={0.75}
                >
                  <p>
                    For any questions, concerns, or legal inquiries regarding
                    these Terms and Conditions, please contact us:
                  </p>

                  <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                            <MailIcon />
                          </div>
                          <div>
                            <p className="text-white font-medium">Email</p>
                            <a
                              href="mailto:legal@countrycomm.com"
                              className="text-gray-400 hover:text-primary-light transition-colors text-sm"
                            >
                              legal@countrycomm.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                            <PhoneIcon />
                          </div>
                          <div>
                            <p className="text-white font-medium">Phone</p>
                            <a
                              href="tel:+8801234567890"
                              className="text-gray-400 hover:text-primary-light transition-colors text-sm"
                            >
                              +880 1234 567890
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                            <MapPinIcon />
                          </div>
                          <div>
                            <p className="text-white font-medium">Address</p>
                            <p className="text-gray-400 text-sm">
                              House 42, Road 12, Gulshan Avenue
                              <br />
                              Dhaka 1212, Bangladesh
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TermsSection>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="pt-8 border-t border-white/10 text-center"
                >
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 text-sm">
                      <span className="text-primary-light font-semibold">
                        Acknowledgment:
                      </span>{" "}
                      By using our services, you acknowledge that you have read
                      these Terms and Conditions and agree to be bound by them.
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    These Terms and Conditions were last updated on{" "}
                    {lastUpdated} and are effective from {effectiveDate}.
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    © {new Date().getFullYear()} Country Communication. All
                    rights reserved.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
