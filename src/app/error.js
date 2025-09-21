// app/error.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";

const ErrorPage = ({ error, reset }) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
                <FiAlertCircle className="mx-auto text-6xl text-red-500 mb-4" />
                <h1 className="text-lg text-gray-800 dark:text-gray-100 mb-2">
                    Oops! We are unable to load the content right now. Please check your network or try again later.
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {error?.message || "An unexpected error occurred. Please try again."}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={reset}
                        className="px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
