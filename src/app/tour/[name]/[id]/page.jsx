import { Roboto } from "next/font/google";
import Banner from "@/app/components/tour/Banner/Banner";
import PropertyList from "@/app/components/tour/Property/Property";
import propertySummary from "@/services/tour/propertySummary";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });


export default async  function Home({ params }) {
  const result = await propertySummary(params.id);
  return (
    <main className={`${roboto.className}`}>
      <div className=" mb-12">
        <div className=" ">
          <div className=" overflow-hidden">
            <PropertyList initialData={result} id={params.id} />
          </div>
        </div>
      </div>
    </main>
  );
}