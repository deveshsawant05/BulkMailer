import React from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';

const gentySans = localFont({
    src: '../fonts/GentySans-Regular.woff2',
    weight: '400',
});

const Logo = () => {
    return (
        <div className="flex gap-2 nowrap items-center">
            <Image src="/BulkMailer.svg" alt="BulkMailer Logo" width={40} height={40} />
            <span className={`${gentySans.className} text-3xl items-center`}>
                <span className="">Bulk</span>
                <span className="text-[--primary]">Mailer</span>
            </span>
        </div>
    );
};

export default Logo;