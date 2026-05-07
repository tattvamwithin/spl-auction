'use client';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { BID_INCREMENTS } from '../../constants/auction';
import useAuctionStore from '../../store/useAuctionStore';

export const BiddingControls = () => {
  const { currentBid, highestBidder, teams, placeBid, markSold, markUnsold, players, currentPlayerIndex } = useAuctionStore();
  const player = players[currentPlayerIndex];

  const handleBid = (teamId, amount) => {
    placeBid(teamId, amount);
  };

  const highestBidderName = teams.find(t => t.id === highestBidder)?.name || 'No Bids Yet';

  return (
    <div className="glass-card p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
        {/* Live Bid Status */}
        <div className="text-center md:text-left">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Current Bid</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={currentBid}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-6xl font-black"
            >
              {(currentBid || player.basePrice) / 100}
            </motion.span>
            <span className="text-2xl font-bold text-amber-500">Cr</span>
          </div>
        </div>

        <div className="h-16 w-px bg-white/10 hidden md:block" />

        <div className="text-center md:text-right">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Highest Bidder</p>
          <motion.p
            key={highestBidder}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-blue-400"
          >
            {highestBidderName}
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Team Grid (3 columns of space) */}
        <div className="lg:col-span-3 space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Place Bid For Team</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-h-[100px]">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => handleBid(team.id, currentBid === 0 ? 0 : 50)}
                disabled={team.budgetRemaining < (currentBid + 50)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  highestBidder === team.id 
                    ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-tighter opacity-70 mb-0.5 truncate">{team.name}</p>
                  <p className={`text-[10px] font-bold ${(team.budgetRemaining / 100) < 5 ? 'text-red-500' : 'opacity-60'}`}>
                    {(team.budgetRemaining / 100).toFixed(1)} Cr
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {BID_INCREMENTS.map(inc => (
              <Button
                key={inc}
                variant="outline"
                className="flex-1 py-2 text-sm font-bold bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => highestBidder && handleBid(highestBidder, inc)}
                disabled={!highestBidder}
              >
                +{inc / 100} Cr
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Actions (1 column of space) */}
        <div className="lg:col-span-1 flex flex-col gap-2 justify-end">
          <Button
            variant="danger"
            className="w-full py-4 text-lg font-black uppercase tracking-widest bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
            onClick={() => markUnsold()}
          >
            Unsold
          </Button>
          <Button
            variant="success"
            className="w-full py-4 text-lg font-black uppercase tracking-widest bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-20"
            disabled={!highestBidder}
            onClick={() => markSold(highestBidder, currentBid)}
          >
            Sold
          </Button>
        </div>
      </div>
    </div>
  );
};
