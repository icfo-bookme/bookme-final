export default async function getCarList({ id }) {
  const res = await fetch(`https://bookme.com.bd/admin/api/car/propertyList/${id}`);
  const packages = await res.json();
  return packages;
}