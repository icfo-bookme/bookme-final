const getRooms = async (hotelId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/rooms/${hotelId}`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    
    const data = await response.json();
    const rooms = (Array.isArray(data) ? data : data?.rooms) ?? [];
    
    return { success: true, rooms, error: null };
  } catch (error) {
    console.error('getRooms error:', error);
    return { success: false, rooms: [], error: error.message };
  }
};

export default getRooms;