import logo from "@/public/logo_COCO.png";

export default function Footer() {
    return (
        <footer className="mt-12 bg-(--color-primary) text-white">
            <div className="w-11/12 mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                    <div className="">
                        <div className="w-40 mb-4 bg-white p-2 rounded-md">
                            <img src={logo.src} alt="Country Communication" className="w-full" />
                        </div>
                        <p className="text-sm text-white/90">
                            Country Communication provides creative digital solutions — branding, web,
                            and marketing to help your business grow.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">About Us</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Team</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Careers</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Contact</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Services</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Web Development</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Branding</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Marketing</li>
                              <li className="hover:text-(--color-primary-hover) transition cursor-pointer">Portfolio</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Contact</h4>
                        <address className="not-italic text-sm text-white/90">
                            <div>123 Main Street, Dhaka, Bangladesh</div>
                            <div className="mt-2">Email: <a className="underline" href="mailto:info@countrycomm.com">info@countrycomm.com</a></div>
                            <div className="mt-1">Phone: <a className="underline" href="tel:+880123456789">+880 1234 56789</a></div>

                            <div className="flex gap-3 mt-4">
                                {/* Social icons */}
                                <a aria-label="Twitter" href="#" className="hover:text-(--color-primary-hover)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 5.92c-.64.28-1.32.48-2.04.56a3.55 3.55 0 0 0 1.56-1.96c-.68.4-1.44.68-2.24.84A3.52 3.52 0 0 0 12.9 8.5c0 .28 0 .56.04.84A9.98 9.98 0 0 1 3.1 5.16a3.5 3.5 0 0 0-.48 1.76c0 1.22.62 2.3 1.56 2.94a3.5 3.5 0 0 1-1.6-.44v.04c0 1.68 1.2 3.08 2.8 3.4-.4.12-.84.16-1.28.16-.32 0-.64 0-.96-.04.64 2 2.46 3.44 4.6 3.48A7.06 7.06 0 0 1 2 19.6a9.96 9.96 0 0 0 5.4 1.6c6.48 0 10.02-5.36 10.02-10.02v-.46c.7-.5 1.3-1.12 1.78-1.84-.64.28-1.34.48-2.06.56z" />
                                    </svg>
                                </a>

                                <a aria-label="Facebook" href="#" className="hover:text-(--color-primary-hover)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.96 0 1.97.17 1.97.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.38v1.65h2.46l-.39 2.9h-2.07v7A10 10 0 0 0 22 12z" />
                                    </svg>
                                </a>

                                <a aria-label="LinkedIn" href="#" className="hover:text-(--color-primary-hover)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.64 4.74 6.07V21H17v-5.25c0-1.25-.02-2.86-1.74-2.86-1.74 0-2.01 1.36-2.01 2.76V21H9V9z" />
                                    </svg>
                                </a>
                            </div>
                        </address>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm text-white/80">
                    © {new Date().getFullYear()} Country Communication. All rights reserved.
                </div>
            </div>
        </footer>
    );
}