"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
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
  Shield,
  Handshake
} from "lucide-react";
import logo from "@/public/logo_COCO.png";
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Admin info state
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin",
    email: "admin@countrycomm.com",
    role: "editor",
  });

  // Fetch admin info
  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      if (res.data?.user) {
        setAdminInfo({
          name: res.data.user.name || "Admin",
          email: res.data.user.email || "",
          role: res.data.user.role || "editor",
        });
      }
    } catch (err) {
      console.error("Failed to fetch admin info:", err);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Base menu (everyone)
  const baseMenu = [
    { button: "Dashboard", link: "/admin", icon: LayoutDashboard },
    { button: "Blog", link: "/admin/blog", icon: FileText },
    { button: "Portfolio", link: "/admin/portfolio", icon: FolderOpen },
    { button: "Exhibition", link: "/admin/exhibition", icon: Calendar },
    { button: "Our_Clients", link: "/admin/our_clients", icon: Handshake },
    { button: "Settings", link: "/admin/settings", icon: Settings },
  ];

  // Users menu - only admin
  const usersMenu = { button: "Users", link: "/admin/users", icon: Users };

  // Build menu based on role
  const controllMenu =
    adminInfo.role === "admin"
      ? [...baseMenu.slice(0, 5), usersMenu, baseMenu[5]]
      : baseMenu;

  const isActive = (link: string) => {
    return (
      pathname.startsWith(link) &&
      (link === "/admin" ? pathname === "/admin" : true)
    );
  };

  const currentPage =
    controllMenu.find((menu) => isActive(menu.link))?.button || "Dashboard";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/login");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? "80px" : "280px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col bg-linear-to-b from-gray-900 to-black border-r border-white/10 relative"
      >
        {/* Sidebar Header with Logo */}
        <div
          className={`h-16 flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-6"} border-b border-white/10`}
        >
          {!sidebarCollapsed ? (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                <Image
                  src={logo}
                  alt="Country Communication"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-white font-bold text-sm">
                Country Communication
              </span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1"
            >
              <Image
                src={logo}
                alt="CC"
                width={32}
                height={32}
                className="object-contain"
              />
            </Link>
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
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive(menu.link)
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive(menu.link) ? "text-white" : "group-hover:text-primary-light"}`}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{menu.button}</span>
                )}
                {isActive(menu.link) && !sidebarCollapsed && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {menu.button}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
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

          {/* Admin Profile with Dropdown */}
          <div
            className="relative pl-2 border-l border-gray-200"
            ref={profileDropdownRef}
          >
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminInfo.name.charAt(0)}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {adminInfo.name}
              </span>
              <svg
                className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="p-4 bg-linear-to-r from-primary/5 to-accent/5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">
                          {adminInfo.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {adminInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {adminInfo.email}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium capitalize">
                          <Shield className="w-3 h-3" /> {adminInfo.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-linear-to-b from-gray-900 to-black z-50 md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                <Link
                  href="/admin"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                    <Image
                      src={logo}
                      alt="CC"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white font-bold text-sm">
                    CountryComm
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {controllMenu.map((menu) => {
                  const Icon = menu.icon;
                  return (
                    <Link
                      key={menu.button}
                      href={menu.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(menu.link) ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{menu.button}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-8 h-8 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {adminInfo.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {adminInfo.name}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {adminInfo.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />{" "}
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
