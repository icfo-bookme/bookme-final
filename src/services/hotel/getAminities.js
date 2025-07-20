
const getAminities = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/aminities`
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getAminities;