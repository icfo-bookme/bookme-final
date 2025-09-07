"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Slugify utility
const slugify = (str) =>
  str
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0980-\u09FF\-\(\)]+/g, "")
    .replace(/\-\-+/g, "-");

export default function Tab({ models }) {
  const pathname = usePathname();

  const currentPropertyId = useMemo(() => {
    return pathname?.split("/").pop();
  }, [pathname]);

  const links = useMemo(() => {
    return models?.map((model) => {
      const slug = slugify(model.property_name);
      return {
        ...model,
        slug,
        href: `/${slug}/${model.property_id}`,
        isActive: model.property_id.toString() === currentPropertyId,
      };
    });
  }, [models, currentPropertyId]);

  return (
    <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
      <div className="flex space-x-4 border-b overflow-x-auto">
        {links.map(({ id, href, model_name, isActive }) => (
          <Link
            key={id}
            href={href}
            prefetch
            className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            {model_name}
          </Link>
        ))}
      </div>
    </div>
  );
}
