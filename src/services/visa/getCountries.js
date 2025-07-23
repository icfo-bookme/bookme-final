const getCountries = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/countries`
    );
    const countries = await response.json(); 
    return { data: countries }; 
  } catch (error) {
    return { data: [] }; 
  }
};

export default getCountries;
