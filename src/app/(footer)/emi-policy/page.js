import React from 'react';

export default function EMITermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">EMI Terms & Conditions</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Bookme Ltd.</p>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <p className="mb-8 text-gray-700 leading-relaxed border-l-4 border-blue-600 pl-4 italic">
              Bookme offers Equated Monthly Installment (EMI) facilities for eligible transactions. By using our EMI service, you agree to comply with these terms and conditions in addition to our general Terms & Conditions.
            </p>

            <Section title="EMI Terms & Conditions">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Eligible Services:</strong> EMI is available for Flights, Hotels, and Tours booked through Bookme.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Minimum Amount:</strong> The minimum payable amount to avail EMI must be BDT 5,000 or above.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Eligible Cards:</strong> EMI facility is only available for eligible credit cards issued by selected partner banks.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Tenure Options:</strong> Depending on your card-issuing bank, you may choose up to 12 months installment tenure.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Processing Time:</strong> It may take 3–5 working days for the installment plan to reflect on your credit card statement, depending on your bank.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Amount Blocking:</strong> Once the transaction is completed, the full booking amount will be blocked on your card until all installment repayments are completed.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Convenience Fee:</strong> A small Convenience Fee may be applied depending on the selected tenure. This fee is non-refundable.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-gray-800">Bank Policies:</strong> Bookme will always follow the respective Bank/Payment Service Providers policies to resolve any EMI-related issues.
                  </div>
                </li>
              </ul>
            </Section>

            <Section title="EMI Frequently Asked Questions (FAQ)">
              <div className="space-y-8">
                <FAQItem 
                  question="What cards are eligible?" 
                  answer="Only credit cards issued by our partnered banks are eligible for EMI. Please check with your bank or Bookme customer support for the full list of eligible cards." 
                />
                
                <FAQItem 
                  question="Can I use a debit card for EMI?" 
                  answer="No, EMI is available for credit cards only." 
                />
                
                <FAQItem 
                  question="Is there any additional interest applicable for EMI?" 
                  answer="Interest and charges depend on your card-issuing bank's policy. All applicable fees will be displayed before you confirm your booking." 
                />
                
                <FAQItem 
                  question="What are the available monthly installment plans (tenures)?" 
                  answer="Most banks offer 3, 6, 9, and 12-month installment options. Availability may vary depending on your bank." 
                />
                
                <FAQItem 
                  question="Do I need to submit any documents physically to avail EMI?" 
                  answer="No, the EMI process is handled automatically once you complete your online booking using an eligible credit card." 
                />
                
                <FAQItem 
                  question="Is early settlement of EMI possible? Will there be any charges?" 
                  answer="Yes, early settlement may be possible but it depends on your bank's policy. Additional charges may apply as per bank rules." 
                />
                
                <FAQItem 
                  question="Is EMI available on international credit cards?" 
                  answer="Currently, EMI is only available for local (Bangladeshi) credit cards from selected banks." 
                />
                
                <FAQItem 
                  question="What is the Convenience Fee?" 
                  answer="It is a minimal service charge applicable for EMI processing. This fee is non-refundable." 
                />
                
                <FAQItem 
                  question="What is the refund policy for EMI bookings?" 
                  answer="Refunds will follow the rules of the respective service provider (airlines, hotels, or tour operators). Please note that EMI charges and Convenience Fees are non-refundable." 
                />
              </div>
            </Section>

            <Section title="Contact Information">
              <p className="text-gray-700 mb-6">
                For further queries regarding EMI facilities, please contact:
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

// Helper component for FAQ items
function FAQItem({ question, answer }) {
  return (
    <div className="border-l-4 border-blue-100 pl-4">
      <h3 className="text-lg font-medium text-gray-800 flex items-start">
        <svg className="h-5 w-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {question}
      </h3>
      <p className="text-gray-700 mt-2 ml-7">{answer}</p>
    </div>
  );
}