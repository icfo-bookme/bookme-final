import DashboardLayout from '@/app/layout';
import getFooterPolicy from '@/services/tour/getFooterPolicy';

const Page = async () => {
  let result = [];
  
  try {
    result = await getFooterPolicy();
    
  } catch (error) {
    console.error("Failed to fetch footer policy:", error);
    // You could also set some error state here if you want to display an error message
  }

  return (
   
     
        <div className='pt-[100px] text-black'>
          <h1 className='text-4xl text-center font-heading font-bold'>{result[1]?.name}</h1>
          
          {result.length > 0 ? (
            <p className='text-center'>{result[1]?.value}</p>
          ) : (
            <p className='text-center text-red-500'>Failed to load policy content</p>
          )}
        </div>
     
    
  );
};

export default Page;