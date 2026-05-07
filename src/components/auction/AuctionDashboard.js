'use client';
import { PlayerCard } from './PlayerCard';
import { BiddingControls } from './BiddingControls';
import { TeamPurse } from './TeamPurse';
import { AuctionHistory } from './AuctionHistory';
import useAuctionStore from '../../store/useAuctionStore';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

export default function AuctionDashboard() {
  const { players, currentPlayerIndex, nextPlayer, prevPlayer, auctionHistory, currentBid, fetchInitialData, isLoading } = useAuctionStore();
  const player = players[currentPlayerIndex];
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchInitialData();
  }, []);

  // Sound effects
  const playSound = (type) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(() => {}); // Ignore errors if sounds don't exist yet
  };

  // Timer logic
  useEffect(() => {
    setTimeLeft(30);
  }, [currentPlayerIndex, currentBid]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (auctionHistory.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#3b82f6', '#ffffff']
      });
      playSound('sold');
    }
  }, [auctionHistory.length]);

  if (!hasMounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Auction Data...</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-24 glass rounded-3xl">
        <h2 className="text-3xl font-bold mb-4">No Players in Pool</h2>
        <p className="text-slate-500 mb-8">Go to the Admin panel to add players or reset the auction.</p>
        <Button variant="primary" onClick={() => window.location.href = '/admin'}>Go to Admin</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Sidebar - Team Purses */}
      <div className="xl:col-span-3 order-2 xl:order-1">
        <TeamPurse />
      </div>

      {/* Center - Auction Arena */}
      <div className="xl:col-span-6 order-1 xl:order-2 space-y-8">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={prevPlayer} disabled={currentPlayerIndex === 0}>
            <ChevronLeft className="w-5 h-5 mr-2" /> Previous
          </Button>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Player Pool</span>
              <p className="text-sm font-bold text-white">{currentPlayerIndex + 1} / {players.length}</p>
            </div>

            <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-amber-500 text-amber-500'}`}>
              <span className="text-2xl font-black">{timeLeft}</span>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
              <p className="text-sm font-bold text-emerald-500">LIVE</p>
            </div>
          </div>

          <Button variant="ghost" onClick={nextPlayer} disabled={currentPlayerIndex === players.length - 1}>
            Next <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <PlayerCard player={player} />
        
        <BiddingControls />
      </div>

      {/* Right Sidebar - History */}
      <div className="xl:col-span-3 order-3 h-[600px] xl:h-auto">
        <AuctionHistory />
      </div>
    </div>
  );
}
