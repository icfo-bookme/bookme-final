import PackageListingSearch from '@/app/components/tourPackages/ListingSearch/Search';
import TourList from '@/app/components/tourPackages/TourList';
import getTourList from '@/services/packages/getPropertyList';


export default async function PackagesPage({ params }) {
  const { id } = params;

  const data = await getTourList({ id });
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="  md:px-4 py-8">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-12 px-4 md:px-0'>
          <PackageListingSearch />
        </div>
        <div className='bg-blue-100 mx-auto  rounded-md'>
          <TourList tours={data} />
        </div>
      </div>
    </div>
  );
}