'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Trophy, Zap, Shield } from 'lucide-react';

export const PlayerCard = ({ player }) => {
  if (!player) return null;

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Batsman': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Bowler': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'All Rounder': return <Trophy className="w-5 h-5 text-emerald-400" />;
      case 'Wicket Keeper': return <User className="w-5 h-5 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <motion.div
      key={player.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="relative w-full max-w-2xl mx-auto glass-card overflow-hidden group"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 transition-transform duration-500 group-hover:scale-110" />

      <div className="relative p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* Player Image */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full animate-pulse" />
          <img
            src={player.profilePhoto || 'https://via.placeholder.com/300?text=No+Photo'}
            alt={player.name}
            className="w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black font-black px-4 py-1 rounded-lg text-2xl shadow-lg transform rotate-3">
            #{player.jerseyNumber}
          </div>
        </div>

        {/* Player Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase mb-4 text-amber-400">
            {player.category}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            {player.name}
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              {getRoleIcon(player.role)}
              <span className="text-sm font-medium">{player.role}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm font-bold text-slate-400">AGE:</span>
              <span className="text-sm font-medium">{player.age}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Base Price</p>
              <p className="text-2xl font-black text-amber-500">{player.basePrice / 100} Cr</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
              <p className={`text-2xl font-black ${player.status === 'Available' ? 'text-blue-400' : player.status === 'Sold' ? 'text-emerald-400' : 'text-red-400'}`}>
                {player.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
