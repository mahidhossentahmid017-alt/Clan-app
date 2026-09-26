import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Hash,
  Volume2,
  Bell,
  ChevronDown,
  Settings,
  Plus,
  Mic,
  MicOff,
  Headphones,
  Users,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  PhoneOff,
  Radio,
} from 'lucide-react';
import { Channel } from '../../types/clan';

export const ChannelSidebar: React.FC = () => {
  const {
    activeGuild,
    activeChannelId,
    setActiveChannelId,
    activeVoiceRoom,
    joinVoiceRoom,
    leaveVoiceRoom,
    currentUser,
    profiles,
    isVoiceMuted,
    isVoiceDeafened,
    toggleVoiceMute,
    toggleVoiceDeafen,
    updateUserStatus,
    inspectProfile,
  } = useClan();

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="w-60 bg-[#131722] flex flex-col h-full border-r border-[#1e2230] select-none shrink-0">
      {/* Guild Header */}
      <div className="h-14 px-4 border-b border-[#1e2230] flex items-center justify-between hover:bg-[#181d2a] transition-colors cursor-pointer shadow-xs">
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-lg">{activeGuild?.icon || '🎮'}</span>
          <div className="truncate">
            <h2 className="text-xs font-bold text-white tracking-wide truncate font-display">
              {activeGuild?.name || 'Clan Hub'}
            </h2>
            <span className="text-[10px] text-cyan-400 font-medium block truncate">
              {activeGuild?.gameCategory || 'Gaming Community'}
            </span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Categories & Channels Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-4">
        {(activeGuild?.categories || []).map(category => {
          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                  />
                  <span>{category.name}</span>
                </div>
              </button>

              {/* Channels List */}
              {!isCollapsed && (
                <div className="space-y-0.5 pt-0.5">
                  {category.channels.map(channel => {
                    const isText = channel.type === 'text' || channel.type === 'announcement';
                    const isVoice = channel.type === 'voice';
                    const isChannelActive = activeChannelId === channel.id;
                    const isVoiceConnectedHere = activeVoiceRoom?.channelId === channel.id;

                    return (
                      <div key={channel.id} className="space-y-1">
                        <button
                          onClick={() => {
                            if (isText) {
                              setActiveChannelId(channel.id);
                            } else if (isVoice) {
                              joinVoiceRoom(channel.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                            isChannelActive && isText
                              ? 'bg-[#252b3f] text-white font-semibold shadow-xs'
                              : isVoiceConnectedHere
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'text-slate-400 hover:bg-[#1a1e2d] hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isText ? (
                              <Hash className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                            ) : (
                              <Volume2
                                className={`w-4 h-4 shrink-0 ${
                                  isVoiceConnectedHere ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                                }`}
                              />
                            )}
                            <span className="truncate">{channel.name}</span>
                          </div>

                          {channel.unreadCount && channel.unreadCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {channel.unreadCount}
                            </span>
                          )}
                        </button>

                        {/* If Voice Channel: Show connected users */}
                        {isVoice && (
                          <div className="pl-6 space-y-1 py-0.5">
                            {/* Connected users from room state or initial */}
                            {isVoiceConnectedHere ? (
                              activeVoiceRoom.participants.map(p => (
                                <div
                                  key={p.userId}
                                  onClick={() => {
                                    const prof = profiles.find(pr => pr.id === p.userId);
                                    if (prof) inspectProfile(prof);
                                  }}
                                  className="flex items-center justify-between px-2 py-1 rounded-md text-[11px] text-slate-300 hover:bg-[#1c2233] cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <div className="relative">
                                      <img
                                        src={p.avatar}
                                        alt={p.displayName}
                                        className="w-5 h-5 rounded-full object-cover"
                                      />
                                      <span
                                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
                                          p.isSpeaking
                                            ? 'bg-emerald-400 ring-2 ring-emerald-500/50'
                                            : 'bg-slate-500'
                                        }`}
                                      />
                                    </div>
                                    <span className="truncate">{p.displayName}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              channel.activeVoiceUsers?.map(uid => {
                                const prof = profiles.find(p => p.id === uid);
                                if (!prof) return null;
                                return (
                                  <div
                                    key={uid}
                                    onClick={() => inspectProfile(prof)}
                                    className="flex items-center gap-2 px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                                  >
                                    <img
                                      src={prof.avatar}
                                      alt={prof.displayName}
                                      className="w-4 h-4 rounded-full object-cover"
                                    />
                                    <span className="truncate">{prof.displayName}</span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice Status Pill if Connected */}
      {activeVoiceRoom && (
        <div className="p-2.5 bg-[#0e1724] border-t border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="truncate">
              <span className="text-[11px] font-bold text-emerald-400 block leading-tight">
                Voice Connected
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {activeVoiceRoom.channelName} / {activeVoiceRoom.guildName}
              </span>
            </div>
          </div>
          <button
            onClick={leaveVoiceRoom}
            className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
            title="Disconnect Voice Room"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Status Bar & Controls (Discord bottom left) */}
      <div className="h-14 px-3 bg-[#0c0e14] border-t border-[#1e2230] flex items-center justify-between">
        <div
          onClick={() => inspectProfile(currentUser)}
          className="flex items-center gap-2 min-w-0 cursor-pointer p-1 rounded-lg hover:bg-[#181d2a] transition-colors"
        >
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/50"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#0c0e14] ${
                currentUser.status === 'online'
                  ? 'bg-emerald-500'
                  : currentUser.status === 'idle'
                  ? 'bg-amber-400'
                  : currentUser.status === 'dnd'
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate leading-tight font-display">
              {currentUser.displayName}
            </p>
            <p className="text-[10px] text-slate-400 truncate leading-tight">
              {currentUser.customStatus || currentUser.tag}
            </p>
          </div>
        </div>

        {/* Quick Mute / Deafen Toggles */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleVoiceMute}
            className={`p-1.5 rounded-md transition-colors ${
              isVoiceMuted ? 'text-rose-400 bg-rose-950/60' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1e2d]'
            }`}
            title={isVoiceMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isVoiceMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleVoiceDeafen}
            className={`p-1.5 rounded-md transition-colors ${
              isVoiceDeafened
                ? 'text-rose-400 bg-rose-950/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1e2d]'
            }`}
            title={isVoiceDeafened ? 'Undeafen' : 'Deafen'}
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
