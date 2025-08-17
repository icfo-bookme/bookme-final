export default async function getPropertyDetails({ id }) {
  
  const res = await fetch(`https://bookme.com.bd/admin/api/tourpackages/propertydetails/${id}`);
  const property = await res.json();
  return property;
}