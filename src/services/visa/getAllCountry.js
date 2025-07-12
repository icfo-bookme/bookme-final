const getAllCountry = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/countries/visa`
      );
      const propertyPackages = await response.json();
     
      return propertyPackages;
    } catch (error) {
      return [];
    }
  };
  
  export default getAllCountry;
  