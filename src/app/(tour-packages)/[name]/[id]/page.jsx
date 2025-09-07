import PropertyDetails from "@/app/components/tourPackages/details/PropertyDetails";
import getPropertyDetails from "@/services/packages/getPropertyDetails"

export default async function Page({ params }) {
  if (!params.id) {
    throw new Error("No ID provided");
  }
  const data = await getPropertyDetails({ id: params.id });

  const isEmpty =
    data == null ||
    (Array.isArray(data) ? data.length === 0 : typeof data === "object" && Object.keys(data).length === 0);
  return (
   <div className="bg-blue-100 min-h-screen pt-10 md:pt-20 flex items-center justify-center">
      {isEmpty ? (
        <p className="text-center text-red-500 text-xl">No Data Found</p>
      ) : (
        <PropertyDetails data={data} />
      )}
    </div>
  )
}