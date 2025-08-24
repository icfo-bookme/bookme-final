export default async function getActivitiesList({ id }) {
  const res = await fetch(`https://bookme.com.bd/admin/api/activities/propertyList/${id}`);
  const packages = await res.json();
  return packages;
}