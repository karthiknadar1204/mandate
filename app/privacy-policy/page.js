import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Effective Date: 06 June 2025</p>
      <p className="text-gray-600 mb-4">Company: YesItaly</p>
      <p className="text-gray-600 mb-8">Contact: ravi@yesitaly.in</p>

      <p className="mb-6">
        At YesItaly, your privacy is of the utmost importance. This Privacy Policy explains how we collect, use, and protect your information when you use our Email Management and Task Assignment software integrated with Gmail.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          When you use our application, we may access the following information from your Google account, with your explicit consent:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email messages and metadata (via Gmail API)</li>
          <li>User email address and basic profile information</li>
        </ul>
        <p>We only access this data to provide core functionalities such as email sorting, summarization, and task assignment.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we access solely to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fetch emails to categorize and sort them</li>
          <li>Summarize emails for quicker task assignment</li>
          <li>Improve internal workflow and productivity</li>
        </ul>
        <p>We do not share, sell, or rent your data to any third party.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Google API Services User Data Policy Compliance</h2>
        <p>YesItaly's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
        <p>We do not store your Gmail content on our servers. All processing is done securely in-memory or temporarily cached for immediate use and cleared shortly after.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p>We implement strict access control, encryption, and secure OAuth 2.0 protocols to protect your data. Only authorized personnel have access to limited portions of user-related logs or summaries.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. User Consent and Control</h2>
        <p>You may revoke access to our app at any time through your Google Account's security settings at: <a href="https://myaccount.google.com/permissions" className="text-blue-600 hover:underline">https://myaccount.google.com/permissions</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
        <p>Our application may connect with Microsoft Outlook in addition to Gmail. No data is shared between services unless initiated by the user.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
        <p>We may update this policy from time to time. Any changes will be posted on this page with a revised effective date.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>If you have any questions or concerns about this policy or our practices, contact us at: <a href="mailto:ravi@yesitaly.in" className="text-blue-600 hover:underline">ravi@yesitaly.in</a></p>
      </section>
    </div>
  );
} 