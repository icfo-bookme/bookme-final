"use client";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postPackageInfo from "@/services/tour/postPacageInfo";

const ContactForm = ({ propertyDetails, category, headline }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const emailData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.additionalInfo,
    };

    const apiData = {
      name: `${data.firstName} ${data.lastName}`,
      number: data.phoneNumber,
      address: data.address,
      additional_info: data.additionalInfo,
      property_name: propertyDetails,
      category: category
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICEID,
        process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATEID,
        emailData,
        process.env.NEXT_PUBLIC_EMAIL_JS_USERID
      );

      const apiResponse = await postPackageInfo(apiData);
      if (apiResponse.error) {
        toast.error("Failed to submit package info.");
      } else {
        toast.success("Submitted Successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg ">
      <h1 className="text-lg mb-2 font-semibold text-blue-800">{headline}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-black"
            >
              First Name <span className="text-red-700 text-xl">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { required: true })}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />
            {errors.firstName && (
              <span className="text-red-500">First name is required</span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-black"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />

          </div>


          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-black"
            >
              Phone Number <span className="text-red-700 text-xl">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="01xxxxxxxxx"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{11,}$/, 
                  message: "Phone number must be at least 11 digits and contain only numbers",
                },
              })}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />
            {errors.phoneNumber && (
              <span className="text-red-500">{errors.phoneNumber.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />

          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-black"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address")}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />

          </div>

          {/* Additional Info */}
          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium text-black"
            >
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              {...register("additionalInfo")}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            style={{
              background:
                "linear-gradient(90deg, #313881, #0678B4)",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
