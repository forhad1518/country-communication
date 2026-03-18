"use client"
import { useState } from "react";
import "@/app/globals.css"
import Link from "next/link";
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    /* Controll Menu */
    const controllMenu = [
        { button: "Dashboard", link: "", logoLink: "" },
        { button: "Blog", link: "", logoLink: "" },
        { button: "Protflio", link: "", logoLink: "" },
        { button: "User", link: "", logoLink: "" },
        { button: "Settings", link: "", logoLink: "" }
    ];

    /* Active Button */
    const [isActive, SetIsActive] = useState("Dashboard");
    // console.log(isActive);

    return (
        <html lang="en">
            <body>
                <div className="h-screen flex overflow-hidden bg-gray-100">

                    {/* Sidebar (Desktop only) */}
                    <aside className="w-64 bg-primaryColor text-white hidden md:flex flex-col">

                        <div className="h-16 flex items-center px-6 font-bold border-b border-white/20">
                            Logo
                        </div>

                        <nav className="flex-1 p-4 space-y-2">

                            {
                                controllMenu.map(menu => <Link href={menu.link || "#"} onClick={() => SetIsActive(menu.button)} key={menu.button} className={`block px-4 py-2 rounded hover:bg-primaryColor-hover ${isActive === menu.button ? "bg-primaryColor-hover" : ""}`}>
                                    {menu.button}
                                </Link>)
                            }
                        </nav>

                    </aside>

                    {/* Main Area */}
                    <div className="flex flex-col flex-1 min-h-0">

                        {/* Topbar */}
                        <header className="h-16 bg-white shadow flex items-center justify-between px-6">

                            <h1 className="font-semibold text-gray-700">
                                {isActive}
                            </h1>

                            <div className="text-primaryColor font-semibold">
                                Admin
                            </div>

                        </header>

                        {/* Content Scroll */}
                        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
                            {children}
                        </main>

                    </div>

                    {/* Bottom Menu (Mobile only) */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">

                        {
                            controllMenu.map(menu => <button key={menu.button} className="flex flex-col items-center text-primaryColor">
                                <span>🏠</span>
                                <span className="text-xs">{menu.button}</span>
                            </button>)
                        }

                    </div> 

                </div>
            </body>
        </html>
    );
} 