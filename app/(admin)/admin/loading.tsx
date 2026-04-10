"use client";

import { motion } from "framer-motion";

type LoadingProps = {
    variant?: "spinner" | "pulse" | "dots" | "logo";
    size?: "sm" | "md" | "lg";
    text?: string;
    fullscreen?: boolean;
};

export default function Loading({ 
    variant = "spinner", 
    size = "md", 
    text = "Loading...",
    fullscreen = false 
}: LoadingProps) {
    
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    const containerClasses = fullscreen 
        ? "fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" 
        : "w-full";

    // Variant 1: Spinner (Default)
    if (variant === "spinner") {
        return (
            <div className={`${containerClasses} flex justify-center items-center ${fullscreen ? "" : "h-75"}`}>
                <div className="text-center">
                    <div className={`relative ${sizeClasses[size]}`}>
                        {/* Outer ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-primary/20"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                        
                        {/* Spinning ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    
                    {text && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-primary-light text-sm md:text-base mt-4 font-medium"
                        >
                            {text}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    // Variant 2: Pulse
    if (variant === "pulse") {
        return (
            <div className={`${containerClasses} flex justify-center items-center ${fullscreen ? "" : "h-75"}`}>
                <div className="text-center">
                    <motion.div
                        className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-accent rounded-full`}
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    {text && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-primary-light text-sm md:text-base mt-4 font-medium"
                        >
                            {text}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    // Variant 3: Dots
    if (variant === "dots") {
        return (
            <div className={`${containerClasses} flex justify-center items-center ${fullscreen ? "" : "h-75"}`}>
                <div className="text-center">
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-primary to-accent`}
                                animate={{ 
                                    y: [0, -10, 0],
                                    scale: [1, 0.8, 1]
                                }}
                                transition={{ 
                                    duration: 0.6, 
                                    repeat: Infinity, 
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                    
                    {text && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-primary-light text-sm md:text-base mt-4 font-medium"
                        >
                            {text}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    // Variant 4: Logo/Exhibition themed
    if (variant === "logo") {
        return (
            <div className={`${containerClasses} flex justify-center items-center ${fullscreen ? "" : "h-75"}`}>
                <div className="text-center">
                    <div className="relative">
                        {/* Exhibition booth shape */}
                        <motion.div
                            className="relative w-16 h-16 md:w-20 md:h-20"
                            animate={{ 
                                rotateY: [0, 180, 360],
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Booth walls */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-accent rounded-full" />
                            <div className="absolute bottom-0 left-0 w-2 h-12 bg-primary/80 rounded-l-lg" />
                            <div className="absolute bottom-0 right-0 w-2 h-12 bg-accent/80 rounded-r-lg" />
                            <div className="absolute top-0 left-2 right-2 h-2 bg-gradient-to-r from-primary to-accent" />
                            
                            {/* Roof */}
                            <motion.div
                                className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-accent"
                                animate={{ width: [40, 50, 40] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </div>
                    
                    {text && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-primary-light text-sm md:text-base mt-6 font-medium"
                        >
                            {text}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    return null;
}