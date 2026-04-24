"use client";

import Heading1 from "@/components/Heading1";
import { motion } from "framer-motion";
import {
    ClipboardList,
    Monitor,
    ThumbsUp,
    Search,
    Wrench,
    Factory,
    ArrowRight,
    CheckCircle
} from "lucide-react";

// Workflow Step Component
const WorkflowStep = ({
    icon: Icon,
    title,
    description,
    stepNumber,
    delay
}: {
    icon: any;
    title: string;
    description: string;
    stepNumber: number;
    delay: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="group relative p-6 bg-linear-to-br from-gray-900/50 to-black/50 rounded-xl border border-white/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            {/* Step Number Badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {stepNumber}
            </div>

            {/* Icon */}
            <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary-light group-hover:text-accent transition-colors" />
                </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-light transition-colors">
                {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
                {description}
            </p>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-accent" />
            </div>
        </motion.div>
    );
};

// Main Workflow Component
export default function Workflow() {
    const workflowSteps1 = [
        {
            icon: ClipboardList,
            title: "Brief Form",
            description: "We discuss and gather information from the client to provide design concepts.",
            stepNumber: 1
        },
        {
            icon: Monitor,
            title: "Creative Design Options",
            description: "We create multiple 3D design concepts according to your brief requirements.",
            stepNumber: 2
        },
        {
            icon: ThumbsUp,
            title: "Client Feedback",
            description: "We involve our clients throughout the process, take feedback, and optimize the design to create a defining 3D concept for the booth.",
            stepNumber: 3
        }
    ];

    const workflowSteps2 = [
        {
            icon: Factory,
            title: "In-House Production",
            description: "After the final approval of 3D booth design, we start production in our manufacturing unit and take the entire responsibility.",
            stepNumber: 4
        },
        {
            icon: Wrench,
            title: "Install, Dismantle & Warehouse",
            description: "Our expert installation team will take care of booth building onsite and post-exhibition dismantling and store it for your future use as needed.",
            stepNumber: 5
        },
        {
            icon: Search,
            title: "Showsite Supervision",
            description: "Our Project manager will manage any unforeseen circumstances to create an unparalleled on-site experience.",
            stepNumber: 6
        }
    ];

    return (
        <section className="py-8 md:py-10 bg-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="relative w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">

                {/* Workflow Steps - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {workflowSteps1.map((step, index) => (
                        <WorkflowStep
                            key={index}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            stepNumber={step.stepNumber}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                {/* Connecting Line (Desktop only) */}
                <div className="hidden md:block relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-linear-to-r from-primary/50 via-accent/50 to-primary/50 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="w-12 h-12 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
                        >
                            <ArrowRight className="w-6 h-6 text-white" />
                        </motion.div>
                    </div>
                </div>

                {/* Process Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="my-12 p-6 md:p-8 bg-linear-to-r from-primary/5 to-accent/5 rounded-2xl border border-white/10"
                >
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-1" />
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            Being the leader in exhibition stand design & stand builder company in Germany, Europe,
                            we start the work only after understanding your company's vision and objective.
                            Our goal is to provide a remarkable experience throughout the entire process of
                            exhibition stand designing and stand fabrication across Europe.
                        </p>
                    </div>
                </motion.div>

                {/* Workflow Steps - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workflowSteps2.map((step, index) => (
                        <WorkflowStep
                            key={index}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            stepNumber={step.stepNumber}
                            delay={index * 0.1 + 0.4}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
                    >
                        <span>Start Your Project</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}