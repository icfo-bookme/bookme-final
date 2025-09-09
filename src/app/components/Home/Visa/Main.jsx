// checked
import getAllVisa from "@/services/visa/getAllVisa"
import Visa from "./Visa"

export default async function VisaMain() {
    const data = (await getAllVisa()).slice(0, 21)

    return (
        <div>
            <Visa data={data} />
        </div>
    )
}