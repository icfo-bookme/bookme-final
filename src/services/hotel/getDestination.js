const getDestination = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/destinations`
      );
      const propertyPackages = await response.json();
      
      
      return propertyPackages;
    } catch (error) {
      return [];
    }
  };
  export default getDestination;
  