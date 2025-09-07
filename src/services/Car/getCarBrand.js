export default async function getCarBrand() {
  const res = await fetch(`https://bookme.com.bd/admin/api/cars/brand`);
  const packages = await res.json();
  return packages;
}