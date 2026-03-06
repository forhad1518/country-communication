import Heading1 from "@/components/Heading1";
import HeroSwiper from "@/components/HeroSwiper";
import TripleSlider from "@/components/TripleSlider";

export default function Home() {
  return (
    <main className="mt-4">
      <div className="h-[calc(100vh-100px)]">
        <HeroSwiper />
      </div>
      <div className="w-10/12 mx-auto">
        <Heading1 textUnderline={"our"} text={"services"}/>
        <TripleSlider />
      </div>
    </main>
  );
}
