import PropertyDetails from "@/app/components/tourPackages/details/PropertyDetails";
import getPropertyDetails from "@/services/packages/getPropertyDetails"

export default async function Page({ params }) {
  if (!params.id) {
    throw new Error("No ID provided");
  }
  const data = await getPropertyDetails({ id: params.id });
  
  return (
    <div className="bg-blue-100 pt-20">
        <PropertyDetails data={data} />
    </div>
  )
}