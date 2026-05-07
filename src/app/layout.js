import { Navbar } from '@/components/ui/Navbar';
import './globals.css';

export const metadata = {
  title: 'Cricket Auction | Real-Time Bidding',
  description: 'A premium real-time cricket auction platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0b] text-white min-h-screen">
        <Navbar />
        <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
