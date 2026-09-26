import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Search,
  Plus,
  Users,
  User,
  Check,
  CheckCheck,
  Phone,
  Video,
  Sparkles,
} from 'lucide-react';
import { Chat } from '../../types';

interface ChatListProps {
  onOpenNewChatModal: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onOpenNewChatModal }) => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    members,
    currentUser,
    startCall,
  } = useFamily();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'groups' | 'direct'>('all');

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage?.text || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'groups') return chat.isGroup;
    if (filterType === 'direct') return !chat.isGroup;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header & New Chat button */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">
              Messages
            </h2>
            <span className="text-xs text-slate-500 font-medium tabular-nums">
              ({chats.length})
            </span>
          </div>

          <button
            onClick={onOpenNewChatModal}
            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors shadow-2xs"
            title="Start new family chat or group"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search family chats or messages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 mt-3 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Chats
          </button>
          <button
            onClick={() => setFilterType('groups')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'groups'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setFilterType('direct')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'direct'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct
          </button>
        </div>
      </div>

      {/* Online Family Members Quick Strip */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          {members
            .filter(m => m.id !== currentUser.id)
            .map(member => (
              <button
                key={member.id}
                onClick={() => {
                  // Find or open direct chat with this member
                  const existingDirect = chats.find(
                    c => !c.isGroup && c.participantIds.includes(member.id)
                  );
                  if (existingDirect) {
                    setActiveChatId(existingDirect.id);
                  }
                }}
                className="flex flex-col items-center shrink-0 group"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                      member.status === 'online'
                        ? 'bg-emerald-500'
                        : member.status === 'away'
                        ? 'bg-amber-400'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-700 mt-1 max-w-[54px] truncate">
                  {member.nickname}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No family chats found matching "{searchQuery}"
          </div>
        ) : (
          filteredChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const hasUnread = chat.unreadCount > 0;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors cursor-pointer relative group ${
                  isActive
                    ? 'bg-emerald-50/80'
                    : 'hover:bg-slate-50/80 bg-white'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r" />
                )}

                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar || '/src/assets/images/family_photo_park_1790394119074.jpg'}
                    alt={chat.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  {chat.isGroup ? (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                {/* Chat details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-xs truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                      {chat.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-1">
                      {chat.lastMessage?.timestamp || ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs truncate ${hasUnread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                      {chat.lastMessage?.senderId === currentUser.id && (
                        <span className="text-slate-400 font-normal mr-1">You:</span>
                      )}
                      {chat.lastMessage?.text || 'No messages yet'}
                    </p>

                    {chat.unreadCount > 0 && (
                      <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full min-w-4 text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Quick Call Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center pl-1">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      startCall(chat.id, 'video');
                    }}
                    className="w-7 h-7 rounded-full bg-white shadow-xs border border-slate-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                    title="Quick video call"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
