"use client";

import React from 'react';
import Link from 'next/link';
import Logo from '../logo';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {

    return (
        <footer className="w-full py-14 pt-52">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="flex justify-center">
                        <Logo />
                    </Link>
                    <ul className="text-lg flex items-center justify-center flex-col gap-2 md:flex-row md:gap-12 transition-all duration-500 py-8 mb-10 border-b border-gray-200">
                        <li><Link href="/" className="text-gray-800 hover:text-gray-900">BulkMailer</Link></li>
                        <li><Link href="#" className="text-gray-800 hover:text-gray-900">Products</Link></li>
                        <li><Link href="#" className="text-gray-800 hover:text-gray-900">Resources</Link></li>
                        <li><Link href="#" className="text-gray-800 hover:text-gray-900">Blogs</Link></li>
                        <li><Link href="#" className="text-gray-800 hover:text-gray-900">Support</Link></li>
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
                    <span className="text-lg text-gray-500 text-center block">©<Link href="/">BulkMailer</Link> 2025, All rights reserved.</span>
                    <div className="text-sm text-muted-foreground text-center mt-4">
                        <Link href="/terms-of-service" className="hover:text-gray-900 mx-2">Terms of Service</Link>
                        <Link href="/privacy-policy" className="hover:text-gray-900 mx-2">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;