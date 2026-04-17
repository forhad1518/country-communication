import AboutUs from "@/components/sections/home/AboutUs";
import Heading1 from "@/components/Heading1";
import TripleSlider from "@/components/sections/home/TripleSlider";
import Offer_service from "@/components/sections/home/Offer_service";
import Our_services from "@/components/sections/home/Our_services";
import Workflow from "@/components/sections/home/Workflow";
import Working_process from "@/components/sections/home/Working_process";
import ExhibitionCampaign from "@/components/sections/home/ExhibitionCampaign";
import Contact from "@/components/sections/home/Contact";


export default function Home() {
  return (
    <main className="">
      {/* Our Services Section */}
      <div className="">
        <TripleSlider />
      </div>
      <div className="">
        <Offer_service />
      </div>
      {/* About Us Section */}
      <div className="">
        <Our_services />
      </div>
      {/* WorkFLow Section */}
      <div className="">
        <Workflow />
      </div>
      {/* Working process */}
      {/* next exhibition */}
      <div className="">
        <ExhibitionCampaign />
      </div>
      {/* Contact Section */}
      <div>
        <Contact/>
      </div>
    </main>
  );
};
