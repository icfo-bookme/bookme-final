let cache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

const getDestination = async () => {
  const now = Date.now();

  // Return from cache if valid
  if (cache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return cache;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/destinations`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const propertyPackages = await response.json();

    // Cache the data and timestamp
    cache = propertyPackages;
    cacheTimestamp = now;

    return propertyPackages;
  } catch (error) {
    // In case of error, return cached data if available, or empty array
    return cache || [];
  }
};

export default getDestination;
