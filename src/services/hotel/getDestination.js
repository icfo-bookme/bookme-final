const getDestination = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/destinations`,
      {
        cache: "no-store", // ✅ Next.js এ প্রতিবার fresh data নেবে
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const propertyPackages = await response.json();
    return propertyPackages;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return []; // error হলে empty array রিটার্ন
  }
};

export default getDestination;
