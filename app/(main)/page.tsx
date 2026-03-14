import AboutUs from "@/components/sections/home/AboutUs";
import Heading1 from "@/components/Heading1";
import HeroSwiper from "@/components/sections/home/HeroSwiper";
import TripleSlider from "@/components/sections/home/TripleSlider";
import Offer_service from "@/components/sections/home/Offer_service";


export default function Home() {
  return (
    <main className="mt-4">
      {/* Our Services Section */}
      <div className="">
        <TripleSlider />
      </div>
      <div className="mt-8">
        <Offer_service/>
      </div>
      {/* About Us Section */}
      <div className="w-10/12 mx-auto">
        <Heading1 text="About us" />
        <AboutUs/>
      </div>
      {/* Our Portfolio  Section*/}
      <div className="w-10/12 mx-auto">
        <Heading1 text="Portfolio"/>
      </div>
    </main>
  );
}
