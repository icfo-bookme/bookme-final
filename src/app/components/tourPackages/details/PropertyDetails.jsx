import Activities from "../../Activities/Packages";
import PropertyFacilities from "./PropertyFacilites";
import PropertySlider from "./PropertySlider";
import PropertySummary from "./PropertySummary";

export default function PropertyDetails({ data }) {
    if (!data) {
        return <div>No property details available</div>;
    }

    return (
        <div className="container w-[93%] mx-auto">
            {data?.category_id == 5 ? (
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
            ) : (
                <div className="px-5  bg-gray-100 rounded-lg">
                    <div className="py-2">
                        <div>
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
                        <Activities packages={data.packages} />
                    </div>
                    <div className="mt-4">
                        <PropertyFacilities data={data} />
                    </div>
                </div>
            )}
        </div>
    );
}
