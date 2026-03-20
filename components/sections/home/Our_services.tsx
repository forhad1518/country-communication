import Heading1 from "@/components/Heading1";
import exibition from "@/public/images/service_vector/stole.png"
import logistics from "@/public/images/service_vector/logistics.webp"
import interior from "@/public/images/service_vector/interior.png"
import promotion from "@/public/images/service_vector/promotion.jpg"
export default function Our_services() {
    const service_vector = [
        { img: exibition, title: "Exhibition" },
        { img: logistics, title: "Events & Logistics" },
        { img: interior, title: "Interior & Exterior" },
        { img: promotion, title: "Branding & Promotion" }
    ];
    return(
        <div>
            <div>
                <Heading1 text="Our services" />
            </div>
            <div className="lg:flex lg:justify-between items-center">
               {
                    service_vector.map((service, index) => (
                        <div key={index} className="rounded-2xl shadow-xl/30 text-center p-4 mt-10 lg:mt-0">
                            <div className="w-40 h-40 items-center justify-center mx-auto">
                                <img src={service.img.src} alt={service.title} />
                            </div>
                            <div><p className="text-2xl font-bold">{service.title} <span className="md:rotate-90">➩</span></p></div>
                        </div>
                    ))
               }
            </div>
        </div>
    );
};