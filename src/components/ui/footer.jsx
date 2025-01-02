import React from 'react';
import Logo from '../logo';

const Footer = () => {
    return (
        <footer className="w-full py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <a href="https://pagedone.io/" className="flex justify-center">
                        <Logo />
                    </a>
                    <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-16 mb-10 border-b border-gray-200">
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Pagedone</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Products</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Resources</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Blogs</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Support</a></li>
                    </ul>
                    <div className="flex space-x-10 justify-center items-center mb-14">
                        <a href="#" className="block text-gray-900 transition-all duration-500 hover:text-indigo-600">
                            {/* Add icon or text here */}
                        </a>
                        <a href="#" className="block text-gray-900 transition-all duration-500 hover:text-indigo-600">
                            {/* Add icon or text here */}
                        </a>
                        <a href="#" className="block text-gray-900 transition-all duration-500 hover:text-indigo-600">
                            {/* Add icon or text here */}
                        </a>
                        <a href="#" className="block text-gray-900 transition-all duration-500 hover:text-indigo-600">
                            {/* Add icon or text here */}
                        </a>
                    </div>
                    <span className="text-lg text-gray-500 text-center block">©<a href="/">BulkMailer</a> 2025, All rights reserved.</span>
                    <div className="text-sm text-muted-foreground text-center mt-4">
                        <a href="/terms-of-service" className="hover:text-gray-900 mx-2">Terms of Service</a>
                        <a href="/privacy-policy" className="hover:text-gray-900 mx-2">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;