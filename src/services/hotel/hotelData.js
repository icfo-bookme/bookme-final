export async function fetchHotelListingData(locationID) {
  try {
    // Fetch hotels
    const apiUrl = `https://bookme.com.bd/admin/api/hotel/listing/${locationID}`;
    const hotelRes = await fetch(apiUrl);

    if (!hotelRes.ok) {
      throw new Error('Failed to fetch hotels');
    }
    const hotelData = await hotelRes.json();

    // Process all hotels
    const processedHotels = hotelData.map(hotel => {
      const price = hotel.price_after_discount || 0;
      const numericPrice = typeof price === 'string'
        ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0
        : price || 0;

      return {
        ...hotel,
        numericPrice,
        starNumber: parseInt(hotel.star) || 0,
        hasPrice: numericPrice > 0
      };
    });

    // Calculate max price from hotels with prices
    const pricedHotels = processedHotels.filter(hotel => hotel.hasPrice);
    const maxPrice = pricedHotels.length > 0
      ? Math.max(...pricedHotels.map(hotel => hotel.numericPrice))
      : 10000;

    // Fetch amenities
    const amenitiesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aminities`);
    const amenitiesData = amenitiesRes.ok ? await amenitiesRes.json() : [];

    return {
      hotels: processedHotels,
      amenities: amenitiesData,
      maxPrice: Math.ceil(maxPrice / 1000) * 1000
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      hotels: [],
      amenities: [],
      maxPrice: 10000
    };
  }
}