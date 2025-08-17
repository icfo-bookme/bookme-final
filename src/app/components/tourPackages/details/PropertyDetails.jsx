import PropertyFacilities from "./PropertyFacilites";
import PropertySlider from "./PropertySlider";
import PropertySummary from "./PropertySummary";

export default function PropertyDetails({ data }) {
    if (!data) {
        return <div>No property details available</div>;
    }
 
    return (
        <div className="container w-[93%] mx-auto   "> 
        <div className=" p-5 bg-white rounded-lg grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-7">
                <PropertySlider images={data.images} />
            </div>
            <div className="md:col-span-3">
                <PropertySummary data={data} />
            </div>

        </div>
        <div>

        
        <div>
            <PropertyFacilities data={data} />
        </div>
        </div>
        </div>
    );
}
