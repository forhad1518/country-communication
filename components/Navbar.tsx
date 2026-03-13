import logo from "../public/logo_COCO.png"
export default function Navbar() {
    return (
        <nav className="bg-gray-200 shadow-md text-sm">
            <div className="w-10/12 mx-auto flex items-center justify-between py-[12px]">
                <div className="w-32.5"><img className="w-full" src={logo.src} alt="Country Communication Logo" /></div>
                <div>
                    <ul className="flex gap-x-4 uppercase">
                        <li>About Us</li>
                        <li>Services</li>
                        <li>Portfolio</li>
                        <li>Blog/News</li>
                    </ul>
                </div>
                <div>
                    <button className="bg-black rounded-full text-white px-4 py-1"> Let's Talk</button>
                </div>
            </div>
        </nav>
    );
}