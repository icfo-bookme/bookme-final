const getTourDestination = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tour/destinations`
      );
      const destinations = await response.json();     
      return destinations;
    } catch (error) {
      return [];
    }
  };

  export default getTourDestination;
