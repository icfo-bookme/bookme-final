import IconShow from "@/services/tour/IconShow";

export default function PropertyAmenities({ summaries }) {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        {summaries.slice(0, 1).map((summary) => (
          <div
            key={summary.id}
            className="flex items-center text-blue-700"
          >
            <IconShow iconName={summary.icons.icon_name} />
            <span className="ml-2 text-sm text-blue-900">
              {summary.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          {summaries.slice(1, 3).map((summary) => (
            <div
              key={summary.id}
              className="flex items-center text-gray-700"
            >
              <IconShow iconName={summary.icons.icon_name} />
              <span className="ml-2 text-sm text-gray-900">
                {summary.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {summaries.slice(3, 4).map((summary) => (
          <div
            key={summary.id}
            className="flex items-center text-gray-700"
          >
            <div>
              <IconShow iconName={summary.icons.icon_name} />
            </div>
            <span className="ml-2 text-sm text-blue-900">
              {summary.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}