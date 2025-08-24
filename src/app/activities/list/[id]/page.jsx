import ActivityList from '@/app/components/Activities/ActivityList';
import ActivityListingSearch from '@/app/components/Activities/ActivitySearch';
import PackageListingSearch from '@/app/components/tourPackages/ListingSearch/Search';
import TourList from '@/app/components/tourPackages/TourList';
import getActivitiesList from '@/services/Activities/getActivitiesList';



export default async function PackagesPage({ params }) {
  const { id } = params;

  const data = await getActivitiesList({ id });
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="  md:px-4 py-8">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-12 px-4 md:px-0'>
          <ActivityListingSearch />
        </div>
        <div className='bg-blue-100 mx-auto  rounded-md'>
          <ActivityList activities={data} />
        </div>
      </div>
    </div>
  );
}