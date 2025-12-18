
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { useAppContext } from '../App';

const PrivacyPolicy: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Card className="animate-fade-in max-w-4xl mx-auto text-left">
            <Link to="/" className="absolute top-6 left-6 text-purple-300 hover:text-white transition">&larr; {t('back')}</Link>
            <h2 className="text-3xl font-hindi font-bold mb-6 text-center">Privacy Policy</h2>

            <div className="space-y-6 text-purple-200 prose prose-invert prose-p:text-purple-200 prose-h3:text-white prose-h3:font-hindi prose-ul:text-purple-200">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>"Ok-E-store" ("we", "our") is committed to respecting and protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("Service").</p>

                <h3>1. Information We Collect</h3>
                <p>We primarily collect information from you to fulfill purchases and orders:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Contact and Purchase Information:</strong> When you purchase a product from our store, we collect your name, phone number, WhatsApp number, email, and shipping address.</li>
                    <li><strong>Payment Verification:</strong> To verify payments, we may collect Transaction IDs and payment screenshots.</li>
                    <li><strong>Device and Usage Data:</strong> Information such as your shopping cart and app settings may be stored locally on your device.</li>
                </ul>

                <h3>2. Use of Your Information</h3>
                <p>Your information is used for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>To process, fulfill, and deliver your store orders (both physical and digital).</li>
                    <li>To verify payments and activate premium memberships (if applicable).</li>
                    <li>To send you updates regarding order status (via WhatsApp or email).</li>
                    <li>To provide customer support and respond to support tickets raised by you.</li>
                    <li>To maintain and improve the functionality of the app.</li>
                </ul>

                <h3>3. Permissions</h3>
                <p>Our service may request the following permissions to enhance the shopping experience:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Camera:</strong> This permission is required only for uploading payment screenshots or setting your profile picture.</li>
                    <li><strong>Storage/Gallery:</strong> Access to the gallery may be required to upload payment screenshots or profile photos.</li>
                </ul>
                
                <h3>4. Sharing of Information</h3>
                <p>We do not sell or rent your personal information to third parties.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to respond to legal processes.</li>
                    <li><strong>Service Providers:</strong> Your name, address, and phone number may be shared with courier services for delivery purposes.</li>
                </ul>

                <h3>5. Data Security</h3>
                <p>We take the security of your data seriously. Your sensitive information (like cart data) is stored securely on your device. We do not store payment information directly; we only use verification proofs (screenshots/IDs).</p>

                <h3>6. Data Retention and Deletion</h3>
                <p>We retain your information as long as necessary to provide services. You can request to delete your data by using the "Delete Account" option in the "Profile" section of the app.</p>
                
                <h3>7. Children's Privacy</h3>
                <p>Our services are not intended for children under the age of 13.</p>

                <h3>8. Changes</h3>
                <p>We may update this policy from time to time. Continued use will be considered acceptance of the terms.</p>
                
                <h3>9. Contact Us</h3>
                <p>For any privacy-related questions, please use the 'Support' section within the app.</p>
            </div>
        </Card>
    );
};

export default PrivacyPolicy;
