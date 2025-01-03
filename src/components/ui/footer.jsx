import React from 'react';
import Logo from '../logo';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {

    return (
        <footer className="w-full py-14 pt-52">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <a href="/" className="flex justify-center">
                        <Logo />
                    </a>
                    <ul className="text-lg flex items-center justify-center flex-col gap-2 md:flex-row md:gap-12 transition-all duration-500 py-8 mb-10 border-b border-gray-200">
                        <li><a href="/" className="text-gray-800 hover:text-gray-900">BulkMailer</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Products</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Resources</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Blogs</a></li>
                        <li><a href="#" className="text-gray-800 hover:text-gray-900">Support</a></li>
                    </ul>
                    <div className="flex space-x-10 justify-center items-center mb-14">
                        <a href="https://facebook.com/deveshsawant05" className="block text-gray-900 transition-all duration-500 hover:text-[--primary]">  
                            <Facebook />
                        </a>
                        <a href="https://twitter.com/deveshsawant05" className="block text-gray-900 transition-all duration-500 hover:text-[--primary]">   
                            <Twitter />
                        </a>
                        <a href="https://instagram.com/deveshsawant05" className="block text-gray-900 transition-all duration-500 hover:text-[--primary]"> 
                            <Instagram />
                        </a>
                        <a href="https://linkedin.com/in/deveshsawant05" className="block text-gray-900 transition-all duration-500 hover:text-[--primary]">  
                            <LinkedIn />
                        </a>
                    </div>
                    <span className="text-lg text-gray-500 text-center block">©<a href="/">BulkMailer</a> 2025, All rights reserved.</span>
                    <div className="text-sm text-muted-foreground text-center mt-4">
                        <a href="/terms-of-service" className="hover:text-gray-900 mx-2">Terms of Service</a>
                        <a href="https://bulkmailer2025.vercel.app/privacy-policy" className="hover:text-gray-900 mx-2">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;