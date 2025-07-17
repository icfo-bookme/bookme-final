
const getHotelCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/categories`
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getHotelCategories;