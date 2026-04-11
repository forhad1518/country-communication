"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Home,
    Image,
    MessageSquare,
    BarChart3
} from "lucide-react";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const controllMenu = [
        { button: "Dashboard", link: "/admin", icon: LayoutDashboard },
        { button: "Blog", link: "/admin/blog", icon: FileText },
        { button: "Portfolio", link: "/admin/portfolio", icon: FolderOpen },
        { button: "Exhibition", link: "/admin/exhibition", icon: Calendar },
        { button: "Users", link: "/admin/users", icon: Users },
        { button: "Settings", link: "/admin/settings", icon: Settings }
    ];

    const isActive = (link: string) => {
        return pathname.startsWith(link) && (link === "/admin" ? pathname === "/admin" : true);
    };

    const currentPage = controllMenu.find(menu => isActive(menu.link))?.button || "Dashboard";

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? "80px" : "280px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex flex-col bg-gradient-to-b from-gray-900 to-black border-r border-white/10 relative"
            >
                {/* Sidebar Header */}
                <div className={`h-16 flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-6"} border-b border-white/10`}>
                    {!sidebarCollapsed ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-white font-bold text-lg">CountryComm</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {controllMenu.map((menu) => {
                        const Icon = menu.icon;
                        return (
                            <Link
                                key={menu.button}
                                href={menu.link}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive(menu.link)
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive(menu.link) ? "text-white" : "group-hover:text-primary-light"}`} />

                                {!sidebarCollapsed && (
                                    <span className="text-sm font-medium">{menu.button}</span>
                                )}

                                {/* Active Indicator */}
                                {isActive(menu.link) && !sidebarCollapsed && (
                                    <motion.div
                                        layoutId="activeSidebar"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Tooltip for collapsed state */}
                                {sidebarCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                        {menu.button}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className={`p-4 border-t border-white/10 ${sidebarCollapsed ? "text-center" : ""}`}>
                    <button className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all duration-200 w-full ${sidebarCollapsed ? "justify-center" : ""
                        }`}>
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>

                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
                >
                    {sidebarCollapsed ?
                        <ChevronRight className="w-4 h-4" /> :
                        <ChevronLeft className="w-4 h-4" />
                    }
                </button>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* Topbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 border-b border-gray-200">

                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>

                        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                            {currentPage}
                        </h1>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Quick Actions */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                            <MessageSquare className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">A</span>
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar (Slide-out) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-gray-900 to-black z-50 md:hidden"
                        >
                            {/* Mobile Header */}
                            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">C</span>
                                    </div>
                                    <span className="text-white font-bold text-lg">CountryComm</span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="flex-1 p-4 space-y-1">
                                {controllMenu.map((menu) => {
                                    const Icon = menu.icon;
                                    return (
                                        <Link
                                            key={menu.button}
                                            href={menu.link}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(menu.link)
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{menu.button}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile Footer */}
                            <div className="p-4 border-t border-white/10">
                                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all w-full">
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}