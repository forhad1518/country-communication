import AboutUs from "@/components/sections/home/AboutUs";
import Heading1 from "@/components/Heading1";
import TripleSlider from "@/components/sections/home/TripleSlider";
import Offer_service from "@/components/sections/home/Offer_service";
import Our_services from "@/components/sections/home/Our_services";
import Workflow from "@/components/sections/home/Workflow";
import Working_process from "@/components/sections/home/Working_process";
import ExhibitionCampaign from "@/components/sections/home/ExhibitionCampaign";
import Contact from "@/components/sections/home/Contact";
import OurClients from "@/components/ValuableClient";


export default function Home() {
  return (
    <main >
      {/* Our Services Section */}
      <div >
        <TripleSlider />
      </div>
      <div >
        <Offer_service />
      </div>
      {/* About Us Section */}
      <div >
        <Our_services />
      </div>
      {/* WorkFLow Section */}
      <div >
        <Workflow />
      </div>
      {/* Working process */}
      {/* next exhibition */}
      <div >
        <ExhibitionCampaign />
      </div>
      {/* next exhibition */}
      <div >
        <OurClients />
      </div>
      {/* Contact Section */}
      <div>
        <Contact/>
      </div>
    </main>
  );
};
