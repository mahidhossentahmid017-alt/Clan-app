import React, { useState, useRef, useEffect } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Hash,
  Bell,
  Pin,
  Users,
  Search,
  Send,
  PlusCircle,
  Smile,
  Mic,
  Gamepad2,
  Share2,
  Trash2,
  Volume2,
  Video,
  Monitor,
  Flame,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { ClanMessage, MediaAttachment } from '../../types/clan';

export const ChannelChat: React.FC = () => {
  const {
    activeChannel,
    activeGuild,
    channelMessages,
    sendChannelMessage,
    addChannelReaction,
    deleteChannelMessage,
    currentUser,
    inspectProfile,
    profiles,
    joinVoiceRoom,
    isLowResourceMode,
  } = useClan();

  const [inputText, setInputText] = useState('');
  const [showGamePartyModal, setShowGamePartyModal] = useState(false);
  const [selectedGamePartyMode, setSelectedGamePartyMode] = useState('Ranked Competitive');
  const [partySize, setPartySize] = useState(4);
  const [replyingTo, setReplyingTo] = useState<ClanMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isLowResourceMode ? 'auto' : 'smooth' });
  }, [channelMessages.length, isLowResourceMode]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChannelMessage(inputText, undefined, replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateGameInvite = () => {
    sendChannelMessage(
      `Looking for +${partySize - 1} players for ${selectedGamePartyMode}! Join lobby now! 🎮`,
      undefined,
      undefined,
      false,
      undefined,
      {
        gameName: activeGuild?.gameCategory || 'Cyber Strike: Arena',
        mode: selectedGamePartyMode,
        currentParty: 1,
        maxParty: partySize,
        roomCode: `CLAN-${Math.floor(100 + Math.random() * 900)}`,
      }
    );
    setShowGamePartyModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#161a25] relative overflow-hidden select-text">
      {/* Channel Top Header Bar */}
      <div className="h-14 px-4 border-b border-[#1e2230] bg-[#141722] flex items-center justify-between shadow-xs shrink-0 z-10">
        <div className="flex items-center gap-2 truncate">
          <Hash className="w-5 h-5 text-slate-400 shrink-0" />
          <h2 className="text-sm font-bold text-white tracking-wide truncate font-display">
            {activeChannel?.name || 'general-chat'}
          </h2>
          {activeChannel?.topic && (
            <span className="hidden sm:inline text-xs text-slate-400 pl-3 border-l border-[#252b3f] truncate max-w-md">
              {activeChannel.topic}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick LFG Squad Card CTA */}
          <button
            onClick={() => setShowGamePartyModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Post Game Lobby</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Welcome Channel Banner */}
        <div className="p-4 bg-[#1b2030]/60 border border-[#23293d] rounded-2xl mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-2xl mb-2">
            #
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Welcome to #{activeChannel?.name}!
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            This is the start of the #{activeChannel?.name} channel in {activeGuild?.name || 'Clan'}.
          </p>
        </div>

        {channelMessages.map(msg => {
          const authorProfile = profiles.find(p => p.id === msg.authorId);

          return (
            <div
              key={msg.id}
              className="flex items-start gap-3 group hover:bg-[#1a1f2e]/60 -mx-4 px-4 py-1.5 rounded-lg transition-colors relative"
            >
              {/* Author Avatar */}
              <button
                onClick={() => authorProfile && inspectProfile(authorProfile)}
                className="shrink-0 relative mt-0.5"
              >
                <img
                  src={msg.authorAvatar}
                  alt={msg.authorName}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 hover:ring-cyan-400 transition-all"
                />
              </button>

              <div className="flex-1 min-w-0">
                {/* Author Name and Timestamp */}
                <div className="flex items-center gap-2 mb-0.5">
                  <button
                    onClick={() => authorProfile && inspectProfile(authorProfile)}
                    className="text-xs font-bold text-white hover:underline flex items-center gap-1.5"
                  >
                    <span>{msg.authorName}</span>
                    {msg.authorBadge && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-semibold border border-indigo-500/30">
                        {msg.authorBadge}
                      </span>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Reply context if present */}
                {msg.replyToSnippet && (
                  <div className="text-[11px] text-slate-400 border-l-2 border-slate-600 pl-2 mb-1.5 line-clamp-1 italic">
                    Replying to {msg.replyToAuthor}: "{msg.replyToSnippet}"
                  </div>
                )}

                {/* Message Body */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Game Party Card (Discord LFG feature) */}
                {msg.isGameInvite && msg.gameInviteDetails && (
                  <div className="mt-2.5 p-3.5 bg-gradient-to-r from-[#182236] to-[#1e2a42] border border-cyan-500/40 rounded-xl max-w-md shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <Gamepad2 className="w-3.5 h-3.5" />
                        Party Invite
                      </span>
                      <span className="text-[11px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                        Code: {msg.gameInviteDetails.roomCode}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {msg.gameInviteDetails.gameName}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {msg.gameInviteDetails.mode} · Party: {msg.gameInviteDetails.currentParty}/{msg.gameInviteDetails.maxParty} Ready
                    </p>

                    <button
                      onClick={() => alert(`Joined game party ${msg.gameInviteDetails?.roomCode}! Launching game client.`)}
                      className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs active:scale-98"
                    >
                      Join Party Now 🎮
                    </button>
                  </div>
                )}

                {/* Attachments / Video Clips */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2 max-w-lg">
                    {msg.attachments.map(att => (
                      <div
                        key={att.id}
                        className="rounded-xl overflow-hidden border border-slate-700 bg-black/60 shadow-md group/att"
                      >
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full max-h-72 object-cover hover:scale-101 transition-transform"
                        />
                        {att.caption && (
                          <div className="p-2 text-xs text-slate-300 bg-[#121622] border-t border-slate-800 flex justify-between items-center">
                            <span>{att.caption}</span>
                            <span className="text-[10px] text-cyan-400 uppercase font-bold">HD 60FPS</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => addChannelReaction(msg.id, r.emoji)}
                        className="px-2 py-0.5 rounded-lg bg-[#202638] hover:bg-[#283046] border border-[#2b334a] text-xs text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-bold text-cyan-400">1</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Floating Quick Action Bar */}
              <div className="absolute right-4 top-2 hidden group-hover:flex items-center gap-1 bg-[#1c2233] border border-[#2d364f] rounded-lg px-1.5 py-0.5 shadow-md">
                {['🔥', '🎯', '❤️', '👏'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addChannelReaction(msg.id, emoji)}
                    className="p-1 hover:scale-125 transition-transform text-xs"
                  >
                    {emoji}
                  </button>
                ))}
                {msg.authorId === currentUser.id && (
                  <button
                    onClick={() => deleteChannelMessage(msg.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Area */}
      <div className="p-3 bg-[#141722] border-t border-[#1e2230] shrink-0">
        {replyingTo && (
          <div className="mb-2 p-1.5 px-3 bg-[#1c2233] rounded-lg flex items-center justify-between text-xs text-slate-300 border-l-2 border-cyan-500">
            <span>Replying to {replyingTo.authorName}: "{replyingTo.content.slice(0, 50)}"</span>
            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <div className="bg-[#1f2537] border border-[#2a3249] rounded-xl flex items-end p-2 gap-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <button
            onClick={() => setShowGamePartyModal(true)}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#283147] rounded-lg transition-colors"
            title="Create game party lobby"
          >
            <Gamepad2 className="w-5 h-5" />
          </button>

          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${activeChannel?.name || 'channel'}... (Enter to send)`}
            rows={1}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none resize-none max-h-24 py-1"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-colors shadow-xs"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Party LFG Modal */}
      {showGamePartyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] border border-[#2c354e] rounded-2xl p-5 max-w-md w-full shadow-2xl text-white">
            <h3 className="text-base font-bold font-display flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <span>Create LFG Game Party</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Post an instant interactive join card to #{activeChannel?.name}
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Game Mode:
                </label>
                <select
                  value={selectedGamePartyMode}
                  onChange={e => setSelectedGamePartyMode(e.target.value)}
                  className="w-full bg-[#121622] border border-[#29324a] rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Ranked Competitive 5v5">Ranked Competitive 5v5</option>
                  <option value="Casual Scrimmage">Casual Scrimmage</option>
                  <option value="Speedrun Challenge">Speedrun Challenge</option>
                  <option value="Guild Dungeon Raid">Guild Dungeon Raid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Party Max Size:
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map(size => (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        partySize === size
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-[#121622] text-slate-300 border-[#29324a] hover:bg-[#1a2030]'
                      }`}
                    >
                      {size} Players
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowGamePartyModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGameInvite}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs shadow-md"
              >
                Post Party Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
