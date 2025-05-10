import { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service | KavinoRa";
  }, []);

  return (
    <div className="pt-12 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">Last Updated: July 1, 2023</p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to KavinoRa! These Terms of Service ("Terms") govern your use of our website and the products we offer. By accessing our website or purchasing our products, you agree to be bound by these Terms.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
            <ul>
              <li><strong>"We", "us", "our"</strong> refers to KavinoRa.</li>
              <li><strong>"Website"</strong> refers to the website located at www.kavinora.com and all associated pages.</li>
              <li><strong>"Products"</strong> refers to the goods sold on our Website.</li>
              <li><strong>"You", "your"</strong> refers to the individual accessing the Website or purchasing Products.</li>
            </ul>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To use certain features of our Website or to make a purchase, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">4. Products and Ordering</h2>
            <p>
              Product descriptions, pricing, and availability are subject to change without notice. We reserve the right to limit quantities of Products sold. All orders are subject to acceptance and availability.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
            <p>
              We accept various payment methods as indicated on our Website. By providing payment information, you represent that you are authorized to use the designated payment method.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">6. Shipping and Delivery</h2>
            <p>
              Shipping costs and estimated delivery times are provided during the checkout process. We are not responsible for delays caused by shipping carriers or customs processing for international orders.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">7. Returns and Refunds</h2>
            <p>
              Our return and refund policy is detailed in our separate Returns Policy, which is incorporated into these Terms by reference.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
            <p>
              All content on our Website, including text, graphics, logos, images, and software, is the property of KavinoRa and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">9. User Conduct</h2>
            <p>
              When using our Website, you agree not to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Attempt to gain unauthorized access to our Website or systems</li>
              <li>Engage in any activity that interferes with the proper functioning of the Website</li>
              <li>Use the Website for any fraudulent or unlawful purpose</li>
            </ul>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">10. Disclaimer of Warranties</h2>
            <p>
              Our Website and Products are provided "as is" without any warranties, express or implied. We do not guarantee that our Website will be error-free or uninterrupted.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our Website or Products.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless KavinoRa and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses arising from your use of the Website or violation of these Terms.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">13. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Your continued use of the Website after such modifications constitutes your acceptance of the updated Terms.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
            </p>
            
            <h2 className="font-montserrat text-2xl font-semibold mt-8 mb-4">15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:legal@kavinora.com" className="text-teal hover:text-teal-dark">legal@kavinora.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
