// app/Main.jsx
import PromotionsPage from "./PromotionsPage";



export default async function PromotionsMain() {
  const promotions = await fetch(
    'https://www.bookme.com.bd/admin/api/homepage/hot-package'
  );
console.log(promotions.data);
  return (
    <div>
      <PromotionsPage promotions={promotions} />
    </div>
  );
}
