const getFooterPolicy = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/footer-policies `,
        {
          cache: "no-store", // Ensure no caching
        }
      );
      const data = await res.json();
             
    return data;
      
       

    } catch (error) {
      return [];
    }
  };
  
  export default getFooterPolicy;
  