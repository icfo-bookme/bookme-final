import getActivitiesDestinations from "@/services/Activities/getTourDestinations";
import ListingSearchBar from "../tourPackages/ListingSearch/ListingSearch";

export default async function ActivityListingSearch() {
  const data = await getActivitiesDestinations();
  if (!data) {
    return <div>No activity destinations found.</div>;
  }

  return (
    <ListingSearchBar label="DESTINATIONS" query="/activities/list/"  data={data} />
  )
}