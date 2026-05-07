'use client';
import { useEffect, useState } from 'react';
import useAuctionStore from '@/store/useAuctionStore';
import { motion } from 'framer-motion';
import { Users, Wallet, Trophy } from 'lucide-react';

export default function TeamsPage() {
  const { teams, players, fetchInitialData, isLoading } = useAuctionStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchInitialData();
  }, []);

  if (!hasMounted || isLoading) return <div className="py-24 text-center text-slate-500">Loading Teams...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">FRANCHISE TEAMS</h1>
        <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-sm">Squad Overview & Budgets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team, index) => {
          const squad = players.filter(p => p.soldTo === team.id);
          
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center font-black text-3xl text-amber-500">
                    {team.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Budget Left</p>
                    <p className="text-2xl font-black text-white">{(team.budgetRemaining / 100).toFixed(1)} Cr</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                <p className="text-sm text-slate-500 mb-6">Owner: {team.owner}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Users className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">Squad</span>
                    </div>
                    <p className="text-lg font-bold">{squad.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Trophy className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">Reserved</span>
                    </div>
                    <p className="text-lg font-bold">{squad.filter(p => p.reserved).length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Signings</p>
                  <div className="flex flex-wrap gap-2">
                    {squad.slice(-3).map(p => (
                      <div key={p.id} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-medium">
                        {p.name.split(' ').pop()}
                      </div>
                    ))}
                    {squad.length === 0 && <p className="text-[10px] text-slate-600 italic">No players bought yet</p>}
                  </div>
                </div>
              </div>
              
              <div className="h-1 w-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(team.budgetRemaining / 10000) * 100}%` }}
                  className="h-full bg-amber-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
