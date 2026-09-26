import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Compass,
  Search,
  Plus,
  Users,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  Flame,
  X,
  Check,
} from 'lucide-react';

interface ExploreGuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExploreGuildsModal: React.FC<ExploreGuildsModalProps> = ({ isOpen, onClose }) => {
  const { guilds, setActiveGuildId } = useClan();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Esports', 'Tactical Shooter', 'Cozy & Simulation', 'Speedrunning'];

  const filtered = guilds.filter(g => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory === 'All') return true;
    return g.gameCategory.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-text">
      <div className="bg-[#121622] border border-[#252d42] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2538] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">
                Discover Public Gaming Clans
              </h3>
              <p className="text-xs text-slate-400">
                Join verified esports communities, casual lounges, and speedrunning hubs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-[#1e2538] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Explore gaming communities (e.g. Cyber Strike, Valorant, Cozy Grove)..."
              className="w-full bg-[#181d2a] border border-[#252c3f] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#181d2a] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guilds Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {filtered.map(guild => (
            <div
              key={guild.id}
              className="p-4 rounded-2xl bg-[#161a26] border border-[#22283a] hover:border-indigo-500/60 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#1f2537] flex items-center justify-center text-2xl shrink-0 border border-slate-700">
                  {guild.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate font-display flex items-center gap-2">
                    <span>{guild.name}</span>
                    {guild.verified && (
                      <span className="text-[10px] text-cyan-400 font-normal">✓ Verified</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {guild.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="text-indigo-400 font-semibold">{guild.gameCategory}</span>
                    <span>·</span>
                    <span className="tabular-nums">{guild.memberCount.toLocaleString()} Members</span>
                    <span>·</span>
                    <span className="text-emerald-400 tabular-nums font-semibold">{guild.onlineCount.toLocaleString()} Online</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveGuildId(guild.id);
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 active:scale-95"
              >
                Join Clan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
