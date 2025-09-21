import React from 'react';

export default function CancellationReissuePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Cancellation & Reissue Policy</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Bookme Ltd.</p>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">

            {/* Flight Policy */}
            <Section title="Flight">
              <PolicyList items={[
                "Bookme follows the respective airline's cancellation and reissue policy.",
                "Cancellation/re-issue requests must be confirmed and executed at least 48 hours prior to the scheduled departure time. Otherwise, a no-show charge may apply as per the airline's rules.",
                "Users can submit cancellation or reissue requests by sending an email to bookmebdltd@gmail.com.",
                "A standard service charge may apply in case of any cancellation or reissue requests.",
                "For the EMI method, the applicable EMI charge will be deducted from the payable amount.",
                "After cancellation, customers will be eligible for a refund only for the remaining amount after deducting all applicable charges. Refunds will be initiated (if applicable) upon a successful cancellation.",
                "Tickets/Tours/activities or any kind of bookings which is booked for blackout dates, long government holidays (2 days or 2 days+), and festival periods are non-refundable and non-cancellable.",
                "Refunds will be processed through Bookme's designated channels (Bank Transfer, bKash, or Cash), as determined by Bookme.",
                "For any kind of additional payment, a convenience charge will be applicable depending on the payment method."
              ]} />
            </Section>

            {/* Hotel Policy */}
            <Section title="Hotel">
              <PolicyList items={[
                "Bookme follows the respective property's cancellation policy.",
                "To cancel a booking, travelers must send an email to bookmebdltd@gmail.com for any cancellation request.",
                "Cancellation charges may apply depending on the property and the time of cancellation.",
                "Date change is not possible for any hotel booking. Travelers need to cancel the previous booking and rebook with the new date.",
                "For the EMI method, the applicable EMI charge will be deducted from the payable amount.",
                "After cancellation, customers will be eligible for a refund only for the remaining amount after deducting all applicable charges. Refunds will be initiated (if applicable) upon a successful cancellation.",
                "Tickets/Tours/activities or any kind of bookings which is booked for blackout dates, long government holidays (2 days or 2 days+), and festival periods are non-refundable and non-cancellable.",
                "Refunds will be processed through Bookme's designated channels (Bank Transfer, bKash, or Cash), as determined by Bookme."
              ]} />
            </Section>

            {/* Tour Policy */}
            <Section title="Tour">
              <PolicyList items={[
                "Bookme follows the respective tour operator's cancellation policy. Please check the given policy under each tour before booking to know more about applicable charges.",
                "To cancel or change dates, travelers are advised to email at bookmebdltd@gmail.com. The team will respond accordingly to resolve the issue.",
                "For the EMI method, the applicable EMI charge will be deducted from the payable amount.",
                "After cancellation, customers will be eligible for a refund only for the remaining amount after deducting all applicable charges. Refunds will be initiated (if applicable) upon a successful cancellation.",
                "Tickets/Tours/activities or any kind of bookings which is booked for blackout dates, long government holidays (2 days or 2 days+), and festival periods are non-refundable and non-cancellable.",
                "Refunds will be processed through Bookme's designated channels (Bank Transfer, bKash, or Cash), as determined by Bookme."
              ]} />
            </Section>

            {/* Visa Policy */}
            <Section title="Visa">
              <PolicyList items={[
                "Visa charges and service charges are strictly non-refundable, regardless of the outcome of the application process.",
                "Once submitted, the application cannot be canceled or modified."
              ]} />
            </Section>

            {/* Contact */}
            <Section title="Contact Information">
              <p className="text-gray-700 mb-6">
                For further queries regarding cancellation or reissue policies, please contact:
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

// Helper component for section styling
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

// Helper for bullet-style policies
function PolicyList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-700">{item}</p>
        </li>
      ))}
    </ul>
  );
}