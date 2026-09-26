import React, { useState, useRef, useEffect } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  MoreVertical,
  Reply,
  Smile,
  Trash2,
  Share2,
  Pin,
  ChevronLeft,
  Users,
  ShieldCheck,
  Home,
  Utensils,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Message, MediaAttachment } from '../../types';
import { MessageInput } from './MessageInput';
import { VoiceNotePlayer } from './VoiceNotePlayer';

const QUICK_REACTION_EMOJIS = ['❤️', '😂', '🥰', '👍', '🙏', '🎉'];

interface ChatWindowProps {
  onBackMobile?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onBackMobile }) => {
  const {
    activeChat,
    messages,
    currentUser,
    members,
    addReaction,
    deleteMessage,
    startCall,
    openLightbox,
  } = useFamily();

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState<string | null>(null);
  const [showPinnedAnnouncement, setShowPinnedAnnouncement] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
        Select a family conversation to begin
      </div>
    );
  }

  // Find partner member for 1-on-1 chats
  const partnerId = activeChat.participantIds.find(id => id !== currentUser.id);
  const partner = members.find(m => m.id === partnerId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* Header */}
      <div className="h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Back to messages"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            <img
              src={activeChat.avatar || '/src/assets/images/family_photo_park_1790394119074.jpg'}
              alt={activeChat.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
            />
            {activeChat.isGroup ? (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] ring-2 ring-white">
                <Users className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  partner?.status === 'online'
                    ? 'bg-emerald-500'
                    : partner?.status === 'away'
                    ? 'bg-amber-400'
                    : 'bg-slate-300'
                }`}
              />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate font-display">
              {activeChat.title}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              {activeChat.isGroup
                ? `${activeChat.participantIds.length} family members online`
                : partner?.statusMessage || 'Active today'}
            </p>
          </div>
        </div>

        {/* Call & Action triggers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Voice call button */}
          <button
            onClick={() => startCall(activeChat.id, 'voice')}
            className="w-9 h-9 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
            title="Start voice call"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Video call button (Hero action) */}
          <button
            onClick={() => startCall(activeChat.id, 'video')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Start HD video call"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Video Call</span>
          </button>
        </div>
      </div>

      {/* Pinned Family Announcement (if any) */}
      {activeChat.pinnedAnnouncement && showPinnedAnnouncement && (
        <div className="bg-amber-50/90 border-b border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium truncate">{activeChat.pinnedAnnouncement}</span>
          </div>
          <button
            onClick={() => setShowPinnedAnnouncement(false)}
            className="text-[11px] text-amber-700 hover:underline shrink-0 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {/* Safe family notice */}
        <div className="flex justify-center my-2">
          <div className="text-[11px] text-slate-400 bg-white/80 border border-slate-200/60 px-3 py-1 rounded-full shadow-2xs text-center flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>End-to-end encrypted family connection</span>
          </div>
        </div>

        {messages.map((msg, index) => {
          const isOutgoing = msg.senderId === currentUser.id;
          const sender = members.find(m => m.id === msg.senderId);
          const isHovered = hoveredMessageId === msg.id;

          // Check if sender is same as previous message to group visually
          const prevMsg = messages[index - 1];
          const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;

          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => {
                setHoveredMessageId(null);
                if (activeReactionPickerMsgId === msg.id) {
                  setActiveReactionPickerMsgId(null);
                }
              }}
              className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Sender name for group chats */}
              {!isOutgoing && isFirstInGroup && (
                <div className="flex items-center gap-1.5 mb-1 pl-10 text-[11px] font-semibold text-slate-600">
                  <span style={{ color: sender?.color }}>{sender?.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    · {sender?.role}
                  </span>
                </div>
              )}

              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                {/* Avatar for incoming messages */}
                {!isOutgoing && (
                  <div className="shrink-0 mb-1">
                    {isFirstInGroup ? (
                      <img
                        src={sender?.avatar || '/src/assets/images/avatar_grandma_1790394071440.jpg'}
                        alt={sender?.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className="relative">
                  {/* Hover Floating Actions Menu */}
                  {(isHovered || activeReactionPickerMsgId === msg.id) && (
                    <div
                      className={`absolute -top-8 ${
                        isOutgoing ? 'right-0' : 'left-0'
                      } flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-md z-20`}
                    >
                      {/* Quick Reactions */}
                      {QUICK_REACTION_EMOJIS.slice(0, 4).map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-sm px-1 py-0.5"
                        >
                          {emoji}
                        </button>
                      ))}

                      {/* Reply button */}
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                        title="Reply to message"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete button (if your own message) */}
                      {isOutgoing && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-2xs relative text-sm leading-relaxed ${
                      isOutgoing
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Reply quote preview */}
                    {msg.replyToText && (
                      <div
                        className={`text-xs p-2 rounded-lg mb-2 border-l-2 ${
                          isOutgoing
                            ? 'bg-emerald-700/60 border-white text-emerald-100'
                            : 'bg-slate-100 border-emerald-500 text-slate-600'
                        }`}
                      >
                        <p className="font-semibold text-[10px]">
                          {msg.replyToSenderName || 'Family Member'}
                        </p>
                        <p className="truncate line-clamp-1">{msg.replyToText}</p>
                      </div>
                    )}

                    {/* Quick Check-in Highlight Pill */}
                    {msg.isCheckin && (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-md ${
                          isOutgoing ? 'bg-emerald-700/70 text-emerald-100' : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {msg.checkinType === 'safe' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {msg.checkinType === 'home' && <Home className="w-3.5 h-3.5" />}
                        {msg.checkinType === 'dinner' && <Utensils className="w-3.5 h-3.5" />}
                        {msg.checkinType === 'need_call' && <PhoneCall className="w-3.5 h-3.5" />}
                        <span className="capitalize">Family Check-in</span>
                      </div>
                    )}

                    {/* Voice Note Player */}
                    {msg.isVoiceNote ? (
                      <VoiceNotePlayer
                        duration={msg.voiceDuration}
                        waveform={msg.voiceWaveform}
                        isOutgoing={isOutgoing}
                      />
                    ) : (
                      /* Text body */
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    )}

                    {/* Media Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map(att => (
                          <div
                            key={att.id}
                            onClick={() => openLightbox(att)}
                            className="cursor-pointer group/media rounded-xl overflow-hidden relative shadow-xs"
                          >
                            <img
                              src={att.url}
                              alt={att.name}
                              referrerPolicy="no-referrer"
                              className="w-full max-h-72 object-cover transition-transform group-hover/media:scale-102 duration-200"
                            />
                            {att.caption && (
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-xs">
                                {att.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Read Receipt */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] tabular-nums ${
                        isOutgoing ? 'text-emerald-100/90' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isOutgoing && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-200/80" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reaction Badges on bubble footer */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div
                      className={`flex items-center gap-0.5 mt-0.5 ${
                        isOutgoing ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-2xs text-xs">
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                          <span key={emoji}>{emoji}</span>
                        ))}
                        <span className="text-[10px] text-slate-500 font-semibold tabular-nums">
                          {msg.reactions.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <MessageInput
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};
