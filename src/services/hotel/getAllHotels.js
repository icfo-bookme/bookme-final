
const getAllHotels = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels`, 
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getAllHotels;