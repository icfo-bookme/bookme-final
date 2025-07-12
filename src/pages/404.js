// pages/404.js
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-6">
      {/* Illustration */}
      <div className="w-64 h-64 mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="text-purple-500"
        >
          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.7 0-208-93.3-208-208S141.3 48 256 48s208 93.3 208 208-93.3 208-208 208zm0-320c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V176c0-17.7-14.3-32-32-32zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-600 mb-8 text-center">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      {/* Back to Home Button */}
      <Link href="/">
        <a className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300">
          Go Back Home
        </a>
      </Link>
    </div>
  );
}
