export default async function getActivitiesDestinations() {
  const res = await fetch(`https://bookme.com.bd/admin/api/activities/destinations`);
  const destinations = await res.json();
  return destinations;
}