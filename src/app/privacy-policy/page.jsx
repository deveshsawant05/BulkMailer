import React from 'react';
import Footer from "@/components/ui/footer";
import Logo from '@/components/logo';

const PrivacyPolicy = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2 ms-5">
                        <Logo />
                    </a>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                <p className="mb-4">BulkMailer is a bulk mailing platform. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose information about you when you use our services.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
                <p className="mb-4">We collect information about you when you use our services, including:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Profile Data: We use GitHub and Google OAuth login for profile data such as name, email, and profile picture. We do not access sensitive data.</li>
                </ul>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
                <p className="mb-4">The information collected is used solely for providing and improving our services. This includes:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Providing and maintaining our services</li>
                    <li>Improving, personalizing, and expanding our services</li>
                    <li>Communicating with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the service, and for marketing and promotional purposes</li>
                </ul>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Sharing Your Information</h2>
                <p className="mb-4">We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Service providers who perform services on our behalf</li>
                    <li>Compliance with laws and law enforcement requests</li>
                </ul>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Your Choices</h2>
                <p className="mb-4">You have choices regarding the collection, use, and sharing of your information, including:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Accessing and updating your account information</li>
                    <li>Opting out of receiving marketing communications from us</li>
                </ul>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at support@bulkmailer.com.</p>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;