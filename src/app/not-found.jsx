// checked
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl mb-2">Oops! The page you are looking for was not found.</p>
      <p className="text-gray-600 mb-6">It might have been moved or deleted.</p>
      <Link href="/" className="text-blue-600 hover:underline text-lg">
        ← Back to Home
      </Link>
    </div>
  );
}
