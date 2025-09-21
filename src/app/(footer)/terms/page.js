import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Terms & Conditions</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Bookme Ltd.</p>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <p className="mb-8 text-gray-700 leading-relaxed border-l-4 border-blue-600 pl-4 italic">
              Welcome to Bookme Limited (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing, browsing, or using our website, mobile application, or services, you (&quot;user&quot;, &quot;customer&quot;, &quot;traveler&quot;) agree to comply with and be legally bound by these Terms & Conditions. If you do not agree, you must not use our services.
            </p>

            <Section title="1. Introduction & Acceptance">
              <p className="text-gray-700 leading-relaxed">
                These Terms apply to all bookings made through Bookme, whether for flights, hotels, buses, ships, tours, or any other travel-related services.
              </p>
            </Section>

            <Section title="2. Definitions">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">&quot;Service Provider&quot;</strong> – Airlines, hotels, ship operators, tour operators, visa processing authorities, etc.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">&quot;User/Customer&quot;</strong> – Any individual or entity making a booking through Bookme.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">&quot;Booking&quot;</strong> – A confirmed reservation of flight, hotel, ship, tour, or other services.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">&quot;EMI&quot;</strong> – Equated Monthly Installment facility offered by eligible banks.
                  </div>
                </li>
              </ul>
            </Section>

            <Section title="3. Scope of Services">
              <p className="text-gray-700 leading-relaxed">
                Bookme acts as an intermediary between customers and service providers. We facilitate reservations, issue tickets, and provide booking confirmations. However, the ultimate responsibility of service fulfillment lies with the respective service provider.
              </p>
            </Section>

            <Section title="4. User Accounts & Responsibilities">
              <ul className="space-y-3">
                {[
                  "Users must provide accurate and complete information (name, passport details, contact number, email, etc.).",
                  "Users are responsible for maintaining confidentiality of login credentials.",
                  "Any misuse of account or false information may lead to booking cancellation without refund."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="5. Booking & Payment Terms">
              <ul className="space-y-3">
                {[
                  "All bookings are subject to availability and confirmation from the service provider.",
                  "Payments can be made via Debit/Credit Card, Mobile Banking (bKash, Nagad, Rocket, Upay), Internet Banking, and EMI (where applicable).",
                  "Bookme reserves the right to charge a service/convenience fee, which will be displayed before booking confirmation.",
                  "EMI transactions must comply with bank policies and Bookme's EMI Terms."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="6. Cancellations, Reissue & Refund Policy">
              <ul className="space-y-3">
                {[
                  "Cancellation and modification policies vary depending on the airline, hotel, or operator.",
                  "All cancellation/reissue requests must be emailed to bookmebdltd@gmail.com.",
                  "Refunds will be processed after deducting applicable service charges and supplier fees.",
                  "Refunds typically take 7–10 business days (bank dependent).",
                  "EMI-related charges are non-refundable."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="7. EMI Facility">
              <ul className="space-y-3">
                {[
                  "EMI is available for flights, hotels, and tours only.",
                  "Minimum transaction amount: BDT 5,000.",
                  "Eligible only on selected bank credit cards.",
                  "Tenure options: up to 12 months, depending on the issuing bank.",
                  "Processing time: 3–5 working days for installment reflection.",
                  "A non-refundable convenience fee may apply.",
                  "The entire booking amount will be blocked until full EMI settlement.",
                  "Early settlement depends on your bank's policy."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="8. Hotel, Flight, Tour & Visa Specific Terms">
              <ul className="space-y-3">
                {[
                  "Flights: Passenger names must match exactly with passport/NID. Any mismatch may lead to denied boarding.",
                  "Hotels: Check-in/check-out policies are determined by the hotel. Local taxes may apply.",
                  "Tours: Package inclusions/exclusions are as mentioned in the package details.",
                  "Visa Services: Bookme acts as a facilitator only; visa issuance is at the discretion of the embassy/consulate."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="9. Promotions, Coupons & Discounts">
              <ul className="space-y-3">
                {[
                  "Promo codes and discounts cannot be combined unless specifically mentioned.",
                  "Discounts are subject to terms of campaigns and may be withdrawn without prior notice.",
                  "Cashback is subject to processing time by respective banks/payment providers."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="10. Travel Documents & Responsibilities">
              <ul className="space-y-3">
                {[
                  "Customers are solely responsible for valid travel documents (passport, visa, vaccination, etc.).",
                  "Bookme will not be held liable for denied boarding, visa rejection, or entry refusal at destination."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="11. Liability & Force Majeure">
              <p className="text-gray-700 leading-relaxed mb-4">
                Bookme shall not be liable for service disruptions caused by:
              </p>
              <ul className="space-y-3">
                {[
                  "Natural disasters, strikes, political unrest, technical failures, or government restrictions.",
                  "Any dispute regarding flight delay, baggage, or accommodation must be addressed directly with the service provider."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="12. Data Protection & Privacy">
              <ul className="space-y-3">
                {[
                  "Bookme respects your privacy and protects personal information under its Privacy Policy.",
                  "Data may be shared only with service providers for booking purposes, or with government authorities if legally required.",
                  "Bookme does not store sensitive payment details (credit/debit card numbers)."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="13. Changes & Amendments">
              <p className="text-gray-700 leading-relaxed">
                Bookme reserves the right to modify these Terms at any time. Updated Terms will be posted on the website/app with a revised effective date. Continued use of Bookmes services indicates acceptance of updated Terms.
              </p>
            </Section>

            <Section title="14. Governing Law & Jurisdiction">
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by the laws of Bangladesh. Any disputes shall fall under the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
              </p>
            </Section>

            <Section title="15. Contact Information">
              <p className="text-gray-700 mb-6">
                For queries, complaints, or cancellation requests, please contact:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href="mailto:bookmebdltd@gmail.com" className="text-blue-600 hover:underline">bookmebdltd@gmail.com</a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Hotline</p>
                      <a href="tel:01967776777" className="text-blue-600 hover:underline">01967776777</a>
                    </div>
                  </li>
                </ul>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent section styling
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
        <svg className="h-5 w-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {title}
      </h2>
      {children}
    </div>
  );
}