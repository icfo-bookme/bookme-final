// app/Main.jsx
import PromotionsPage from "../PromotionsPage";

const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 300 }, // optional for ISR (revalidate every 5 mins)
    });
    clearTimeout(timeoutId);
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Fetch error:", error);
    return []; // return empty array on error
  }
};

export default async function Main() {
  const promotions = await fetchWithTimeout(
    'https://www.bookme.com.bd/admin/api/homepage/hot-package'
  );

  return (
    <div>
      <PromotionsPage promotions={promotions} />
    </div>
  );
}
