'use client';
import AuctionDashboard from '@/components/auction/AuctionDashboard';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        {/* <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter gold-gradient">
          LIVE AUCTION
        </h1>
        <div className="h-1 w-24 bg-amber-500 mx-auto mb-6 rounded-full" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">
          TOURNAMENT SEASON 2026
        </p> */}
      </div>

      <AuctionDashboard />
    </div>
  );
}
