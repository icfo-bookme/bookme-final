const getDestination = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/destinations`,
      
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const propertyPackages = await response.json();
    return propertyPackages;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return []; 
  }
};

export default getDestination;
