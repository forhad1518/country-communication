"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Custom SVG Icons
const WhatsAppIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.32-1.41c1.48.8 3.15 1.22 4.87 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9z" />
        <path d="M17.5 14.5c-.3.85-1.5 1.55-2.45 1.65-.65.07-1.45-.15-3.05-1.05-2.55-1.45-4.2-4.15-4.35-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.9-2.1.25-.25.55-.3.75-.3h.55c.2 0 .4 0 .5.4.2.4.65 1.6.7 1.7.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.35-.45.45-.15.15-.3.3-.1.55.4.65 1.05 1.35 2 1.85 1.2.65 1.8.85 2.1.75.3-.1.45-.35.6-.6.15-.25.25-.4.4-.35.15.05.95.45 1.1.55.15.1.25.15.3.25.05.1.05.35-.1.7z" fill="#ffffff" />
    </svg>
);

const WeChatIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-7 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        <path d="M12 2C6.48 2 2 6.48 2 12c0 2.64 1.05 5.04 2.76 6.78L4 22l3.22-.76C8.96 21.95 10.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
);

const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Contact Card Component
const ContactCard = ({
    type,
    number,
    message,
    icon,
    bgColor,
    hoverColor,
    onClose
}: {
    type: string;
    number: string;
    message: string;
    icon: React.ReactNode;
    bgColor: string;
    hoverColor: string;
    onClose: () => void;
}) => {
    const handleClick = () => {
        let url = "";
        if (type === "whatsapp") {
            url = `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        } else if (type === "wechat") {
            // WeChat doesn't have direct web link, show WeChat ID
            url = `weixin://`;
        }

        if (url) {
            window.open(url, "_blank");
        }

        onClose();
    };

    const handleCopyWeChat = () => {
        if (type === "wechat") {
            navigator.clipboard?.writeText(number);
            alert(`WeChat ID copied: ${number}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mb-3"
        >
            <button
                onClick={type === "wechat" ? handleCopyWeChat : handleClick}
                className={`flex items-center gap-3 px-5 py-3 ${bgColor} ${hoverColor} text-white rounded-full shadow-lg transition-all duration-300 group`}
            >
                <span className="shrink-0">{icon}</span>
                <div className="text-left">
                    <p className="text-xs opacity-80">{type === "whatsapp" ? "WhatsApp" : "WeChat"}</p>
                    <p className="text-sm font-semibold">{number}</p>
                </div>
            </button>
        </motion.div>
    );
};

// Main Floating Contact Component
export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    // Contact Configuration (Easily customizable)
    const contactConfig = {
        whatsapp: {
            number: "+8801234567890",
            message: "Hello! I'm interested in your exhibition services."
        },
        wechat: {
            number: "CountryComm_Official",
            message: "Hello! I'm interested in your exhibition services."
        }
    };

    useEffect(() => {
        // Show after 1 second
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        // Show pulse animation on scroll
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setHasScrolled(true);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isOpen && !target.closest(".floating-contact-container")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="floating-contact-container fixed bottom-6 right-6 z-50">

            {/* Contact Cards */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-20 right-0 mb-4"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-linear-to-r from-gray-900 to-black text-white px-5 py-3 rounded-2xl mb-3 shadow-xl border border-white/10"
                        >
                            <p className="text-sm font-medium">Contact With Us</p>
                            <p className="text-xs text-gray-400">We'll respond within minutes</p>
                        </motion.div>

                        {/* WhatsApp Card */}
                        <ContactCard
                            type="whatsapp"
                            number={contactConfig.whatsapp.number}
                            message={contactConfig.whatsapp.message}
                            icon={<WhatsAppIcon />}
                            bgColor="bg-[#25D366]"
                            hoverColor="hover:bg-[#20bd5a]"
                            onClose={() => setIsOpen(false)}
                        />

                        {/* WeChat Card */}
                        <ContactCard
                            type="wechat"
                            number={contactConfig.wechat.number}
                            message={contactConfig.wechat.message}
                            icon={<WeChatIcon />}
                            bgColor="bg-[#7BB32E]"
                            hoverColor="hover:bg-[#6a9a27]"
                            onClose={() => setIsOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{
                    scale: 1,
                    boxShadow: hasScrolled
                        ? ["0 0 0 0 rgba(0, 153, 153, 0)", "0 0 0 15px rgba(0, 153, 153, 0)", "0 0 0 0 rgba(0, 153, 153, 0)"]
                        : "0 4px 20px rgba(0, 153, 153, 0.3)"
                }}
                transition={hasScrolled ? {
                    duration: 2,
                    repeat: 2,
                    ease: "easeInOut"
                } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                {/* Pulse Ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-primary rounded-full blur-md"
                />

                {/* Button Content */}
                <div className={`
                    relative flex items-center justify-center gap-2
                    ${isOpen
                        ? "w-14 h-14 bg-gray-900"
                        : "w-auto px-5 py-3.5 bg-linear-to-r from-primary to-primary-hover"
                    } 
                    rounded-full shadow-2xl border border-white/20 transition-all duration-300
                `}>
                    {isOpen ? (
                        <CloseIcon />
                    ) : (
                        <>
                            <ChatIcon />
                            <span className="text-white font-semibold text-sm whitespace-nowrap">
                                Contact Us
                            </span>
                        </>
                    )}
                </div>

                {/* Notification Dot */}
                {!isOpen && !hasScrolled && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-black"
                    />
                )}
            </motion.button>

            {/* Tooltip on first load */}
            <AnimatePresence>
                {!isOpen && !hasScrolled && isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-24 right-0 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm shadow-xl border border-white/10 whitespace-nowrap"
                    >
                        Need help? Chat with us!
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-gray-900 border border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}