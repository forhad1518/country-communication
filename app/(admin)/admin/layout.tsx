"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();

    const controllMenu = [
        { button: "Dashboard", link: "/admin" },
        { button: "Blog", link: "/admin/blog" },
        { button: "Portfolio", link: "/admin/portfolio" },
        { button: "Exhibition", link: "/admin/exhibition" },
        { button: "Users", link: "/admin/users" },
        { button: "Settings", link: "/admin/settings" }
    ];

    const getTitle = () => {
        const current = controllMenu.find(m => m.link === pathname);
        return current?.button || "Dashboard";
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-primaryColor text-white hidden md:flex flex-col">

                <div className="h-16 flex items-center px-6 font-bold border-b border-white/20">
                    Logo
                </div>

                <nav className="flex-1 p-4 space-y-2">

                    {controllMenu.map(menu => (
                        <Link
                            key={menu.button}
                            href={menu.link}
                            className={`block px-4 py-2 rounded transition
                                ${pathname === menu.link
                                    ? "bg-primaryColor-hover"
                                    : "hover:bg-primaryColor-hover"
                                }`}
                        >
                            {menu.button}
                        </Link>
                    ))}

                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex flex-col flex-1 min-h-0">

                {/* Topbar */}
                <header className="h-16 bg-white shadow flex items-center justify-between px-6">

                    <h1 className="font-semibold text-gray-700">
                        {getTitle()}
                    </h1>

                    <div className="text-primaryColor font-semibold">
                        Admin
                    </div>

                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
                    {children}
                </main>

            </div>

            {/* Mobile Bottom Menu */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">

                {controllMenu.map(menu => (
                    <Link
                        key={menu.button}
                        href={menu.link}
                        className={`flex flex-col items-center text-xs
                            ${pathname === menu.link
                                ? "text-primaryColor"
                                : "text-gray-500"
                            }`}
                    >
                        <span>⬤</span>
                        <span>{menu.button}</span>
                    </Link>
                ))}

            </div>

        </div>
    );
}