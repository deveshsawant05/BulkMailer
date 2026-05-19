import React from 'react';
import Footer from "@/components/ui/footer";
import Logo from '@/components/logo';

const TermsOfService = () => {
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
                <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
                <p className="mb-4">Welcome to BulkMailer! These terms of service outline the rules and regulations for the use of our platform.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
                <p className="mb-4">By accessing and using BulkMailer, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Modification of Terms</h2>
                <p className="mb-4">We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on our website. Your continued use of the service after any such changes constitutes your acceptance of the new terms.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
                <p className="mb-4">As a user of BulkMailer, you agree to:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Provide accurate and up-to-date information</li>
                    <li>Maintain the security of your account and password</li>
                    <li>Be responsible for all activities that occur under your account</li>
                    <li>Not use the service for any illegal or unauthorized purpose</li>
                </ul>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
                <p className="mb-4">The content, design, and code of BulkMailer are the intellectual property of BulkMailer and are protected by copyright, trademark, and other laws. You may not use, reproduce, or distribute any content from our platform without our prior written permission.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Termination</h2>
                <p className="mb-4">We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
                <p className="mb-4">In no event shall BulkMailer, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the service; (iv) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our service by any third party; (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the service; and/or (vi) the defamatory, offensive, or illegal conduct of any third party.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
                <p className="mb-4">These terms shall be governed and construed in accordance with the laws of the jurisdiction in which BulkMailer operates, without regard to its conflict of law provisions.</p>
                
                <hr className="my-4" />
                
                <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                <p className="mb-4">If you have any questions about these Terms of Service, please contact us at support@bulkmailer.com.</p>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;