import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-8 text-center text-gray-600 py-4">
            <p>
                由 <Link href="https://techtrever.site" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">techtrever.site</Link> 開發
            </p>
            <p className="mt-2 text-sm">
                僅供教學和學習使用。不作為投資建議，使用時請自行承擔風險。
            </p>
        </footer>
    );
}