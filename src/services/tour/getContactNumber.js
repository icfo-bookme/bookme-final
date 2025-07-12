const getContactNumber = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-attributes `,
      {
        cache: "no-store", // Ensure no caching
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    return [];
  }
};

export default getContactNumber;
