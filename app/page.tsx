import HeroSwiper from "@/components/HeroSwiper";
import TripleSlider from "@/components/TripleSlider";

export default function Home() {
  return (
    <main className="mt-4">
      <div className="h-[calc(100vh-100px)]">
        <HeroSwiper />
      </div>
      <div>
        <TripleSlider />
      </div>
    </main>
  );
}
