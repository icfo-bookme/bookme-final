const getPropertyDetails = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/property-summary/${id}`
    );
    const propertyDetails = await response.json();
    return propertyDetails;
  } catch (error) {
    return [];
  }
};

export default getPropertyDetails;
