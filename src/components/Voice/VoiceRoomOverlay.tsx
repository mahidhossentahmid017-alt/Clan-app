import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Monitor,
  Maximize2,
  Users,
  Gamepad2,
  Radio,
  Sparkles,
  Volume2,
  Share2,
  Video,
} from 'lucide-react';

export const VoiceRoomOverlay: React.FC = () => {
  const {
    activeVoiceRoom,
    leaveVoiceRoom,
    isVoiceMuted,
    isVoiceDeafened,
    toggleVoiceMute,
    toggleVoiceDeafen,
    isScreenSharing,
    screenShareSource,
    toggleScreenShare,
    inspectProfile,
    profiles,
    isLowResourceMode,
  } = useClan();

  const [expanded, setExpanded] = useState(false);

  if (!activeVoiceRoom) return null;

  return (
    <div
      className={`fixed bottom-0 right-0 z-40 transition-all duration-200 select-none ${
        expanded
          ? 'inset-x-0 bottom-0 top-16 bg-[#0c0e14]/95 backdrop-blur-md p-4 sm:p-6 flex flex-col'
          : 'right-4 bottom-4 w-80 bg-[#121622] border-2 border-emerald-500/50 rounded-2xl shadow-2xl p-3'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#21283b]">
        <div className="flex items-center gap-2 truncate">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate font-display">
              {activeVoiceRoom.channelName}
            </h4>
            <p className="text-[10px] text-emerald-400 truncate">
              {activeVoiceRoom.guildName} · Low-Latency Opus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-[#1f2638]"
            title={expanded ? 'Minimize' : 'Expand full screen'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={leaveVoiceRoom}
            className="p-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-md transition-colors"
            title="Disconnect"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen Sharing Stage (If Active) */}
      {isScreenSharing && (
        <div className="mb-3 rounded-xl overflow-hidden bg-black border border-slate-700 relative aspect-video flex items-center justify-center">
          <img
            src="/src/assets/images/gameplay_screenshot_clip_1790394824146.jpg"
            alt="Screen share"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-cyan-400 font-bold flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            <span>Spectating Live Stream</span>
          </div>
        </div>
      )}

      {/* Voice Participants Grid */}
      <div
        className={`flex-1 overflow-y-auto no-scrollbar gap-2 ${
          expanded
            ? 'grid grid-cols-2 sm:grid-cols-4 auto-rows-fr my-4'
            : 'space-y-1.5 max-h-40'
        }`}
      >
        {activeVoiceRoom.participants.map(p => {
          const profile = profiles.find(pr => pr.id === p.userId);

          return (
            <div
              key={p.userId}
              onClick={() => profile && inspectProfile(profile)}
              className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                p.isSpeaking
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-[#181d2a] border-[#252c3f] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt={p.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  {p.isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#121622]" />
                  )}
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-white block truncate">
                    {p.displayName}
                  </span>
                  {p.currentGame && (
                    <span className="text-[9px] text-cyan-400 truncate block">
                      🎮 {p.currentGame}
                    </span>
                  )}
                </div>
              </div>

              {p.isMuted && <MicOff className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />}
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#21283b]">
        <button
          onClick={toggleVoiceMute}
          className={`p-2 rounded-xl transition-colors ${
            isVoiceMuted
              ? 'bg-rose-600 text-white'
              : 'bg-[#1f2638] text-slate-300 hover:text-white'
          }`}
          title={isVoiceMuted ? 'Unmute' : 'Mute'}
        >
          {isVoiceMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleVoiceDeafen}
          className={`p-2 rounded-xl transition-colors ${
            isVoiceDeafened
              ? 'bg-rose-600 text-white'
              : 'bg-[#1f2638] text-slate-300 hover:text-white'
          }`}
          title={isVoiceDeafened ? 'Undeafen' : 'Deafen'}
        >
          <Headphones className="w-4 h-4" />
        </button>

        <button
          onClick={() => toggleScreenShare(screenShareSource)}
          className={`p-2 rounded-xl transition-colors ${
            isScreenSharing
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-[#1f2638] text-slate-300 hover:text-white'
          }`}
          title="Share Screen or Gaming Clip"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <button
          onClick={leaveVoiceRoom}
          className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave Room</span>
        </button>
      </div>
    </div>
  );
};
