import getTourDestinations from "@/services/packages/getTourDestinations"
import ListingSearchBar from "./ListingSearch";


export default async function PackageListingSearch() {
  const data = await getTourDestinations();
  if (!data) {
    return <div>No tour destinations found.</div>;
  }

  return (
    <ListingSearchBar data={data} />
  )
}