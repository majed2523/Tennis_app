import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar'; // ✅ Import Navbar globally

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="bg-gray-900 text-white">
<<<<<<< HEAD
        <Navbar /> {/* ✅ Navbar is now persistent across all pages */}
=======
        <Navbar />
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
        <main>{children}</main>
      </body>
    </html>
  );
}
