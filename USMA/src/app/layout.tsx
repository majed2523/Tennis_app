import type { Metadata } from 'next';
import type React from 'react';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

// Load your Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

// 1. Export a metadata object
export const metadata: Metadata = {
  title: 'USMA Tennis Club', // 1. Set the title of your website
  description: 'USMA Tennis Club Website',
  icons: {
    // 2. Point to your icon in public/
    icon: '/download.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="bg-white text-gray-800">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
