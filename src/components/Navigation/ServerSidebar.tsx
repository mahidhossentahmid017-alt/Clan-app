import React from 'react';
import { useClan } from '../../context/ClanContext';
import { Plus, Compass, Sparkles, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface ServerSidebarProps {
  currentView: 'community' | 'feed' | 'profile';
  setCurrentView: (view: 'community' | 'feed' | 'profile') => void;
  onOpenCreateServer: () => void;
  onOpenExplore: () => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  currentView,
  setCurrentView,
  onOpenCreateServer,
  onOpenExplore,
}) => {
  const {
    guilds,
    activeGuildId,
    setActiveGuildId,
    activeVoiceRoom,
    isLowResourceMode,
    toggleLowResourceMode,
  } = useClan();

  return (
    <aside className="w-18 shrink-0 bg-[#0f1117] flex flex-col items-center py-3 border-r border-[#1e2230] select-none z-20">
      {/* Home / Clan Social Feed Button (Facebook + Discord Home) */}
      <div className="relative group mb-2">
        <button
          onClick={() => setCurrentView('feed')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-200 ${
            currentView === 'feed'
              ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400'
              : 'bg-[#1a1e2d] hover:bg-gradient-to-tr hover:from-cyan-600 hover:to-indigo-600 text-cyan-400 hover:text-white rounded-3xl hover:rounded-xl'
          }`}
          title="Clan Social Feed & Clips"
        >
          C
        </button>
        {/* Indicator pill */}
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r transition-all duration-200 ${
            currentView === 'feed' ? 'h-9' : 'h-0 group-hover:h-4'
          }`}
        />
      </div>

      <div className="w-8 h-[2px] bg-[#1e2230] rounded my-1" />

      {/* Guilds / Community Servers List */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar space-y-2.5 px-3 py-1 flex flex-col items-center">
        {guilds.map(guild => {
          const isActive = currentView === 'community' && activeGuildId === guild.id;
          const hasActiveVoice = activeVoiceRoom?.guildId === guild.id;

          return (
            <div key={guild.id} className="relative group">
              <button
                onClick={() => {
                  setActiveGuildId(guild.id);
                  setCurrentView('community');
                }}
                className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'rounded-xl ring-2 ring-emerald-400 bg-emerald-600 text-white shadow-md'
                    : 'rounded-3xl hover:rounded-xl bg-[#1a1e2d] hover:bg-[#252b3f] text-slate-200'
                }`}
                title={`${guild.name} (${guild.gameCategory})`}
              >
                {guild.banner ? (
                  <div className="relative w-full h-full">
                    <img
                      src={guild.banner}
                      alt={guild.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-bold text-sm">
                      {guild.icon}
                    </div>
                  </div>
                ) : (
                  <span>{guild.icon}</span>
                )}

                {/* Voice connected badge */}
                {hasActiveVoice && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f1117] animate-pulse" />
                )}
              </button>

              {/* Discord-style left active pill */}
              <span
                className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 bg-white rounded-r transition-all duration-200 ${
                  isActive ? 'h-10' : 'h-0 group-hover:h-5'
                }`}
              />
            </div>
          );
        })}

        {/* Add Server Button */}
        <button
          onClick={onOpenCreateServer}
          className="w-12 h-12 rounded-3xl hover:rounded-xl bg-[#1a1e2d] hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
          title="Create a Gaming Guild / Clan"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Discover Communities Button */}
        <button
          onClick={onOpenExplore}
          className="w-12 h-12 rounded-3xl hover:rounded-xl bg-[#1a1e2d] hover:bg-indigo-600 text-indigo-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
          title="Explore Public Gaming Clans"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Utility: Low Resource Gaming Performance Switch */}
      <div className="pt-2 flex flex-col items-center gap-2">
        <button
          onClick={toggleLowResourceMode}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${
            isLowResourceMode
              ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-400'
              : 'bg-[#1a1e2d] hover:bg-[#252b3f] text-slate-400 hover:text-slate-200'
          }`}
          title={
            isLowResourceMode
              ? 'Low Resource Gamer Mode: ON (High FPS, minimal CPU/battery draw)'
              : 'Switch to Low Resource Mode for low-end mobile devices during gaming'
          }
        >
          <Cpu className="w-4 h-4" />
          {isLowResourceMode && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-black" />
          )}
        </button>
      </div>
    </aside>
  );
};
