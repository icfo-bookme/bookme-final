const getFacilities = async (id) => {
  try {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/propertyfacilities/${id}`
    );
    let propertyFacilities = await res.json();
    return propertyFacilities;
  } catch (error) {
    return [];
  }
};

export default getFacilities;
