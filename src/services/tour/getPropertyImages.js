export const getPropertyImages = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/propertyImages/${id}`
    );
    const propertyImages = await response.json();
    return propertyImages;
  } catch (error) {
    return [];
  }
};
