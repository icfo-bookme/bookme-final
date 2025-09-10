
import CarRentalSearchBar from '@/app/components/car/CarRentalSearchBar';
import VehicleList from '@/app/components/car/VehicleList';
import getCarBrand from '@/services/Car/getCarBrand';
import getCarList from '@/services/Car/getCarList';
import getCarModel from '@/services/Car/getCarModel';
import getDestination from '@/services/Car/getDestination';

export default async function page({ params, searchParams }) {
  const id = params.id; 
  const dropoffId = searchParams.dropoff;
  const pickupDate = searchParams.date;
  const pickupTime = searchParams.time;
  
  const data = await getCarList({ id });
  const brands = await getCarBrand();
  const models = await getCarModel();
  const destination = await getDestination();
  
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  // Prepare initial parameters for the search bar
  const initialSearchParams = {
    pickupId: parseInt(id),
    dropoffId: parseInt(dropoffId),
    pickupDate: pickupDate,
    pickupTime: pickupTime
  };

  return (
    <div className="md:px-4 py-8 bg-blue-100">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-5 md:w-[97%] mx-auto px-4 mb-6 md:mb-0 md:px-0'>
          <CarRentalSearchBar 
            locationsData={destination} 
            initialParams={initialSearchParams} 
          />
        </div>
        <div className='bg-blue-100  mx-auto rounded-md '>
          <VehicleList vehicles={data} models={models} brands={brands} />
        </div>
      </div>
    </div>
  );
}