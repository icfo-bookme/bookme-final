export default async function getAllProperty() {
  const res = await fetch(`https://bookme.com.bd/admin/api/tourpackages/properties`);
  const packages = await res.json();
  return packages;
}