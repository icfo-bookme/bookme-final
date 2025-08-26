import ActivityList from '@/app/components/Activities/ActivityList';
import VehicleList from '@/app/components/car/VehicleList';
import PackageListingSearch from '@/app/components/tourPackages/ListingSearch/Search';
import getCarList from '@/services/Car/getCarList';

export default async function page({ params }) {
  const id = params.id; 
  const data = await getCarList({ id });

  if (!data) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="md:px-4 py-8">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-12 px-4 md:px-0'>
          <PackageListingSearch />
        </div>
        <div className='bg-blue-100 mx-auto rounded-md'>
          <VehicleList vehicles={data} />
        </div>
      </div>
    </div>
  );
}
