
import getPopularSummary from "@/services/tour/getPopularSummary"
import Tangour from "./Tangour"

export default async function TangourMain() {
  const data = (await getPopularSummary(1)).slice(0, 21)
  return (
   <div>
    <Tangour data={data} />
    </div>
  )
}