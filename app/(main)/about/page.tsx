"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import heroImage from "@/public/images/about/trina solar 24.jpg"
import hero1 from "@/public/images/about/hero1.jpeg"
import hero2 from "@/public/images/about/hero2.jpeg"
import hero3 from "@/public/images/about/hero3.jpeg"
import hero4 from "@/public/images/about/hero4.jpeg"
import {
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Award,
  TrendingUp,
  Star,
  Quote,
  Play,
  Pause,
  ChevronRight,
  Building2,
  Factory,
  Truck,
  Palette,
  Wrench,
  Target,
  Eye,
  Heart,
} from "lucide-react";
import axios from "axios";
import OurClients from "@/components/ValuableClientAbout";

// Stats Data
const companyStats = [
  {
    icon: Building2,
    value: "1000+",
    label: "Booths Delivered",
    color: "text-primary",
  },
  {
    icon: Globe,
    value: "10+",
    label: "Countries Served",
    color: "text-accent",
  },
  {
    icon: Award,
    value: "10+",
    label: "Industry Awards",
    color: "text-primary",
  },
  { icon: Users, value: "50+", label: "Team Members", color: "text-accent" },
];

// Team Members
const teamMembers = [
  {
    name: "Md. Rahman",
    role: "CEO & Founder",
    image: "https://picsum.photos/200/200?ceo",
    bio: "20+ years in exhibition industry",
  },
  {
    name: "Fatima Ahmed",
    role: "Creative Director",
    image: "https://picsum.photos/200/200?creative",
    bio: "Award-winning booth designer",
  },
  {
    name: "Tanvir Hasan",
    role: "Production Head",
    image: "https://picsum.photos/200/200?production",
    bio: "Manufacturing expert",
  },
  {
    name: "Nusrat Jahan",
    role: "Client Relations",
    image: "https://picsum.photos/200/200?client",
    bio: "Client satisfaction specialist",
  },
];

// Core Values
const coreValues = [
  {
    icon: Target,
    title: "Design with Purpose",
    description:
      "We shape every space around the brand, audience, venue, and outcome that matter most.",
  },
  {
    icon: Palette,
    title: "Plan for Delivery",
    description:
      "Creative ideas become stronger when materials, timelines, and on-site realities are considered early.",
  },
  {
    icon: Heart,
    title: "Work as Partners",
    description:
      "We collaborate closely, communicate clearly, and keep the project moving from brief to build.",
  },
  {
    icon: Eye,
    title: "Care About the Details",
    description:
      "From visitor flow to finishing touches, we focus on the elements that make a space feel complete.",
  },
];

// Manufacturing Facilities
const manufacturingData = [
  {
    title: "Design and Visualization",
    image: "https://picsum.photos/400/300?cnc",
    description:
      "Translate objectives into spatial concepts, layouts, and visual direction before production begins.",
  },
  {
    title: "Production and Finishing",
    image: "https://picsum.photos/400/300?metal",
    description:
      "Select structures, materials, and finishes that support the intended brand expression and practical use.",
  },
  {
    title: "Graphics and Brand Application",
    image: "https://picsum.photos/400/300?printing",
    description:
      "Apply messaging, signage, and visual details consistently across the visitor journey.",
  },
  {
    title: "Installation and Quality Check",
    image: "https://picsum.photos/400/300?assembly",
    description:
      "Coordinate on-site set-up and final checks before the event opens.",
  },
];

// Client Logos (Sample)
const clientLogos = [
  "https://picsum.photos/150/80?client1",
  "https://picsum.photos/150/80?client2",
  "https://picsum.photos/150/80?client3",
  "https://picsum.photos/150/80?client4",
  "https://picsum.photos/150/80?client5",
  "https://picsum.photos/150/80?client6",
  "https://picsum.photos/150/80?client7",
  "https://picsum.photos/150/80?client8",
];

// Stat Counter Component
const StatCounter = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: any;
  value: string;
  label: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="flex justify-center mb-3">
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
      {value}
    </div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

// Timeline Component
const TimelineItem = ({
  year,
  title,
  description,
  index,
}: {
  year: string;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative flex items-start gap-8"
  >
    {/* Year Badge */}
    <div className="shrink-0 w-20 text-right">
      <span className="text-primary font-bold text-lg">{year}</span>
    </div>

    {/* Timeline Line & Dot */}
    <div className="relative flex flex-col items-center">
      <div className="w-3 h-3 bg-primary rounded-full border-4 border-black z-10" />
      <div className="w-0.5 h-full bg-linear-to-b from-primary to-transparent absolute top-3" />
    </div>

    {/* Content */}
    <div className="flex-1 pb-12">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Team Card Component
const TeamCard = ({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="bg-linear-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 text-center">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-primary text-sm mb-2">{member.role}</p>
      <p className="text-gray-400 text-xs">{member.bio}</p>
    </div>
  </motion.div>
);
type SliderItem = {
  _id: string;
  image: {
    url: string;
    publicId: string;
  };
  comment: string;
  isActive: boolean;
  order: number;
};
// Main Component
export default function AboutPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamList, setTeamList] = useState(teamMembers);

  // ===== FETCH SLIDERS FROM API =====
  useEffect(() => {
    fetchSliders();
    fetchTeamMembers();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("/api/slider");
      // API returns only active sliders sorted by order
      const activeSlides = (res.data.data || []).filter(
        (slide: SliderItem) => slide.isActive && slide.image?.url,
      );
      setSlides(activeSlides);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get("/api/team");
      if (res.data?.data && res.data.data.length > 0) {
        setTeamList(
          res.data.data.map((item: any) => ({
            name: item.name,
            role: item.designation,
            image: item.photo?.url || "https://picsum.photos/200/200",
            bio: item.experienceComment || "",
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-125 h-125 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center py-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
                    <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                      We Build Brands,
                      <br />
                      Not Just Booths
                    </span>
                  </h1>

                  <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl text-justify leading-relaxed">
                    Country Communication creates exhibition stands, event environments, interior experiences, and brand activations
                    that help organizations show up with clarity and confidence. From the first idea to on-site delivery, we combine
                    thoughtful design, practical planning, and detail-focused execution.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/portfolio">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2"
                      >
                        View Our Work
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>

                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                      >
                        Get Free Booth Design
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right - Image/Video */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative h-100 md:h-125 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={heroImage}
                    alt="Country Communication Exhibition Booth"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-linear-to-r from-primary to-primary-hover text-white px-6 py-4 rounded-2xl shadow-2xl"
                >
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm opacity-90">Booths Delivered</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== COMPANY STATS ===== */}
        <section className="py-16 border-y border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {companyStats.map((stat, i) => (
                <StatCounter key={i} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHO WE ARE ===== */}
        <section className="py-20 md:py-28">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Images Grid */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">

                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src={hero1}
                      alt="Manufacturing"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src={hero2}
                      alt="Booth"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src={hero3}
                      alt="Team"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src={hero4}
                      alt="Event"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right - Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-primary text-sm font-medium">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-6">
                  A Partner for Exhibition and Brand Experiences
                </h2>

                <div className="space-y-4 text-gray-400 leading-relaxed text-justify">
                  <p>
                    Country Communication works with brands and event teams to turn ideas into purposeful physical environments.
                    Our approach connects brand understanding, visitor flow, material choices, and project coordination so every
                    space is engaging, functional, and ready for the show floor.
                  </p>
                  <p>
                    Whether the brief is an exhibition stand, event environment, interior installation, or brand activation, we focus on
                    clear communication, reliable delivery, and details that support your objectives.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    "Design and Visualization",
                    "Project Coordination",
                    "Graphics and Brand Application",
                    "On-site Delivery",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== CORE VALUES ===== */}
        <section className=" bg-linear-to-b from-transparent via-primary/5 to-transparent">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
                What Makes Us Different
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-3 bg-primary rounded-xl w-fit mb-4">
                    <value.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MANUFACTURING FACILITIES ===== */}
        <section className="py-20 md:py-28">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium">
                How We Deliver
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
                Our Process
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Every project is planned around the realities of its venue, timeline, and audience. We coordinate design,
                production, graphics, and on-site readiness so the final space feels considered and performs as intended.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {manufacturingData.map((facility, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {facility.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OUR CLIENTS ===== */}
        <section className="py-16 border-t border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                Trusted by Our Clients
              </h3>
              <p className="text-gray-400 text-sm">
                A selection of organizations we have had the opportunity to support.
              </p>
            </motion.div>

            <OurClients/>
          </div>
        </section>

        {/* ===== TESTIMONIAL ===== */}
        <section className="py-20 bg-linear-to-b from-transparent via-accent/5 to-transparent">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <Quote className="w-16 h-16 text-primary/30 mx-auto mb-8" />

              <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white font-medium leading-relaxed mb-8">
                "Country Communication didn't just build us a booth — they
                created an experience that generated 3x more leads than any
                previous exhibition. Their attention to detail and professional
                execution is unmatched in Bangladesh."
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-r from-primary to-accent">
                  <Image
                    src="https://picsum.photos/100/100?testimonial"
                    alt="Client"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Ahmed Karim</p>
                  <p className="text-gray-400 text-sm">
                    Marketing Director, Leading Telecom Company
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TEAM SECTION ===== */}
        <section className="py-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium">Our Team</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
                Meet the Experts
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamList.map((member, i) => (
                <TeamCard key={i} member={member} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-20 md:py-28 border-t border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Build Your Dream Booth?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Let's create an exhibition experience that captivates your
                audience and drives real business results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2"
                  >
                    Get Free Consultation
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    View Portfolio
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
