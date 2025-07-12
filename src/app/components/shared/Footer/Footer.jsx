"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Roboto } from "next/font/google";
import getContactNumber from '@/services/tour/getContactNumber';
const roboto = Roboto({ subsets: ["latin"], weight: ['400',], });

const Footer = () => {
    const [contactNumber, setContactNumber] = useState([]);
    useEffect(() => {
        async function fetchData() {
          try {
            const result = await getContactNumber();
            setContactNumber(result);
          } catch (error) {
            console.error("Error fetching contact number data:", error);
          }
        }
        fetchData();
      }, []);
    return (
        <footer className={` ${roboto.className} bg-[#25298c] text-white py-[20px]`}>
            <div className="footer-wrapper bg-[#25298c]">
                <div className="container py-8 w-[85%] mx-auto">
                    <div className="footer-area">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                               {/* Logo Section */}
                             
                              
                            <div className="single-footer-caption   items-center justify-center">
                                  <div>
                                <Image 
                                    src="/assets/images/logo.png"
                                    alt="logo" 
                                    width={180}
                                    height={100}
                                    className="max-w-full bg-white h-auto mt-2 rounded mx-auto md:mx-0 mb-4"
                                />
                                  
                               </div>
                                <p className="pera text-gray-100 pt-3">
                                  Travel enriches through culture <br /> and exploration.

                               </p>
                            </div>
                            {/* Company Section */}
                            <div className="single-footer-caption">
                                <div className="footer-tittle mb-6">
                                    <h1 className=" text-lg font-semibold text-white mb-4">Discover</h1>
                                    <div className='flex'>
                                        <ul className="listing space-y-[5px]">
                                            <li className="single-lsit">
                                                <Link href="/" className="text-white font-extralight  transition duration-300">Home</Link>
                                            </li>
                                            <li className="single-lsit">
                                                <Link href="/all-terms" className="text-white  transition duration-300">Terms</Link>
                                            </li>
                                            <li className="single-lsit">
                                                <Link href="/talent-&-culture" className="text-white transition duration-300">Talent & Culture</Link>
                                            </li>
                                            <br/>
                                        </ul>
                                        <ul className="listing space-y-[5px] ml-[40px]">
                                            <li className="single-lsit">
                                                <Link href="/refund-policy" className="text-white  transition duration-300">Refund Policy</Link>
                                            </li>
                                            <li className="single-lsit">
                                                <Link href="/emi-policy" className="text-white  transition duration-300">EMI Policy</Link>
                                            </li>
                                            <li className="single-lsit">
                                                <Link href="/privacy-policy" className="text-white transition duration-300">Privacy Policy</Link>
                                            </li>
                                            <br/>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Explore Section */}
                            <div className="single-footer-caption">
                                <div className="footer-tittle mb-6 flex flex-row gap-2 md:flex-col justify-start items-start md:items-center">
                                    <h4 className="title text-lg font-semibold text-white mb-4">Payment Methods</h4>
                                    <Image alt='payment' src={"/assets/images/gallery/payment-icons-footer.v1.0.0.svg"} width={130}height={60}/>
                                </div>
                            </div>

                         

                            {/* Contact Section */}
                            <div className="single-footer-caption">
                                <div className="footer-tittle mb-6">
                                    <h4 className="title text-lg font-semibold text-gray-200 mb-4">Contact</h4>
                                   <p className='text-white'>{contactNumber?.Phone?.slice(3)}</p>
                                   <p className='text-white mt-[20px]'>{contactNumber?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                   {/* Footer Middle Area
                   <div className="footer-middle-area text-gray-950 py-8 bg-white rounded-xl p-6 md:p-12 mt-20">
                       <div className="footer-body flex flex-col md:flex-row justify-between gap-10 md:gap-20 lg:gap-40 items-center">
                           <div className="footer-content space-y-4 flex-1 text-center md:text-left">
                               <div className="logo">
                                   <Image 
                                       src="/assets/images/tangular-logo.svg"
                                       alt="travello" 
                                       className="changeLogo mx-auto md:mx-0"
                                       width={180}
                                       height={100}
                                   />
                               </div>
                               <p className="pera text-gray-700">
                                   Travel is a transformative and enriching experience that allows individuals to explore new destinations, cultures, and landscapes.
                               </p>
                           </div>
                       </div>
                   </div> */}
                </div>
            </div>

            {/* Footer Bottom Area */}
            <div className="footer-bottom-area py-4 bg-[#25298c] text-center">
                <div className="container mx-auto">
                    <div className="d-flex justify-between gap-4 flex-wrap">
                        <p className="pera text-white">
                            © <span className="current-year">{new Date().getFullYear()}</span> Bookme. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;