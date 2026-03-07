import AboutUs from "@/components/AboutUs";
import Heading1 from "@/components/Heading1";
import HeroSwiper from "@/components/HeroSwiper";
import TripleSlider from "@/components/TripleSlider";


export default function Home() {
  return (
    <main className="mt-4">
      {/* Hero Section */}
      <div className="h-[calc(100vh-100px)]">
        <HeroSwiper />
      </div>
      {/* Our Services Section */}
      <div className="w-10/12 mx-auto">
        <Heading1 textUnderline={"our"} text={"services"}/>
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
