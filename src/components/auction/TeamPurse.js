'use client';
import { motion } from 'framer-motion';
import useAuctionStore from '../../store/useAuctionStore';

export const TeamPurse = () => {
  const { teams } = useAuctionStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-amber-500 rounded-full" />
        Team Purses
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass p-4 rounded-2xl flex justify-between items-center group hover:bg-white/5 transition-colors"
          >
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-amber-500">
                    {team.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{team.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{team.players?.length || 0} Players</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">{(team.budgetRemaining / 100).toFixed(1)} <span className="text-xs text-amber-500">Cr</span></p>
                  <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden ml-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(team.budgetRemaining / 10000) * 100}%` }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Player Squad List */}
              {team.players && team.players.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <div className="flex flex-wrap gap-1">
                    {team.players.map(p => (
                      <span key={p.id} className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full text-slate-400">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
