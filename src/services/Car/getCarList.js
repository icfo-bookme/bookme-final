export default async function getCarList({ id }) {
  try {
    const res = await fetch(`https://bookme.com.bd/admin/api/car/propertyList/${id}`);

    if (!res.ok) {
      console.error(`Failed to fetch car list: ${res.status} ${res.statusText}`);
      return [];
    }

    const packages = await res.json();

    if (!packages || !Array.isArray(packages)) {
      return [];
    }

    return packages;
  } catch (error) {
    console.error("Error fetching car list:", error);
    return [];
  }
}
