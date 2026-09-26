import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  PhoneCall,
  Video,
  HeartHandshake,
  Users,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  UserCheck,
  BellRing,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'chats' | 'family-hub' | 'senior-mode';
  setCurrentTab: (tab: 'chats' | 'family-hub' | 'senior-mode') => void;
  onOpenNewChat: () => void;
  onOpenFamilyHub: (tab?: 'album' | 'events' | 'status') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenFamilyHub,
}) => {
  const {
    currentUser,
    setCurrentUser,
    members,
    isSeniorMode,
    toggleSeniorMode,
    startCall,
    activeChatId,
    simulateIncomingCall,
  } = useFamily();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Clan
          </span>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('chats')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              currentTab === 'chats' && !isSeniorMode
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Family Chats</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('family-hub');
              onOpenFamilyHub('album');
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              currentTab === 'family-hub'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Family Hub</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('family-hub');
              onOpenFamilyHub('events');
            }}
            className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>

          <button
            onClick={() => {
              toggleSeniorMode();
              if (!isSeniorMode) {
                setCurrentTab('senior-mode');
              } else {
                setCurrentTab('chats');
              }
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isSeniorMode
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Simplified view with huge buttons, voice-first calling, and high readability for grandparents & kids"
          >
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>Senior / Easy Mode</span>
            {isSeniorMode && (
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                ON
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Test Call trigger + Family Switcher) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Group Video Call CTA */}
          <button
            onClick={() => startCall(activeChatId, 'video')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            title="Start instant family video call"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Family Call</span>
          </button>

          {/* Test simulate incoming call from Grandma */}
          <button
            onClick={() => simulateIncomingCall('Grandmother')}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Simulate Grandma calling you to test ringtone and incoming video call experience"
          >
            <BellRing className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden lg:inline">Simulate Call</span>
          </button>

          {/* User Profile Perspective Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Switch family member perspective"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                  {currentUser.nickname}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">Switch view</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-xs text-slate-500">
                  <p className="font-medium text-slate-700">Experience as any family member:</p>
                  <p className="text-[11px] text-slate-400">Test two-way messaging & calls</p>
                </div>
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setCurrentUser(member);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors ${
                      currentUser.id === member.id ? 'bg-emerald-50/70 font-semibold' : ''
                    }`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {member.role} · {member.statusMessage}
                      </p>
                    </div>
                    {currentUser.id === member.id && (
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
