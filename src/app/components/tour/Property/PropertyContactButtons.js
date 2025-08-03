import { FaPhone, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function PropertyContactButtons({ contactNumber }) {
  return (
    <>
      <div className="md:hidden block mt-[10px]">
        <a href={`tel:${contactNumber?.Phone}`} className="mr-[-1px] ml-0">
          <div className="phone-call md:w-[50px] md:h-[50px] w-[37px] h-[37px] ml-[15px]">
            <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[10px] ml-[10px]" />
          </div>
        </a>
      </div>
      <div className="md:hidden block mt-[10px]">
        <Link
          href={`https://wa.me/${contactNumber?.Phone}`}
          className="mx-[10px]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px] ml-[15px]">
            <FaWhatsapp className="w-[25px] h-[25px] text-white" />
          </span>
        </Link>
      </div>
      <div className="md:block hidden">
        <div className="flex justify-start md:justify-start">
          <div className="flex items-center">
            <span className="text-black md:text-[16px] text-[14px] font-bold">
              For instant service:{" "}
            </span>
            <div className="mr-[5px] mt-[10px]">
              <a
                href={`tel:${contactNumber?.Phone}`}
                className="mx-[10px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="phone-call md:w-[50px] md:h-[50px] w-[36px] h-[36px] ml-[15px]">
                  <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[8px] ml-[11px]" />
                </div>
              </a>
            </div>
            <div>
              <Link
                href={`https://wa.me/${contactNumber?.Phone}`}
                className="mx-[10px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px]">
                  <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}