'use client';
import { useState, useEffect } from 'react';
import useAuctionStore from '@/store/useAuctionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, User, Zap, Shield, Trophy } from 'lucide-react';
import { CATEGORIES, ROLES } from '@/constants/auction';

export default function PlayersPage() {
  const { players, teams, fetchInitialData, isLoading } = useAuctionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchInitialData();
  }, []);

  if (!hasMounted || isLoading) return <div className="py-24 text-center text-slate-500">Loading Players...</div>;

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || p.role === roleFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesRole && matchesCategory;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Batsman': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Bowler': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'All Rounder': return <Trophy className="w-4 h-4 text-emerald-400" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter">PLAYER POOL</h1>
          <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-sm">Explore and Filter Candidates</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search player..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            {Object.values(ROLES).map(role => <option key={role} value={role}>{role}</option>)}
          </select>

          <select
            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPlayers.map((player) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors border border-white/5 group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                <img 
                  src={player.profilePhoto || 'https://via.placeholder.com/150?text=No+Photo'} 
                  alt={player.name} 
                  className="w-full h-full object-cover" 
                />
                {player.status === 'Sold' && (
                  <div className="absolute inset-0 bg-emerald-500/60 flex items-center justify-center">
                    <span className="text-[8px] font-black uppercase text-white rotate-[-20deg]">SOLD</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate group-hover:text-amber-500 transition-colors">{player.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(player.role)}
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{player.role}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-amber-500/80 uppercase">{player.category}</span>
                  <span className="text-xs font-black">{(player.basePrice / 100)} Cr</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-24 glass rounded-3xl">
          <p className="text-slate-500 italic">No players found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
