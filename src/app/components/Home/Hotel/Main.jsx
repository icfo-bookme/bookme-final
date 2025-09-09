import getAllHotels from "@/services/hotel/getAllHotels"
import Hotel from "./Hotel"

export default async function HotelMain() {
  const data = (await getAllHotels()).slice(0, 21)
  return (
    <div>
      <Hotel data={data} />
    </div>
  )
}