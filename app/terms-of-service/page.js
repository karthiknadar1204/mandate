import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Effective Date: 06 June 2025</p>
      <p className="text-gray-600 mb-4">Company: YesItaly</p>
      <p className="text-gray-600 mb-8">Contact: ravi@yesitaly.in</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using YesItaly's email management and task assignment application, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p className="mb-4">YesItaly provides an internal tool that connects to Gmail and Microsoft Outlook to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access and summarize emails</li>
          <li>Automatically categorize emails</li>
          <li>Assist in task allocation based on email content</li>
        </ul>
        <p>This tool is designed for internal business productivity only.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
        <p>You must be at least 18 years old and authorized to act on behalf of your organization to use the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Google and Microsoft API Usage</h2>
        <p className="mb-4">The Service uses APIs from Google and Microsoft to access your email data. By using this Service, you also agree to their respective Terms of Service and Privacy Policies:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Terms</li>
          <li>Microsoft Services Agreement</li>
        </ul>
        <p>We comply with the Google API Services User Data Policy, including the Limited Use requirements.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
        <p className="mb-4">You are responsible for:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Authorizing your own accounts for integration</li>
          <li>Ensuring no unauthorized use of the Service under your credentials</li>
          <li>Ensuring all data provided through Gmail or Outlook is legal and non-malicious</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Data Handling and Privacy</h2>
        <p className="mb-4">We do NOT store Gmail or Outlook content on our servers. Data is used solely for:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Categorizing emails</li>
          <li>Summarizing content</li>
          <li>Assisting in internal workflow</li>
        </ul>
        <p>See our full <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for details.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Modifications to the Service</h2>
        <p>We may modify, suspend, or discontinue the Service at any time without notice. We are not liable to you or any third party for such changes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
        <p>We may suspend or terminate your access to the Service at our sole discretion, especially if you violate these terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
        <p>The Service is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages resulting from your use of the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Indemnity</h2>
        <p>You agree to indemnify and hold harmless YesItaly and its affiliates from any claims arising out of your use of the Service or your violation of these terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p>These Terms are governed by the laws of India. Any disputes will be resolved under the jurisdiction of courts located in Delhi.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
        <p>For any questions or concerns, contact: <a href="mailto:ravi@yesitaly.in" className="text-blue-600 hover:underline">ravi@yesitaly.in</a></p>
      </section>
    </div>
  );
} 