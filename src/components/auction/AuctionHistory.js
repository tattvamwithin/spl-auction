'use client';
import { motion, AnimatePresence } from 'framer-motion';
import useAuctionStore from '../../store/useAuctionStore';

export const AuctionHistory = () => {
  const { auctionHistory } = useAuctionStore();

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-500 rounded-full" />
        Auction Log
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <AnimatePresence initial={false}>
          {auctionHistory.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8 italic">No players sold yet</p>
          ) : (
            auctionHistory.map((entry, index) => (
              <motion.div
                key={entry.timestamp}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-amber-500">{entry.playerName}</span>
                  <span className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Sold to <span className="text-blue-400 font-medium">{entry.teamName}</span></span>
                  <span className="font-black">{(entry.price / 100).toFixed(1)} Cr</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
