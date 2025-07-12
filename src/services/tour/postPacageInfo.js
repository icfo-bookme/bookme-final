const postPackageInfo = async (packageData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tour-consultations`,
      {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json", // Set content type
        },
        body: JSON.stringify(packageData), // Send data in the body
        cache: "no-store", // Ensure no caching
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to post package info: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error posting package info:", error);
    return { error: error.message }; // Return error message
  }
};

export default postPackageInfo;
