import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Privacy Policy</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Bookme Ltd.</p>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <p className="mb-8 text-gray-700 leading-relaxed border-l-4 border-blue-600 pl-4 italic">
              Bookme Ltd. (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy describes how we collect, use, process, and protect your information when you use our website, mobile app, or any of our services. By using Bookme&apos;s services, you agree to the terms outlined in this Privacy Policy.
            </p>

            {/* Information We Collect */}
            <Section title="Information We Collect">
              <PolicyList items={[
                "Personal Information Provided by You: Name, gender, date of birth, contact details, passport/ID details, payment details, and any other booking-related information.",
                "Automatically Collected Information: Device details (IP address, browser type, operating system), log data, app usage, and location data (if enabled).",
                "Cookies and Tracking Technologies: Cookies are used to personalize content, improve user experience, and analyze usage. Users may disable cookies, but some services may not function properly."
              ]} />
            </Section>

            {/* How We Use Your Information */}
            <Section title="How We Use Your Information">
              <PolicyList items={[
                "To process bookings and reservations (flights, hotels, tours, visas, etc.).",
                "To share necessary details with third-party service providers (airlines, hotels, tour operators, visa authorities).",
                "To process payments securely through authorized payment gateways.",
                "To communicate booking confirmations, updates, or cancellations.",
                "To send promotional offers or marketing communications (unless you unsubscribe).",
                "To improve website, app, and customer experience.",
                "To prevent fraud, comply with legal obligations, and ensure safety."
              ]} />
            </Section>

            {/* Data Sharing and Disclosure */}
            <Section title="Data Sharing and Disclosure">
              <PolicyList items={[
                "We do not sell or trade your personal information without consent.",
                "Information may be shared with service providers (airlines, hotels, tour operators, visa authorities).",
                "Payment gateways and banks may process your payment details; Bookme does not store them permanently.",
                "Governmental or security agencies may access data if required by law.",
                "Third-party vendors may access limited information for cashback or promotional purposes.",
                "Profile photo uploads (if provided) are optional and not shared with third parties."
              ]} />
            </Section>

            {/* Data Security and Retention */}
            <Section title="Data Security and Retention">
              <p className="text-gray-700 leading-relaxed">
                We implement strict technical, administrative, and physical safeguards to protect personal data from unauthorized access, misuse, or disclosure. Payment details are usually collected directly by payment gateways and not stored by Bookme. If stored temporarily, data is encrypted and secured. Personal data is retained only for as long as necessary to provide services, comply with legal obligations, prevent fraud, resolve disputes, and enforce agreements.
              </p>
            </Section>

            {/* Children's Privacy */}
            <Section title="Children's Privacy">
              <p className="text-gray-700 leading-relaxed">
                Bookme services are not intended for individuals under the age of 13. We do not knowingly collect data from children. If a parent/guardian believes their child has provided information, they should contact us and we will delete it immediately.
              </p>
            </Section>

            {/* Your Rights */}
            <Section title="Your Rights">
              <PolicyList items={[
                "You have the right to access, update, or request deletion of your personal information.",
                "Users may request account deletion or data removal by contacting bookmebdltd@gmail.com.",
                "Promotional communications can be unsubscribed through provided links or app settings."
              ]} />
            </Section>

            {/* Changes to Privacy Policy */}
            <Section title="Changes to Privacy Policy">
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date. You are encouraged to review this policy regularly to stay informed about how we are protecting your data.
              </p>
            </Section>

            {/* Contact Us */}
            <Section title="Contact Us">
              <p className="text-gray-700 mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
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
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a href="tel:01967776777" className="text-blue-600 hover:underline">01967776777</a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-gray-700">IFCO Complex (2nd floor), GEC Circle, CDA Avenue, Chattogram</p>
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