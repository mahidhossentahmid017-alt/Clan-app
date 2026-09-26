import React from 'react';
import { useClan } from '../../context/ClanContext';
import {
  X,
  Trophy,
  Shield,
  Gamepad2,
  Users,
  Flame,
  MessageSquare,
  Sparkles,
  ExternalLink,
  UserCheck,
  UserPlus,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { inspectedProfile, inspectProfile, currentUser, sendChannelMessage } = useClan();

  if (!inspectedProfile) return null;

  const isSelf = inspectedProfile.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-text">
      <div className="bg-[#121622] border border-[#252d42] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-white">
        {/* Profile Banner */}
        <div className="h-32 w-full relative bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-800">
          {inspectedProfile.banner && (
            <img
              src={inspectedProfile.banner}
              alt="Banner"
              className="w-full h-full object-cover opacity-75"
            />
          )}

          {/* Close button */}
          <button
            onClick={() => inspectProfile(null)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar & Level */}
        <div className="px-6 relative pb-5">
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="relative">
              <img
                src={inspectedProfile.avatar}
                alt={inspectedProfile.displayName}
                className="w-22 h-22 rounded-2xl object-cover ring-4 ring-[#121622] shadow-xl"
              />
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ring-3 ring-[#121622] ${
                  inspectedProfile.status === 'online'
                    ? 'bg-emerald-500'
                    : inspectedProfile.status === 'idle'
                    ? 'bg-amber-400'
                    : inspectedProfile.status === 'dnd'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {!isSelf && (
                <button
                  onClick={() => alert(`Added ${inspectedProfile.displayName} to Clan Friends!`)}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>

          {/* Names and Tags */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <span>{inspectedProfile.displayName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e2538] text-cyan-300 font-mono">
                {inspectedProfile.tag}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              @{inspectedProfile.username} · Level {inspectedProfile.level}
            </p>
          </div>

          {/* Badges Bar */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {inspectedProfile.badges.map(b => (
              <span
                key={b.id}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 border border-white/10"
                style={{ backgroundColor: `${b.color}25`, color: b.color }}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </span>
            ))}
          </div>

          {/* Bio */}
          <div className="bg-[#181e2c] border border-[#232b3f] rounded-xl p-3 text-xs text-slate-300 leading-relaxed mb-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">About Me</p>
            <p>{inspectedProfile.bio}</p>
          </div>

          {/* Rich Gaming Presence (Discord Activity status) */}
          {inspectedProfile.currentGame && (
            <div className="bg-gradient-to-r from-[#17243b] to-[#1a1c2e] border border-cyan-500/30 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Playing a Game
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {inspectedProfile.currentGame.elapsedTime} elapsed
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">
                {inspectedProfile.currentGame.name}
              </h4>
              <p className="text-[11px] text-slate-300">
                {inspectedProfile.currentGame.details}
              </p>
            </div>
          )}

          {/* Follower Stats (Facebook style public social presence) */}
          <div className="flex items-center justify-around text-center py-2 border-t border-[#1e2538] text-xs">
            <div>
              <p className="font-bold text-white text-sm tabular-nums">
                {inspectedProfile.followersCount}
              </p>
              <p className="text-[10px] text-slate-400">Followers</p>
            </div>
            <div className="w-[1px] h-6 bg-[#252c3f]" />
            <div>
              <p className="font-bold text-white text-sm tabular-nums">
                {inspectedProfile.followingCount}
              </p>
              <p className="text-[10px] text-slate-400">Following</p>
            </div>
            <div className="w-[1px] h-6 bg-[#252c3f]" />
            <div>
              <p className="font-bold text-white text-sm tabular-nums">
                {inspectedProfile.level}
              </p>
              <p className="text-[10px] text-slate-400">Clan Rank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
