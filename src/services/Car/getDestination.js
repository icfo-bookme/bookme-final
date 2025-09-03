export default async function getDestination() {
  const res = await fetch(`https://bookme.com.bd/admin/api/car/destinations`);
  const destinations = await res.json();
  return destinations;
}