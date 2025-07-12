const getPopularSummary = async (locationId) => {
  try {
    // Get current path (client-side only)
    
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popularPropertySummary/${locationId}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
};

export default getPopularSummary;