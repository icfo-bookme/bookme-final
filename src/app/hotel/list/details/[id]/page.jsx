// app/hotel/list/details/[id]/page.jsx
export default function HotelDetailsPage({ params }) {
  return (
    <div className="pt-96 min-h-screen bg-slate-500">
      <h1>Hotel ID: {params.id}</h1>
    </div>
  );
}