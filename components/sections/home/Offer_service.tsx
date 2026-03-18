
import Heading1 from "@/components/Heading1";
import bg from "@/public/fair_bg.webp"

import logo1 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.36 (1).jpeg"
import logo2 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.36 (2).jpeg"
import logo3 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (3).jpeg"
import logo4 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (4).jpeg"
import logo5 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (5).jpeg"
import logo6 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (6).jpeg"

export default function Offer_service() {
    const all_services = [
        { logo: logo1, title: "Service 1", description: "Description for Service 1" },
        { logo: logo2, title: "Service 2", description: "Description for Service 2" },
        { logo: logo3, title: "Service 3", description: "Description for Service 3" },
        { logo: logo4, title: "Service 4", description: "Description for Service 4" },
        { logo: logo5, title: "Service 5", description: "Description for Service 5" },
        { logo: logo6, title: "Service 6", description: "Description for Service 6" },
        { logo: logo1, title: "Service 1", description: "Description for Service 1" },
        { logo: logo2, title: "Service 2", description: "Description for Service 2" },
        { logo: logo3, title: "Service 3", description: "Description for Service 3" },
        { logo: logo4, title: "Service 4", description: "Description for Service 4" },
        { logo: logo5, title: "Service 5", description: "Description for Service 5" },
        { logo: logo6, title: "Service 6", description: "Description for Service 6" }
    ];
    return (
        <div style={{ backgroundImage: `url(${bg.src})`}}>
            <div className="bg-white/60 p-4">
                <div>
                    <Heading1 text="We offer services at exhibitions and events." />
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-10/12 mx-auto">
                    {
                        all_services.map((service, index) => (
                            <div key={index} className="bg-white flex justify-center rounded-2xl p-3 shadow-xl/30">
                                <img src={service.logo.src} alt={service.title} className="w-full h-20" />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}