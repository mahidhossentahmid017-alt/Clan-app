import React from 'react';
import { useClan } from '../../context/ClanContext';
import { ShieldCheck, Trophy, Sparkles, Volume2, Gamepad2 } from 'lucide-react';

export const MemberListSidebar: React.FC = () => {
  const { profiles, inspectProfile, currentUser, activeGuild } = useClan();

  const onlineMembers = profiles.filter(p => p.status !== 'offline');
  const offlineMembers = profiles.filter(p => p.status === 'offline');

  return (
    <div className="w-56 bg-[#131722] border-l border-[#1e2230] hidden xl:flex flex-col h-full select-none shrink-0 py-3 px-2 overflow-y-auto no-scrollbar">
      {/* Online Section */}
      <div className="mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
          <span>Online — {onlineMembers.length}</span>
        </h4>

        <div className="space-y-0.5">
          {onlineMembers.map(member => (
            <button
              key={member.id}
              onClick={() => inspectProfile(member)}
              className="w-full p-1.5 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#1c2233] transition-colors group"
            >
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-cyan-400"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#131722] ${
                    member.status === 'online'
                      ? 'bg-emerald-500'
                      : member.status === 'idle'
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {member.displayName}
                  </span>
                </div>
                {member.currentGame ? (
                  <span className="text-[10px] text-cyan-400 truncate block">
                    Playing {member.currentGame.name}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 truncate block">
                    {member.customStatus || member.bio}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
