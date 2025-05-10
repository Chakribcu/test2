import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | KavinoRa";
  }, []);

  return (
    <div className="pt-12 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">Last Updated: July 1, 2023</p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              At KavinoRa, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, shipping address, and billing information when you make a purchase or create an account.</li>
              <li><strong>Contact Information:</strong> Email address when you subscribe to our newsletter or join our waitlist.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, including browsing patterns and device information.</li>
              <li><strong>Communications:</strong> Any messages you send us through our contact forms or customer service channels.</li>
            </ul>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>Processing and fulfilling your orders</li>
              <li>Sending you order confirmations and updates</li>
              <li>Providing customer support</li>
              <li>Sending you marketing communications (if you've opted in)</li>
              <li>Notifying you about product launches or availability</li>
              <li>Improving our website and product offerings</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities. These tools help us improve your experience on our website and deliver personalized content.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p>
              We may share your information with third parties in limited circumstances, such as:
            </p>
            <ul>
              <li>Service providers who help us operate our business</li>
              <li>Shipping partners to deliver your orders</li>
              <li>Payment processors to handle transactions</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have the right to:
            </p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Withdraw your consent at any time</li>
              <li>Request the transfer of your information to another entity</li>
            </ul>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">7. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:privacy@kavinora.com" className="text-teal hover:text-teal-dark">privacy@kavinora.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
