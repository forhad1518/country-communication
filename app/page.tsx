import HeroSwiper from "@/components/HeroSwiper";
import Image from "next/image";

export default function Home() {
  return (
      <main className="mt-4">
        <div className="h-[calc(100vh-100px)]">
        <HeroSwiper/>
        </div>
      </main>
  );
}
