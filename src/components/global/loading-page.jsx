import React from 'react';
import Logo from '@/components/logo';
import { PrimaryLoader } from './loader';

const LoadingPage = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-6 md:px-10">
            <div className="flex w-full max-w-sm flex-col gap-2">
                <a href="/" className="flex items-center gap-2 self-center font-medium">
                    <Logo />
                </a>
                <div className="w-full flex no-wrap justify-center mt-5">
                    <h2 className="font-bold">Loading</h2>
                    <PrimaryLoader />
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;