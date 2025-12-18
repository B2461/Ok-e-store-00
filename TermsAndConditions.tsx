
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { useAppContext } from '../App';

const TermsAndConditions: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Card className="animate-fade-in max-w-4xl mx-auto text-left">
            <Link to="/" className="absolute top-6 left-6 text-purple-300 hover:text-white transition">&larr; {t('back')}</Link>
            <h2 className="text-3xl font-hindi font-bold mb-6 text-center">Terms & Conditions</h2>
            
            <div className="space-y-6 text-purple-200 prose prose-invert prose-p:text-purple-200 prose-h3:text-white prose-h3:font-hindi prose-ul:text-purple-200">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <h3>1. Introduction</h3>
                <p>Welcome to "Ok-E-store". By purchasing from our app, you fully agree to the terms and conditions outlined below.</p>

                <h3>2. Products and Services</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Physical Products:</strong> Such as Pujan Samagri, shoes, mobile accessories, etc.</li>
                    <li><strong>Digital Products:</strong> Such as E-books (PDF) and software downloadable content.</li>
                </ul>

                <h3>3. Payment Policy</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>All payments are accepted in advance (Prepaid) via UPI/QR code.</li>
                    <li>For Cash on Delivery (COD) orders, payment must be made in cash at the time of delivery.</li>
                    <li>It is mandatory to upload a correct payment screenshot and Transaction ID for prepaid order verification.</li>
                </ul>

                <h3>4. Return and Refund Policy</h3>
                <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/50 mb-4">
                    <p className="font-bold text-red-200 mb-2">Important Notice:</p>
                    <p>We strictly follow a specific return policy based on the type of product purchased.</p>
                </div>
                
                <h4 className="text-lg font-bold text-white mt-4">A. Digital Products (PDF E-books)</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>No Refund / No Return:</strong> All sales of digital products are final. Since these are downloadable files, <span className="text-red-400 font-bold">NO REFUND</span> will be issued once the access link or file has been sent to the customer under any circumstances.</li>
                </ul>

                <h4 className="text-lg font-bold text-white mt-4">B. Physical Products</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>1-Day (24 Hours) Replacement Policy:</strong> You have a strict 24-hour window from the time of delivery to report any issues with the product.</li>
                    <li><strong>Eligible Reasons:</strong> Returns or replacements are only accepted if the product received is <strong>damaged, broken, or incorrect</strong>.</li>
                    <li><strong>Mandatory Proof:</strong> An <strong>Unboxing Video</strong> is mandatory to claim a return or replacement. Without a clear unboxing video showing the original packaging and the defect, no claims will be entertained.</li>
                    <li><strong>Policy Lock:</strong> The option to request a return/refund within the app will be automatically <strong>LOCKED after 24 hours</strong> of delivery. No requests will be accepted after this period.</li>
                </ul>

                <h3>5. Shipping & Delivery</h3>
                <p>We deliver across India. Delivery may take 3 to 7 working days depending on your location. We are not responsible for delays caused by the courier company or natural calamities.</p>

                <h3>6. User Responsibility</h3>
                <p>You agree to provide your correct shipping address and phone number. We will not be responsible for non-delivery due to incorrect addresses provided by you, and no refund will be given in such cases. Uploading fake payment screenshots will result in your account being blocked.</p>

                <h3>7. Contact Us</h3>
                <p>For any questions or assistance regarding returns or products, please use the 'Support' section within the app.</p>
            </div>
        </Card>
    );
};

export default TermsAndConditions;
