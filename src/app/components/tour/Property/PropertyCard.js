"use client";

import Image from "next/image";
import Link from "next/link";
import PropertyAmenities from "./PropertyAmenities";
import PropertyContactButtons from "./PropertyContactButtons";

export default function PropertyCard({ property, index, onCardClick }) {
 const slugify = (str) =>
  str
    .trim()
    .replace(/\s+/g, '-')        
    .replace(/[^\w\u0980-\u09FF\-\(\)]+/g, '')  
    .replace(/\-\-+/g, '-')     

const containsBangla = (text) => /[\u0980-\u09FF]/.test(text);

const propertyName = property.property_name;

const propertySlug = containsBangla(propertyName)
  ? slugify(propertyName)
  : slugify(propertyName);

  return (
    <div key={property.property_id} data-index={index} className="mb-5">
      <div className="shadow-custom flex flex-col lg:flex-row gap-5 pt-5 pl-5 pr-5 pb-0 rounded bg-white relative">
        {property.discout && (
          <div className="absolute top-5 right-5 lg:top-5 lg:left-[315px] z-10 w-14 h-14 p-2 text-white text-center font-semibold text-sm bg-red-700 rounded-full flex items-center justify-center">
            {property.discout}
          </div>
        )}
        
        <div className="md:min-w-[400px] min-w-0 md:min-h-[300px] min-h-0 relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
            alt={property.property_name}
            width={500}
            height={300}
            className="object-cover w-full md:w-[300px] md:h-[230px] h-[200px] mx-auto"
          />
        </div>

        <div className="flex flex-col w-full pr-4 pb-4">
          <Link
            href={`/Property/${propertySlug}/${property.property_id}`}
            className="cursor-pointer"
            onClick={() => onCardClick(index)}
          >
            <h1 className="font-heading font-semibold text-lg text-[#00026E]">
              {property.property_name}
            </h1>
          </Link>

          <h1 className="font-normal text-sm text-[#00026E] text-right md:mb-0 mb-[20px]">
            Starting from <br />
            <span className="font-bold text-lg text-blue-900">
              {(() => {
                const prices =
                  property.property_uinit?.flatMap((unit) =>
                    unit.price?.map((priceObj) => priceObj.price)
                  ) || [];
                return prices.length > 0
                  ? `${Math.min(...prices).toLocaleString()} TK`
                  : "N/A";
              })()}
            </span>
          </h1>

          {property.property_summaries && (
            <div className="flex flex-col gap-3">
              <PropertyAmenities summaries={property.property_summaries} />
              
              <div className="flex flex-row flex-wrap md:justify-between justify-start items-center gap-[5px] sm:gap-[25px]">
                <div className="flex">
                  <div className="mr-[6px]">
                    <Link
                      href={`/Property/${propertySlug}/${property.property_id}`}
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)",
                      }}
                      className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 px-[5px] py-2 text-white font-semibold rounded-md"
                      onClick={() => onCardClick(index)}
                    >
                      See Details
                    </Link>
                  </div>

                  <div>
                    <Link
                      href={`/Property/${propertySlug}/${property.property_id}`}
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)",
                      }}
                      className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 py-2 px-[5px] text-white font-semibold rounded-md"
                      onClick={() => onCardClick(index)}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
                
                <PropertyContactButtons contactNumber={property.contactNumber} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}