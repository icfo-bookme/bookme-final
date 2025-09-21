// components/Faq.jsx

export default function Faq() {
	return (
		<section className="dark:bg-gray-100 dark:text-gray-800">
			<div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
				<p className="p-2 text-sm font-medium tracking-wider text-center uppercase text-blue-600">
					How It Works
				</p>
				<h2 className="mb-2 text-2xl font-bold text-blue-950 leading-none text-center sm:text-3xl">
					Bookme – Frequently Asked Questions
				</h2>
				<div className="w-20 mb-6 h-1 bg-[#0678B4] mx-auto"></div>

				<div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 text-blue-950">

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							How do I make a booking with Bookme?
						</summary>
						<div className="px-4 pb-4">
							<p>
								You can easily book flights, hotels, ships, or tours using the Bookme app or website. Just select your preferred service, enter your travel details, and complete payment. Your booking confirmation will be available instantly.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What payment options does Bookme support?
						</summary>
						<div className="px-4 pb-4">
							<ul className="list-disc list-inside">
								<li>Debit/Credit Cards (Visa, Mastercard, Amex)</li>
								<li>Mobile Banking (bKash, Nagad, Rocket, Upay)</li>
								<li>Internet Banking</li>
								<li>EMI (for selected banks – subject to charges)</li>
							</ul>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							How will I receive my booking confirmation?
						</summary>
						<div className="px-4 pb-4">
							<p>
								After successful payment, your e-ticket or booking voucher will be sent to your registered email address.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I cancel or modify my booking?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Cancellations and modifications depend on the airline, hotel, or tour operator’s policy. Please email <a href="mailto:bookmebdltd@gmail.com" className="text-blue-600 underline">bookmebdltd@gmail.com</a> for any changes.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What is Bookme’s refund policy?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Refunds are processed after deducting applicable service charges and based on the supplier’s (airline/hotel/tour) rules. Refunds usually take 7–10 business days and are processed via bank transfer, bKash, or cash. EMI charges and some fees are non-refundable.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Is my personal data secure with Bookme?
						</summary>
						<div className="px-4 pb-4">
							<ul className="list-disc list-inside">
								<li>All personal and payment data is encrypted.</li>
								<li>Your data is never shared or sold without your consent.</li>
								<li>Data may be shared only with service providers or as required by law.</li>
							</ul>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Does Bookme charge extra fees?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, a service or convenience fee may apply based on the booking type and payment method. All charges are shown before you confirm payment.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I book on behalf of someone else?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, you can book for friends, family, or colleagues. Ensure their name, contact info, and ID documents (if required) are accurate.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What should I do if I face issues during booking or payment?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Contact our Customer Support Team:
								<br />
								📧 Email: <a href="mailto:bookmebdltd@gmail.com" className="text-blue-600 underline">bookmebdltd@gmail.com</a><br />
								📞 Hotline: <a href="tel:01967776777" className="text-blue-600 underline">01967776777</a>
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Does Bookme offer discounts or promotions?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes! Bookme offers regular deals, promo codes, cashback offers, and seasonal discounts. Follow our website and social media to stay updated.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I delete my account and personal data?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes. Please email <a href="mailto:bookmebdltd@gmail.com" className="text-blue-600 underline">bookmebdltd@gmail.com</a> to request account or data deletion. Some data may be retained for legal or regulatory purposes.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I change the name on my booking?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Usually, name changes are not allowed. Some airlines/hotels may permit corrections with a fee. Contact us for help.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Do I need a physical ticket?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Not usually. A digital e-ticket or voucher is enough except for ships. International flights require valid passport and visa.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What documents are required for international travel?
						</summary>
						<div className="px-4 pb-4">
							<p>
								A valid passport, visa, and any additional documents required by the destination (e.g., vaccination certificates).
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I request early check-in or late check-out at hotels?
						</summary>
						<div className="px-4 pb-4">
							<p>
								It depends on the hotel’s policy and availability. Extra charges may apply.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Are meals included in hotel bookings?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Some packages include meals (like breakfast), others don’t. Check the booking details before confirming.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I customize a tour package?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, for selected tours. Contact support to check availability.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What is the minimum group size for a tour?
						</summary>
						<div className="px-4 pb-4">
							<p>
								It varies by tour. Please check the package details or contact support.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What if my ship is delayed or cancelled?
						</summary>
						<div className="px-4 pb-4">
							<p>
								We’ll notify you and assist with alternatives or applicable refunds.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Are there surcharges for certain payment methods?
						</summary>
						<div className="px-4 pb-4">
							<p>
								A small fee may apply for methods like credit cards or EMI. All fees are shown before payment.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Does Bookme provide invoices for corporate bookings?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes. Request an invoice during booking or contact support.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What are Bookme’s customer support hours?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Support is available 7 days a week during business hours via hotline, email, and live chat.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Is live chat support available?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, through the Bookme website and app during working hours.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I book extra baggage for my flight?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, for many airlines you can add extra baggage during or after booking. Check your booking or contact support.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What should I do if I miss my flight, ship, or bus?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Refunds depend on the airline or operator policy. Contact us immediately for help.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Who do I contact for urgent issues after hours?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Email us at <a href="mailto:bookmebdltd@gmail.com" className="text-blue-600 underline">bookmebdltd@gmail.com</a>. We monitor emails for urgent travel-related concerns.
							</p>
						</div>
					</details>

				</div>
			</div>
		</section>
	);
}
