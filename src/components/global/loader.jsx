"use client"
import { useEffect } from 'react';
import 'ldrs/mirage';
export const PrimaryLoader = () => {
    useEffect(() => {
        async function getLoader() {
            const { mirage } = await import('ldrs');
            mirage.register();
        }
        getLoader();
    }, []);

    return (
        <div className='h-max w-max'>
            <l-mirage color="var(--primary)"></l-mirage>
        </div>
    );
};
export const ButtonLoader = () => {
    useEffect(() => {
        async function getLoader() {
            const { mirage } = await import('ldrs');
            mirage.register();
        }
        getLoader();
    }, []);

    return (
        <div className='h-max w-max mt-[0.1rem]'>
            <l-mirage color="white" size={50}></l-mirage>
        </div>
    );
};
