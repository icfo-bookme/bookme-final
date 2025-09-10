// components/Faq.jsx

export default function Faq() {
	return (
		<section className="dark:bg-gray-100 dark:text-gray-800">
			<div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
				<p className="p-2 text-sm font-medium tracking-wider text-center uppercase text-blue-600">
					How It Works
				</p>
				<h2 className="mb-2 text-2xl font-bold text-blue-950 leading-none text-center sm:text-3xl">
					Frequently Asked Questions
				</h2>
                <div className="w-20 mb-6 h-1 bg-[#0678B4] mx-auto"></div>
				<div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 text-blue-950">
					
					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What are the rental rates for your cars?
						</summary>
						<div className="px-4 pb-4">
							<p>
								We charge <strong>20 BDT per kilometer</strong> and <strong>250 BDT per hour</strong> (for the first 4 hours).
								After 4 hours, the hourly rate is reduced to <strong>220 BDT</strong>. A minimum booking duration of 4 hours is required.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Is a driver included in the car rental?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, all rentals include a professional driver. Self-driving is not currently available for safety and legal reasons in Bangladesh.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							What is the minimum rental duration?
						</summary>
						<div className="px-4 pb-4">
							<p>
								The minimum rental time is <strong>4 hours</strong>. Even if you use the car for less time, the 4-hour minimum charge will apply.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							How do I calculate my total rental cost?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Your cost depends on either the total kilometers or total hours — whichever is higher. For example, if you rent for 4 hours and drive 40 km:
							</p>
							<ul className="list-disc list-inside mt-2">
								<li>4 hours × 250 BDT = 1000 BDT</li>
								<li>40 km × 20 BDT = 800 BDT</li>
							</ul>
							<p className="mt-2">
								You will be charged <strong>1800 BDT</strong> since the hourly rate is higher in this case.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Do you provide fuel or do I need to pay for it?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Fuel cost is <strong>not included</strong> in the per kilometer and per hour rates. You will not need to refuel the car and not to pay for the fuel used during your rental.
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							Can I book a car for out-of-city trips?
						</summary>
						<div className="px-4 pb-4">
							<p>
								Yes, you can book for long-distance or out-of-city travel. Extra charges may apply based on distance, tolls, and driver accommodation (if overnight stay is required).
							</p>
						</div>
					</details>

					<details>
						<summary className="py-4 outline-none cursor-pointer focus:underline">
							How can I book or cancel a rental?
						</summary>
						<div className="px-4 pb-4">
							<p>
								You can book online through our website or call our hotline. Cancellations are free up to 2 hours before the trip; late cancellations may incur a charge.
							</p>
						</div>
					</details>

				</div>
			</div>
		</section>
	);
}
