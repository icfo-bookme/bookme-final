

import { Roboto } from "next/font/google";
// import Banner from "./components/tour/Banner/Banner";
// import Property from "../components/tour/Property/Property";
import Banner from "@/app/components/tour/Banner/Banner";
import PropertyList from "@/app/components/tour/Property/Property";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });


export default  function Home({ params }) {
  
    
  return (
    <main className={`${roboto.className}`}>
      
      
      <div className=" mb-12">
        <div className=" ">
          {/* Main Content */}
          <div className=" overflow-hidden">
            <PropertyList id={params.id} />
          </div>
        </div>
      </div>

    </main>
  );
}