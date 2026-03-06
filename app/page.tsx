import Heading1 from "@/components/Heading1";
import HeroSwiper from "@/components/HeroSwiper";
import TripleSlider from "@/components/TripleSlider";
import booth from "@/public/images/about_booth.jpg"

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
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-[50%]">
            <img src={booth.src} alt="" className="w-full rounded-tl-lg rounded-br-lg"/>
          </div>
          <div className="lg:pl-12 lg:w-[50%] text-justify">
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure quia, aperiam distinctio ea cupiditate reiciendis perferendis atque, praesentium molestias illo saepe. Blanditiis fugit voluptatum tempore iusto quo aspernatur iure ipsum!
              Odio repudiandae aliquam assumenda velit architecto sed molestiae provident adipisci, magnam dolore amet vel, itaque dolorem ipsum culpa harum aperiam commodi recusandae quaerat fuga magni maiores et eius. Eveniet, sed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad laborum harum blanditiis cupiditate aliquam illum quod aut sint magni quae. Explicabo, eius. Alias possimus tenetur doloremque quod aliquid, distinctio incidunt.
              Quas quaerat libero, consequuntur reprehenderit optio unde natus voluptatem dolore corrupti nulla vero recusandae. Voluptates animi quisquam, cupiditate excepturi iusto atque, explicabo molestiae ipsam corporis unde eius. Voluptate, sit fuga!
              Autem, officiis. Repellendus nesciunt debitis doloremque facilis laborum ad nisi voluptates libero ut necessitatibus iusto ducimus, cum autem officia optio, ex eos! Exercitationem voluptate consectetur facilis excepturi accusamus architecto odit.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
