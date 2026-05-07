'use client';
import { useState, useRef, useEffect } from 'react';
import useAuctionStore from '@/store/useAuctionStore';
import { Button } from '@/components/ui/Button';
import { 
  RefreshCcw, UserPlus, Upload, Trash2, Edit2, 
  AlertTriangle, Save, X, Plus, Image as ImageIcon,
  Shield, User
} from 'lucide-react';
import { CATEGORIES, ROLES, BASE_PRICES } from '@/constants/auction';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

export default function AdminPage() {
  const { 
    resetAuction, players, teams, deletePlayer, addPlayer, 
    updatePlayer, addTeam, updateTeam, deleteTeam, bulkAddPlayers,
    fetchInitialData, isLoading
  } = useAuctionStore();
  
  const [activeTab, setActiveTab] = useState('players'); // players, teams, settings
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // { type: 'player'|'team', data: {} }
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchInitialData();
  }, []);

  if (!hasMounted || isLoading) return <div className="py-24 text-center text-slate-500">Loading Admin...</div>;

  const handleReset = () => {
    resetAuction();
    setShowConfirmReset(false);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(), // Trim whitespace from headers
        complete: async (results) => {
          const parsedPlayers = results.data.map(row => {
            // Flexible name mapping
            const name = row['Full Name'] || row['Full name'] || row['name'] || row['Name'] || row['PLAYER NAME'] || row['Player Name'];
            
            // Flexible category mapping
            const categoryStr = row['Category'] || row['category'] || row['CATEGORY'] || '';
            const category = mapCategory(categoryStr);
            
            // Flexible role mapping
            const roleStr = row['Playing Role'] || row['Role'] || row['ROLE'] || row['playing role'] || '';
            
            // Flexible photo mapping
            const photo = row['Profile Photo'] || row['Photo'] || row['Image'] || row['IMAGE'] || '';

            return {
              name: name || 'Unknown Player',
              age: parseInt(row['Age'] || row['age'] || row['AGE']) || 25,
              role: mapRole(roleStr),
              category: category,
              basePrice: BASE_PRICES[category] || 100,
              profilePhoto: photo,
              status: 'Available',
              jerseyNumber: row['Jersey Number'] || row['Jersey'] || '',
              mobileNumber: row['Mobile Number'] || row['Mobile'] || ''
            };
          });
          
          const result = await bulkAddPlayers(parsedPlayers);
          setIsUploading(false);
          if (result && result.count > 0) {
            alert(`Successfully imported ${result.count} new players!`);
          } else {
            alert('No new players added. All players in the CSV are already present in the database.');
          }
        },
        error: (error) => {
          console.error('CSV Parsing Error:', error);
          setIsUploading(false);
          alert('Error parsing CSV. Please check the file format.');
        }
      });
    }
  };

  const mapCategory = (cat) => {
    if (!cat) return CATEGORIES.WARRIOR;
    const c = cat.toLowerCase();
    if (c.includes('elite')) return CATEGORIES.ELITE;
    if (c.includes('40')) return CATEGORIES.FORTY_PLUS;
    if (c.includes('under 21') || c.includes('u21')) return CATEGORIES.UNDER_21;
    return CATEGORIES.WARRIOR;
  };

  const mapRole = (role) => {
    if (!role) return ROLES.ALL_ROUNDER;
    const r = role.toLowerCase();
    if (r.includes('bat')) return ROLES.BATSMAN;
    if (r.includes('bowl')) return ROLES.BOWLER;
    if (r.includes('keeper')) return ROLES.WICKET_KEEPER;
    return ROLES.ALL_ROUNDER;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setEditingItem(prev => ({
            ...prev,
            data: { ...prev.data, profilePhoto: compressedDataUrl }
          }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem.type === 'player') {
        if (isAdding) {
          await addPlayer(editingItem.data);
        } else {
          await updatePlayer(editingItem.data);
        }
      } else {
        if (isAdding) {
          await addTeam(editingItem.data);
        } else {
          await updateTeam(editingItem.data);
        }
      }
      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save. The image might be too large or there was a network error.');
    }
  };

  const startAddPlayer = () => {
    setIsAdding(true);
    setEditingItem({
      type: 'player',
      data: {
        name: '',
        age: 20,
        role: ROLES.BATSMAN,
        category: CATEGORIES.WARRIOR,
        basePrice: BASE_PRICES[CATEGORIES.WARRIOR],
        status: 'Available',
        profilePhoto: '',
        jerseyNumber: '',
        mobileNumber: ''
      }
    });
  };

  const startAddTeam = () => {
    setIsAdding(true);
    setEditingItem({
      type: 'team',
      data: {
        name: '',
        owner: '',
        budgetRemaining: 10000,
        logo: ''
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">ADMIN PANEL</h1>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('players')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'players' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}
            >
              Players
            </button>
            <button 
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'teams' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}
            >
              Teams
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'}`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {activeTab === 'players' && (
          <div className="flex gap-4">
            <input 
              type="file" 
              ref={csvInputRef} 
              onChange={handleCSVUpload} 
              className="hidden" 
              accept=".csv"
            />
            <Button variant="outline" onClick={() => csvInputRef.current.click()} disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" /> {isUploading ? 'Uploading...' : 'Bulk Import CSV'}
            </Button>
            <Button variant="primary" onClick={startAddPlayer}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Player
            </Button>
          </div>
        )}
        {activeTab === 'teams' && (
          <Button variant="primary" onClick={startAddTeam}>
            <Shield className="w-4 h-4 mr-2" /> Add Team
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        
        {activeTab === 'players' && (
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" /> Player Management
              </h3>
              <span className="text-xs text-slate-500">{players.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase bg-white/5">
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Role / Cat</th>
                    <th className="px-6 py-4">Base Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {players.map((player) => (
                    <tr key={player.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={player.profilePhoto || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full bg-white/10" />
                          <div>
                            <p className="font-bold text-sm">{player.name}</p>
                            <p className="text-[10px] text-slate-500">Age: {player.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-white">{player.role}</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase">{player.category}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-amber-500">{(player.basePrice / 100).toFixed(1)} Cr</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${player.status === 'Sold' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                            onClick={() => {
                              setEditingItem({ type: 'player', data: player });
                              setIsAdding(false);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                            onClick={() => deletePlayer(player.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" /> Team Management
              </h3>
              <span className="text-xs text-slate-500">{teams.length} Teams</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase bg-white/5">
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Budget Remaining</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teams.map((team) => (
                    <tr key={team.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-xs">
                            {team.name[0]}
                          </div>
                          <p className="font-bold text-sm">{team.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{team.owner}</td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-500">{(team.budgetRemaining / 100).toFixed(1)} Cr</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                            onClick={() => {
                              setEditingItem({ type: 'team', data: team });
                              setIsAdding(false);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                            onClick={() => deleteTeam(team.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="glass-card border-red-900/50 p-8">
              <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> Danger Zone
              </h3>
              <p className="text-slate-400 text-sm mb-6">Resetting the auction will clear all current bids, team assignments, and history. This action cannot be undone.</p>
              
              {!showConfirmReset ? (
                <Button variant="danger" onClick={() => setShowConfirmReset(true)}>
                  <RefreshCcw className="w-4 h-4 mr-2" /> Reset Entire Auction
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant="danger" onClick={handleReset}>Confirm Full Reset</Button>
                  <Button variant="ghost" onClick={() => setShowConfirmReset(false)}>Cancel</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {isAdding ? <Plus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                {isAdding ? 'Add' : 'Edit'} {editingItem.type === 'player' ? 'Player' : 'Team'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {editingItem.type === 'player' ? (
                <>
                  <div className="col-span-2 flex justify-center mb-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center">
                        {editingItem.data.profilePhoto ? (
                          <img src={editingItem.data.profilePhoto} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-slate-600" />
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                      >
                        <Upload className="w-6 h-6 text-white" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.name}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Age</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.age}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, age: parseInt(e.target.value) } })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Playing Role</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.role}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, role: e.target.value } })}
                    >
                      {Object.values(ROLES).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setEditingItem({ 
                          ...editingItem, 
                          data: { 
                            ...editingItem.data, 
                            category: cat,
                            basePrice: BASE_PRICES[cat]
                          } 
                        });
                      }}
                    >
                      {Object.values(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Team Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.name}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Owner Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.owner}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, owner: e.target.value } })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Budget (Lakhs)</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                      value={editingItem.data.budgetRemaining}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, budgetRemaining: parseInt(e.target.value) } })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex gap-4">
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
              <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
