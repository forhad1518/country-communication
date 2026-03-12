import AboutUs from "@/components/AboutUs";
import Heading1 from "@/components/Heading1";
import HeroSwiper from "@/components/HeroSwiper";
import TripleSlider from "@/components/TripleSlider";


export default function Home() {
  return (
    <main className="mt-4">
      {/* Our Services Section */}
      <div className="">
        <TripleSlider />
      </div>
      {/* About Us Section */}
      <div className="w-10/12 mx-auto">
        <Heading1 textUnderline="about" text="us" />
        <AboutUs/>
      </div>
      {/* Our Portfolio  Section*/}
      <div className="w-10/12 mx-auto">
        <Heading1 textUnderline="our" text="Portfolio"/>
      </div>
    </main>
  );
}
