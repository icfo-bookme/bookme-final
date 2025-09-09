const getContactNumber = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-attributes `,
      {
        cache: "no-store", 
      }
    );
    const data = await res.json();
  
    return data;
  } catch (error) {
    return [];
  }
};

export default getContactNumber;
