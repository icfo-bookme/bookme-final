"use client";
import { useForm } from 'react-hook-form';
import postPackageInfo from '@/services/tour/postPacageInfo';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
export default function VisaInfoSubmitForm({ property_name }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (value) => {
    setValue('number', value);
  };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting:", {
        ...data,
        category: "visa",
        property_name: property_name
      });

      const apiResponse = await postPackageInfo({
        ...data,
        category: "visa",
        property_name: property_name
      });

      if (apiResponse?.error) {
        throw new Error(apiResponse.error.message);
      }

      toast.success("Submitted Successfully");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Request Visa Assistance </h1>
      <p className="text-gray-600 mb-6">
        Please share your contact information.<br />
        Our team will get in touch with you shortly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Phone Number
          </label>
          <> <div className="max-w-[200px]">
            <PhoneInput
              country={'bd'}
              onChange={handlePhoneChange}
              inputClass={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
              containerClass="react-tel-input"
              buttonClass="react-tel-input-btn"
              inputProps={{
                name: 'number',
                id: 'number'
              }}
            />
          </div></>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="someone@example.com"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300`}
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}