async function getServicesData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
       cache: "no-store", // Ensure no caching
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch services data');
    }
    
    const data = await res.json();
    return data.data || []; // Return empty array if data.data is undefined
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}
  export default getServicesData;