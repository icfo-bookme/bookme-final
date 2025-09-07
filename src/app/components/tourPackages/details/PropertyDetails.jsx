import getRelatedActivities from "@/services/Activities/getRelatedActivities";
import Activities from "../../Activities/Packages";
import PropertyFacilities from "./PropertyFacilites";
import PropertySlider from "./PropertySlider";
import PropertySummary from "./PropertySummary";
import RelatedActivities from "../../Activities/RelatedActivities";
import Tab from "../../car/DetailsTab/tab";
// import { RelatedActivities } from "../../Activities/RelatedActivities";

export default async function PropertyDetails({ data }) {
    if (!data) {
        return <div>No property details available</div>;
    }
console.log("Property Details Data:", data);
    const { category_id } = data;
    
const relatedPackages = await getRelatedActivities(data.destination_id, data.id);

    return (
        <div className="container md:w-[93%] w-[98%] mx-auto">
            {category_id == 5 && (
                <>
                    <div className="p-5 bg-white rounded-lg grid grid-cols-1 md:grid-cols-10 gap-4">
                        <div className="md:col-span-7">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800  sm:mb-3 flex items-center -mt-2  gap-2">
                                <i className="fa-solid fa-info-circle text-blue-600 "></i>
                                Package Summary
                            </h2>
                            <PropertySlider images={data.images} />
                        </div>
                        <div className="md:col-span-3">
                            <PropertySummary data={data} />
                        </div>
                    </div>

                    <div>
                        <PropertyFacilities data={data} />
                    </div>
                </>
            )}

            {category_id == 6 && (
                <>
                    <div className="md:px-5 px-1  bg-gray-100 rounded-lg">
                    <div className="py-2">
                        <div className="px-2">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold text-blue-900 ">{data.property_name}</h2>
                            </div>
                            <p className="flex text-blue-800 items-center pb-3 ">
                                <i className="fa-solid text-blue-800 fa-location-dot"></i>
                                {data.address}
                            </p>
                        </div>
                        <PropertySlider images={data.images} />
                    </div>
                    <div>
                        <Activities packages={data.packages} property_id={data.id} />
                    </div>
                    <div className="mt-4">
                        <PropertyFacilities data={data} />
                    </div>
                    <div>
                        <RelatedActivities packages={relatedPackages} />
                    </div>
                </div>
                </>
            )}

            {category_id == 7 && (
                 <>
                 {data.models &&
                  <div className=" mb-5  bg-gray-100 rounded-lg">
                    <Tab models={data.models} />
                 </div>
                 }
                
                    <div className="p-5 bg-white rounded-lg grid grid-cols-1 md:grid-cols-10 gap-4">
                        <div className="md:col-span-7">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800  sm:mb-3 flex items-center -mt-2  gap-2">
                                <i className="fa-solid fa-info-circle text-blue-600 "></i>
                                Package Summary
                            </h2>
                            <PropertySlider images={data.images} />
                        </div>
                        <div className="md:col-span-3">
                            <PropertySummary data={data} />
                        </div>
                    </div>

                    <div>
                        <PropertyFacilities data={data} />
                    </div>
                </>
            )}

           
        </div>
    );
}
