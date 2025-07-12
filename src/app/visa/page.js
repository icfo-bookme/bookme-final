import getAllCountry from '@/services/visa/getAllCountry';
import getAllVisa from '@/services/visa/getAllVisa';
import VisaSearchForm from '../components/visa/visaSearchForm';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import getContactNumber from '@/services/tour/getContactNumber';
import { TbCurrentLocation } from 'react-icons/tb';
import { IoTime } from 'react-icons/io5';
import VisaAgency from '../components/pre-footer-content/VisaAgency';

export default async function Home() {
  let countryData = [];
  let visaData = [];
  let contactNumber = [];
  let loading = false;

  try {
    loading = true;
    const countryResult = await getAllCountry();
    const visaResult = await getAllVisa();
    const contactnumber = await getContactNumber();

    countryData = countryResult;
    visaData = visaResult;
    contactNumber = contactnumber;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    loading = false;
  }
  if (loading) {
    return (
      <div className="min-h-screen font-sans">
        {/* Background skeleton */}
        <div className="h-[60vh] bg-gray-300 animate-pulse" />

        {/* Search Form Skeleton */}
        <div className="bg-white py-8">
          <main className="container mx-auto px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
              <div className="w-32 h-10 bg-gray-300 rounded animate-pulse mx-auto" />
            </div>
          </main>
        </div>

        {/* Grid Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Popular Visa Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative bg-white shadow-md rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-300 rounded w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      {/* Background image section */}
      <div
        className="xs:h-[30vh] lg:h-[60vh]  w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-xl md:text-4xl font-bold -mt-3 lg:-mt-0 mb-1 lg:mb-4">Welcome to Book Me</h1>
          <p className="text-sm md:text-xl">Find Flights, Hotels, Visa & Holidays</p>
        </div>
      </div>

      {/* Search form */}
      <div className="bg-white py-8">
        <main className="container mx-auto px-4 flex flex-col items-center">
          <VisaSearchForm countryData={countryData} />
        </main>
      </div>

      {/* Visa Countries Grid */}
      <div className="lg:container mx-auto px-4 lg:py-12">
        <h2 className="text-xl -mt-3 lg:-mt-0  md:text-3xl font-bold text-center mb-8 text-black">Popular Visa Destinations</h2>
        <div className="flex justify-center items-center ">
          <div className='grid xs:grid-cols-2 grid-cols-1 gap-5 md:grid-cols-4'>
            {visaData.map((country, ind) => (
              <Link
                key={ind}
                href={`/visa/${country?.id}`}
                className="group block "
              >
                <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 h-full flex flex-col">
                  {/* Image with gradient overlay */}
                  <div className="relative h-36 lg:h-52 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${country?.image}`}
                      alt={country?.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={ind < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="pt-2 pl-2 lg:p-5 flex-1 flex flex-col">
                    {/* Country name */}
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">
                      {country?.name}
                    </h3>

                    {/* Description */}
                    {country?.properties?.map((property, idx) => (
                      <div key={idx} className="lg:mb-4 space-y-2 -mt-2">
                        <p className="text-gray-600 text-xs lg:text-sm leading-relaxed line-clamp-2">
                          {property?.property_summaries[2]?.value}
                        </p>

                        {/* Details grid */}
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-1 lg:gap-2">
                          <div className="flex items-center space-x-1 lg:space-x-2 p-1 lg:p-2 bg-gray-100 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 lg:w-7 lg:h-7 text-blue-950 flex-shrink-0"
                            >
                              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                              <path
                                fillRule="evenodd"
                                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className='flex gap-1 lg:gap-3 lg:block'>
                              <p className="text-xs text-gray-500">Currency: </p>
                              <p className="text-xs lg:text-sm font-medium text-gray-900 ">
                                {property?.property_summaries[0]?.value}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 lg:space-x-2 p-1 lg:p-2 bg-gray-100 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 lg:w-7 lg:h-7 text-blue-950 flex-shrink-0"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className='flex xs:block gap-1 lg:block'>
                              <p className="text-xs text-gray-500">Local Time: </p>
                              <p className="text-xs lg:text-sm font-medium text-gray-900 ">
                                {property?.property_summaries[1]?.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                   
                  </div>
                   {/* Price and CTA */}
                   <div className="mt-auto pt-3 lg:-mt-8 p-4 lg:pt-4 pb-2 lg:pb-4 border-t border-gray-100 flex justify-between items-center">
                      <div className='flex justify-between gap-1 lg:-mt-4 lg:gap-3 lg:block'>
                        <p className="text-xs text-gray-500">Starting from:</p>
                        <p className="text-sm lg:text-xl font-bold text-blue-600">
                          {Math.ceil(country?.properties[0]?.property_uinit[0]?.price[0]?.price).toLocaleString()} BDT
                        </p>
                      </div>
                      <button
                        style={{
                          background: "linear-gradient(90deg, #313881, #0678B4)",
                        }}
                        className="px-3 hidden py-1.5 lg:px-4 lg:py-2 hover:bg-blue-700 text-white text-xs lg:text-sm font-medium rounded-lg transition-colors duration-200 lg:flex items-center"
                      >
                        Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 lg:w-4 lg:h-4 ml-1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
      <VisaAgency />
    </div>
  );
}