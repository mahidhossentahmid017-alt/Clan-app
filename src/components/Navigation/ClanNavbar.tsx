import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Compass,
  MessageSquare,
  Users,
  Cpu,
  Gamepad2,
  Sparkles,
  Flame,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';

interface ClanNavbarProps {
  currentView: 'community' | 'feed' | 'profile';
  setCurrentView: (view: 'community' | 'feed' | 'profile') => void;
  onOpenExplore: () => void;
}

export const ClanNavbar: React.FC<ClanNavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenExplore,
}) => {
  const {
    currentUser,
    setCurrentUser,
    profiles,
    isLowResourceMode,
    toggleLowResourceMode,
    inspectProfile,
  } = useClan();

  const [showSwitchUser, setShowSwitchUser] = useState(false);

  return (
    <header className="h-14 bg-[#0d1017] border-b border-[#1e2230] px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-cyan-500/20">
            C
          </div>
          <span className="text-base font-extrabold tracking-tight text-white font-display">
            CLAN
          </span>
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Social & Esports
          </span>
        </div>
      </div>

      {/* Main Mode Navigation (Facebook Feed vs Discord Community Guilds) */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setCurrentView('feed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentView === 'feed'
              ? 'bg-[#22283a] text-cyan-400 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#161a25]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Feed & Clips</span>
        </button>

        <button
          onClick={() => setCurrentView('community')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentView === 'community'
              ? 'bg-[#22283a] text-cyan-400 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#161a25]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Gaming Guilds & Comms</span>
        </button>

        <button
          onClick={onOpenExplore}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#161a25] transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Explore Public Clans</span>
        </button>
      </nav>

      {/* Right Controls: Low Resource Gaming Performance & Gamer Profile Switcher */}
      <div className="flex items-center gap-2">
        {/* Low Resource Performance Toggle for Mobile Devices */}
        <button
          onClick={toggleLowResourceMode}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isLowResourceMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              : 'bg-[#181d2a] text-slate-400 hover:text-slate-200 border border-[#252c3f]'
          }`}
          title="Toggle low resource performance mode to reduce battery & GPU consumption during gaming"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Low-Resource Gaming</span>
          <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isLowResourceMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}>
            {isLowResourceMode ? '120 FPS' : 'Standard'}
          </span>
        </button>

        {/* Profile Switcher dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSwitchUser(prev => !prev)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-[#161a25] border border-[#252c3f] hover:border-slate-600 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500"
            />
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-white truncate max-w-[100px] leading-tight">
                {currentUser.displayName}
              </p>
              <p className="text-[10px] text-cyan-400 truncate leading-tight font-mono">
                {currentUser.tag}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showSwitchUser && (
            <div className="absolute right-0 mt-2 w-64 bg-[#141824] border border-[#262f44] rounded-2xl p-2 shadow-2xl z-50">
              <div className="px-3 py-1.5 border-b border-[#1f2538] text-[11px] text-slate-400">
                <p className="font-bold text-white">Switch Gamer Profile:</p>
                <p>Test public multiplayer interactions</p>
              </div>

              <div className="space-y-1 mt-1 max-h-60 overflow-y-auto no-scrollbar">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentUser(p);
                      setShowSwitchUser(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-colors ${
                      currentUser.id === p.id
                        ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                        : 'hover:bg-[#1d2334] text-slate-300'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.displayName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs truncate">{p.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {p.currentGame?.name || p.bio}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
