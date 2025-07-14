// lib/api/getHotelPhotos.js
const getHotelPhotos = async (hotelId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/images/${hotelId}`
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getHotelPhotos;