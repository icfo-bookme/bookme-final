

import { Roboto } from "next/font/google";
// import Banner from "./components/tour/Banner/Banner";
// import Property from "../components/tour/Property/Property";
import Banner from "@/app/components/tour/Banner/Banner";
import Property from "@/app/components/tour/Property/Property";
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });


export default  function Home({ params }) {
  
    
  return (
    <main className={`${roboto.className}`}>
      <div className=" w-[100%] pt-[40px] md:pt-[50px]">
        <Banner id={params.id}  />
      </div>
      
      <div className=" py:[20px]  md:py-10 ">
        <div className=" mt-[12px] md:mt-10 w-[98%] md:w-[80%] 2xl:w-[1440px]  gap-5 mx-auto ">
          {/* Main Content */}
          <div className=" overflow-hidden">
            <Property id={params.id} />
          </div>
        </div>
      </div>

    </main>
  );
}