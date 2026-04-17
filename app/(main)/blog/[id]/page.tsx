"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Clock,
    User,
    Tag,
    Heart,
    Share2,
    MessageCircle,
    ChevronLeft,
    ThumbsUp,
    Reply,
    Send,
    MoreVertical,
    Trash2,
    CheckCircle,
    Link2,
    BookOpen,
    Eye,
    ArrowUp
} from "lucide-react";

// Custom Social Icons
const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.32-1.41c1.48.8 3.15 1.22 4.87 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9z" />
        <path d="M17.5 14.5c-.3.85-1.5 1.55-2.45 1.65-.65.07-1.45-.15-3.05-1.05-2.55-1.45-4.2-4.15-4.35-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.9-2.1.25-.25.55-.3.75-.3h.55c.2 0 .4 0 .5.4.2.4.65 1.6.7 1.7.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.35-.45.45-.15.15-.3.3-.1.55.4.65 1.05 1.35 2 1.85 1.2.65 1.8.85 2.1.75.3-.1.45-.35.6-.6.15-.25.25-.4.4-.35.15.05.95.45 1.1.55.15.1.25.15.3.25.05.1.05.35-.1.7z" fill="#ffffff" />
    </svg>
);

// Types (same as before)
type CommentType = {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    date: string;
    likes: number;
    isLiked?: boolean;
    replies?: CommentType[];
    isAdmin?: boolean;
};

type BlogPostType = {
    id: string;
    title: string;
    subtitle?: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    views: number;
    likes: number;
    author: {
        name: string;
        avatar: string;
        bio: string;
        role: string;
    };
    content: {
        type: "paragraph" | "heading" | "image" | "quote" | "list";
        content: string | string[];
        caption?: string;
    }[];
    tags: string[];
    relatedPosts: {
        id: string;
        title: string;
        image: string;
        date: string;
    }[];
};

// Sample Blog Data (same as before)
const sampleBlog: BlogPostType = {
    id: "1",
    title: "How to Design an Attractive Exhibition Booth That Drives Engagement",
    subtitle: "Learn the essential design principles that make exhibition booths stand out and attract more visitors.",
    category: "Booth Design",
    image: "https://picsum.photos/1200/600?1",
    date: "March 15, 2025",
    readTime: "8 min read",
    views: 2547,
    likes: 342,
    author: {
        name: "Iqbal Mahmud",
        avatar: "https://picsum.photos/100/100?author",
        bio: "Exhibition strategist with 10+ years experience in designing award-winning booths for global brands.",
        role: "Senior Exhibition Designer"
    },
    content: [
        {
            type: "paragraph",
            content: "In today's competitive exhibition landscape, having an attractive booth is no longer optional—it's essential. Your booth is often the first impression potential clients have of your brand, and making it count can mean the difference between a successful show and a missed opportunity."
        },
        {
            type: "heading",
            content: "Understanding Your Audience"
        },
        {
            type: "paragraph",
            content: "Before diving into design elements, it's crucial to understand who you're designing for. Different industries and demographics respond to different visual cues and layouts. Take time to research your target audience's preferences and expectations."
        },
        {
            type: "image",
            content: "https://picsum.photos/800/400?booth1",
            caption: "Modern exhibition booth with interactive elements"
        },
        {
            type: "heading",
            content: "Key Design Principles for Exhibition Booths"
        },
        {
            type: "list",
            content: [
                "Open Layout: Create an inviting space that encourages visitors to enter",
                "Strategic Lighting: Use lighting to highlight key products and create ambiance",
                "Brand Consistency: Ensure your booth reflects your brand identity",
                "Interactive Elements: Incorporate touch screens, demos, or VR experiences",
                "Comfortable Seating: Provide areas for meaningful conversations"
            ]
        },
        {
            type: "quote",
            content: "The best exhibition booths don't just display products—they tell a story and create an experience."
        }
    ],
    tags: ["Exhibition Design", "Booth Strategy", "Event Marketing", "Trade Shows"],
    relatedPosts: [
        {
            id: "2",
            title: "Top Exhibition Trends in 2025",
            image: "https://picsum.photos/400/300?trends",
            date: "February 28, 2025"
        },
        {
            id: "3",
            title: "Modular Booth vs Custom Booth",
            image: "https://picsum.photos/400/300?modular",
            date: "January 10, 2025"
        }
    ]
};

// Sample Comments Data
const sampleComments: CommentType[] = [
    {
        id: "1",
        userId: "user1",
        userName: "Sarah Johnson",
        userAvatar: "https://picsum.photos/50/50?user1",
        content: "This is incredibly helpful! We're planning our first major exhibition booth and these tips are exactly what we needed.",
        date: "March 16, 2025",
        likes: 24,
        isLiked: false,
        replies: [
            {
                id: "1-1",
                userId: "admin",
                userName: "Iqbal Mahmud",
                userAvatar: "https://picsum.photos/50/50?author",
                content: "Thank you Sarah! Best of luck with your exhibition. Feel free to reach out if you need any specific advice.",
                date: "March 16, 2025",
                likes: 8,
                isAdmin: true
            }
        ]
    },
    {
        id: "2",
        userId: "user2",
        userName: "Michael Chen",
        userAvatar: "https://picsum.photos/50/50?user2",
        content: "Great article! The section on lighting strategies was particularly insightful.",
        date: "March 17, 2025",
        likes: 18,
        isLiked: true
    }
];

// Share Button Component (Updated with custom icons)
const ShareButton = ({ title, url }: { title: string; url: string }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    const copyLink = () => {
        navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-primary/50 transition-colors"
            >
                <Share2 className="w-4 h-4" />
                Share
            </button>

            <AnimatePresence>
                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-12 bg-gray-900 border border-white/10 rounded-xl p-2 shadow-xl z-20 min-w-48"
                    >
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <FacebookIcon />
                            Facebook
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <TwitterIcon />
                            Twitter
                        </a>
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <LinkedinIcon />
                            LinkedIn
                        </a>
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <WhatsAppIcon />
                            WhatsApp
                        </a>
                        <div className="border-t border-white/10 my-1" />
                        <button
                            onClick={copyLink}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Link2 className="w-4 h-4 text-gray-400" />
                                    Copy Link
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Table of Contents Component (same as before)
const TableOfContents = ({ content }: { content: BlogPostType['content'] }) => {
    const [activeId, setActiveId] = useState("");
    const headings = content.filter(item => item.type === "heading");

    useEffect(() => {
        const handleScroll = () => {
            const headingElements = document.querySelectorAll('h2[id]');
            let current = "";
            headingElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150) {
                    current = el.id;
                }
            });
            setActiveId(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-light" />
                Table of Contents
            </h3>
            <ul className="space-y-2">
                {headings.map((heading, i) => {
                    const id = `heading-${i}`;
                    return (
                        <li key={i}>
                            <a
                                href={`#${id}`}
                                className={`block text-sm transition-colors py-1 border-l-2 pl-3 ${activeId === id
                                        ? "border-primary-light text-primary-light"
                                        : "border-transparent text-gray-400 hover:text-white"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {heading.content}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// Comment Component (same as before)
const CommentItem = ({
    comment,
    onReply,
    onLike,
    onDelete,
    isAdmin,
    depth = 0
}: {
    comment: CommentType;
    onReply: (id: string) => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    isAdmin: boolean;
    depth?: number;
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    const handleSubmitReply = () => {
        if (replyContent.trim()) {
            onReply(comment.id);
            setReplyContent("");
            setShowReplyInput(false);
        }
    };

    return (
        <div className={`${depth > 0 ? "ml-8 md:ml-12 pl-4 border-l-2 border-white/10" : ""}`}>
            <div className="flex gap-4">
                <div className="shrink-0">
                    {comment.userAvatar ? (
                        <Image
                            src={comment.userAvatar}
                            alt={comment.userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {comment.userName.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{comment.userName}</span>
                                {comment.isAdmin && (
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary-light text-xs rounded-full border border-primary/30">
                                        Admin
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">{comment.date}</span>
                            </div>

                            {(isAdmin || !comment.isAdmin) && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowOptions(!showOptions)}
                                        className="p-1 hover:bg-white/10 rounded"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {showOptions && isAdmin && (
                                        <div className="absolute right-0 top-8 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-10">
                                            <button
                                                onClick={() => onDelete(comment.id)}
                                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => onLike(comment.id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${comment.isLiked
                                    ? "text-primary-light"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{comment.likes}</span>
                        </button>

                        {depth < 2 && (
                            <button
                                onClick={() => setShowReplyInput(!showReplyInput)}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                <Reply className="w-3.5 h-3.5" />
                                Reply
                            </button>
                        )}
                    </div>

                    {showReplyInput && (
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                            />
                            <button
                                onClick={handleSubmitReply}
                                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Main Component
export default function BlogDetailPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [blog] = useState<BlogPostType>(sampleBlog);
    const [comments, setComments] = useState<CommentType[]>(sampleComments);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isAdmin] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const current = window.scrollY;
            setProgress((current / total) * 100);
            setShowScrollTop(current > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleCommentLike = (commentId: string) => {
        setComments(prev => {
            const updateComment = (comments: CommentType[]): CommentType[] => {
                return comments.map(c => {
                    if (c.id === commentId) {
                        return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
                    }
                    if (c.replies) {
                        return { ...c, replies: updateComment(c.replies) };
                    }
                    return c;
                });
            };
            return updateComment(prev);
        });
    };

    const handleReply = (commentId: string) => {
        console.log("Reply to:", commentId);
    };

    const handleDeleteComment = (commentId: string) => {
        setComments(prev => {
            const deleteFromComments = (comments: CommentType[]): CommentType[] => {
                return comments.filter(c => {
                    if (c.id === commentId) return false;
                    if (c.replies) {
                        c.replies = deleteFromComments(c.replies);
                    }
                    return true;
                });
            };
            return deleteFromComments(prev);
        });
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: CommentType = {
            id: Date.now().toString(),
            userId: "currentUser",
            userName: "Guest User",
            content: newComment,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            likes: 0,
            isLiked: false
        };

        setComments(prev => [comment, ...prev]);
        setNewComment("");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            {/* Reading Progress */}
            <motion.div
                style={{ width: `${progress}%` }}
                className="fixed top-0 left-0 h-1 bg-linear-to-r from-primary to-accent z-50"
            />

            {/* Scroll to Top */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-6 z-40 p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Content Container - 80% Width */}
            <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">

                {/* Navigation */}
                <div className="pt-8">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-primary-light transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Blogs
                        </button>

                        <Link
                            href="/blog"
                            className="text-gray-400 hover:text-primary-light transition-colors"
                        >
                            All Posts
                        </Link>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="pt-12 pb-8">
                    <div className="relative rounded-3xl overflow-hidden h-100 md:h-125 lg:h-150">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                            <div className="max-w-4xl">
                                <span className="inline-block px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                                    {blog.category}
                                </span>

                                <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
                                    {blog.title}
                                </h1>

                                {blog.subtitle && (
                                    <p className="text-gray-300 text-base md:text-lg mb-6 max-w-3xl">
                                        {blog.subtitle}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {blog.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {blog.readTime}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        {blog.views.toLocaleString()} views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Content + Sidebar */}
                <section className="py-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div ref={contentRef} className="prose prose-invert prose-lg max-w-none">
                                {blog.content.map((item, index) => {
                                    if (item.type === "heading") {
                                        const id = `heading-${index}`;
                                        return (
                                            <h2 key={index} id={id} className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                                                {item.content}
                                            </h2>
                                        );
                                    }
                                    if (item.type === "paragraph") {
                                        return (
                                            <p key={index} className="text-gray-300 leading-relaxed mb-6">
                                                {item.content}
                                            </p>
                                        );
                                    }
                                    if (item.type === "image") {
                                        return (
                                            <figure key={index} className="my-10">
                                                <div className="relative h-75 md:h-100 rounded-2xl overflow-hidden">
                                                    <Image
                                                        src={item.content as string}
                                                        alt={item.caption || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                {item.caption && (
                                                    <figcaption className="text-center text-gray-400 text-sm mt-3">
                                                        {item.caption}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        );
                                    }
                                    if (item.type === "quote") {
                                        return (
                                            <blockquote key={index} className="border-l-4 border-primary pl-6 my-8">
                                                <p className="text-xl md:text-2xl text-white italic">
                                                    "{item.content}"
                                                </p>
                                            </blockquote>
                                        );
                                    }
                                    if (item.type === "list") {
                                        return (
                                            <ul key={index} className="space-y-2 my-6">
                                                {(item.content as string[]).map((listItem, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-300">
                                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                                        {listItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary-light" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10 hover:border-primary/50 hover:text-primary-light transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Author Bio */}
                            <div className="mt-12 p-6 bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl border border-white/10">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <Image
                                        src={blog.author.avatar}
                                        alt={blog.author.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">
                                            {blog.author.name}
                                        </h3>
                                        <p className="text-primary-light text-sm mb-2">{blog.author.role}</p>
                                        <p className="text-gray-400 text-sm">{blog.author.bio}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12">
                                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-primary-light" />
                                    Comments ({comments.length})
                                </h3>

                                <form onSubmit={handleSubmitComment} className="mb-8">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary resize-none"
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors flex items-center gap-2"
                                                >
                                                    Post Comment
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            onReply={handleReply}
                                            onLike={handleCommentLike}
                                            onDelete={handleDeleteComment}
                                            isAdmin={isAdmin}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Actions */}
                            <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLiked
                                                ? "bg-primary/20 text-primary-light border border-primary/30"
                                                : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50"
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                        <span>{blog.likes}</span>
                                    </button>

                                    <ShareButton title={blog.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
                                </div>
                            </div>

                            {/* Table of Contents */}
                            <TableOfContents content={blog.content} />

                            {/* Related Posts */}
                            <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-4">Related Posts</h3>
                                <div className="space-y-4">
                                    {blog.relatedPosts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.id}`} className="flex gap-3 group">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                width={60}
                                                height={60}
                                                className="rounded-lg object-cover shrink-0"
                                            />
                                            <div>
                                                <h4 className="text-sm font-medium text-white group-hover:text-primary-light transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                                <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Newsletter</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Get the latest exhibition tips and trends straight to your inbox.
                                </p>
                                <form className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
                                    />
                                    <button className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}