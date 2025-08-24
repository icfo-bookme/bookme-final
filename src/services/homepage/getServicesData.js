async function getServicesData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`);
    if (!res.ok) {
      throw new Error('Failed to fetch services data');
    }
    
    const data = await res.json();
    return data.data || []; 
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}
  export default getServicesData;