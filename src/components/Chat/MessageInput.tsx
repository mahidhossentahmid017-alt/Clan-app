import React, { useState, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Smile,
  X,
  Heart,
  Home,
  ShieldCheck,
  PhoneCall,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { Message, MediaAttachment } from '../../types';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';

interface MessageInputProps {
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const FAMILY_STICKERS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🤗', label: 'Family Hug' },
  { emoji: '🥰', label: 'Adore' },
  { emoji: '🥞', label: 'Brunch' },
  { emoji: '🌹', label: 'Roses' },
  { emoji: '🥧', label: 'Pie' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '🙏', label: 'Gratitude' },
  { emoji: '👍', label: 'Got it' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🏡', label: 'Home' },
  { emoji: '🚗', label: 'On my way' },
];

export const MessageInput: React.FC<MessageInputProps> = ({ replyingTo, onCancelReply }) => {
  const { sendMessage, sendQuickCheckin } = useFamily();
  const [text, setText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MediaAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (!text.trim() && pendingAttachments.length === 0) return;

    sendMessage(
      text,
      pendingAttachments.length > 0 ? pendingAttachments : undefined,
      replyingTo || undefined
    );

    setText('');
    setPendingAttachments([]);
    setShowStickerPicker(false);
    if (replyingTo) {
      onCancelReply();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);

    const newAttachment: MediaAttachment = {
      id: `att-${Date.now()}`,
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: objectUrl,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      caption: '',
    };

    setPendingAttachments(prev => [...prev, newAttachment]);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSendVoiceNote = (duration: number) => {
    sendMessage(
      'Voice message',
      undefined,
      replyingTo || undefined,
      true,
      duration
    );
    setIsRecordingVoice(false);
    if (replyingTo) onCancelReply();
  };

  return (
    <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
      {/* Quick Check-in shortcuts bar */}
      <div className="flex items-center gap-1.5 pb-2.5 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[11px] font-medium text-slate-400 shrink-0 mr-1">
          Quick Check-in:
        </span>
        <button
          onClick={() => sendQuickCheckin('safe')}
          className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 font-medium shrink-0 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>I'm Safe</span>
        </button>
        <button
          onClick={() => sendQuickCheckin('home')}
          className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 flex items-center gap-1 font-medium shrink-0 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Arrived Home</span>
        </button>
        <button
          onClick={() => sendQuickCheckin('dinner')}
          className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1 font-medium shrink-0 transition-colors"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Dinner Time</span>
        </button>
        <button
          onClick={() => sendQuickCheckin('need_call')}
          className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1 font-medium shrink-0 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Me Later</span>
        </button>
      </div>

      {/* Replying Banner */}
      {replyingTo && (
        <div className="mb-2 p-2 bg-slate-100 border-l-4 border-emerald-500 rounded flex items-center justify-between text-xs">
          <div className="truncate">
            <span className="font-semibold text-emerald-700 block">
              Replying to {replyingTo.senderId === 'user-you' ? 'yourself' : 'family member'}
            </span>
            <span className="text-slate-600 truncate block">
              {replyingTo.text || 'Photo / voice note'}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-slate-200 rounded text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pending Attachments Preview */}
      {pendingAttachments.length > 0 && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
          {pendingAttachments.map(att => (
            <div key={att.id} className="relative group shrink-0">
              <img
                src={att.url}
                alt={att.name}
                className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-300"
              />
              <button
                onClick={() => removePendingAttachment(att.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice Recording Active Mode */}
      {isRecordingVoice ? (
        <VoiceNoteRecorder
          onSend={handleSendVoiceNote}
          onCancel={() => setIsRecordingVoice(false)}
        />
      ) : (
        /* Normal Input Bar */
        <div className="relative flex items-end gap-2 bg-slate-100/90 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all border border-slate-200">
          {/* File Picker Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Attachment buttons */}
          <div className="flex items-center pb-1 pl-1 gap-0.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Share photo or family video"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowStickerPicker(prev => !prev)}
              className={`p-2 rounded-xl transition-colors ${
                showStickerPicker
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-200/60'
              }`}
              title="Family stickers & reactions"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a family message... (Press Enter to send)"
            rows={1}
            className="flex-1 max-h-28 py-2 px-2 text-sm bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 font-sans"
          />

          {/* Voice note / Send button */}
          <div className="flex items-center pb-1 pr-1 gap-1">
            {text.trim() || pendingAttachments.length > 0 ? (
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecordingVoice(true)}
                className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-emerald-500 hover:text-white text-slate-700 flex items-center justify-center transition-all active:scale-95 shrink-0"
                title="Hold or tap to record voice note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Family Sticker Drawer */}
      {showStickerPicker && (
        <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Family Stickers & Quick Love
            </span>
            <button
              onClick={() => setShowStickerPicker(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {FAMILY_STICKERS.map((st, i) => (
              <button
                key={i}
                onClick={() => {
                  sendMessage(st.emoji);
                  setShowStickerPicker(false);
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors text-2xl group"
                title={st.label}
              >
                <span className="group-hover:scale-125 transition-transform duration-150">
                  {st.emoji}
                </span>
                <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">
                  {st.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
