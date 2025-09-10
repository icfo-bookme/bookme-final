import Image from "next/image";
import getCarModel from "@/services/Car/getCarModel";
import CarHeroSection from "../components/car/car/CarHeroSection";
import Faq from "../components/car/car/Faq";

export default async function Page() {
    const carModels = await getCarModel();

    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

    return (
        <div className="pt-12">
            <CarHeroSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-1">Our Popular Car Models</h2>
                <div className="w-20 h-1 mb-4 bg-[#0678B4] mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {carModels.map((model) => (
                        <div
                            key={model.id}
                            className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center text-center"
                        >
                            <div className="relative w-full h-48 mb-4">
                                {model.image ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${model.image}`}
                                        alt={model.model_name}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 100vw,
                                               (max-width: 1200px) 50vw,
                                               25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-medium text-gray-900">
                                {model.model_name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
            <Faq />
        </div>
    );
}
