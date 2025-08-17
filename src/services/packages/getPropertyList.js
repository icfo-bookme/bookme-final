export default async function getTourList({ id }) {
  const res = await fetch(`https://bookme.com.bd/admin/api/tourpackages/propertySummary/${id}`);
  const packages = await res.json();
  return packages;
}