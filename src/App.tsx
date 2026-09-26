import React, { useState } from 'react';
import { ClanProvider, useClan } from './context/ClanContext';
import { ClanNavbar } from './components/Navigation/ClanNavbar';
import { ServerSidebar } from './components/Navigation/ServerSidebar';
import { ChannelSidebar } from './components/Navigation/ChannelSidebar';
import { MemberListSidebar } from './components/Navigation/MemberListSidebar';
import { ChannelChat } from './components/Chat/ChannelChat';
import { SocialFeed } from './components/Feed/SocialFeed';
import { VoiceRoomOverlay } from './components/Voice/VoiceRoomOverlay';
import { ProfileModal } from './components/Profile/ProfileModal';
import { ExploreGuildsModal } from './components/Navigation/ExploreGuildsModal';
import { CreateGuildModal } from './components/Navigation/CreateGuildModal';
import { MessageSquare, Users, Sparkles, Gamepad2, Compass } from 'lucide-react';

const ClanAppContent: React.FC = () => {
  const { isLowResourceMode } = useClan();
  const [currentView, setCurrentView] = useState<'community' | 'feed' | 'profile'>('community');
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isCreateGuildOpen, setIsCreateGuildOpen] = useState(false);

  // Mobile navigation state
  const [mobileGuildsOpen, setMobileGuildsOpen] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen w-screen bg-[#0a0d14] text-slate-100 overflow-hidden font-sans select-none ${
        isLowResourceMode ? 'low-resource-active' : ''
      }`}
    >
      {/* Top Universal Navbar */}
      <ClanNavbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenExplore={() => setIsExploreOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Discord Server Bar (Always present on left) */}
        <ServerSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenCreateServer={() => setIsCreateGuildOpen(true)}
          onOpenExplore={() => setIsExploreOpen(true)}
        />

        {/* View 1: Discord-Style Community Guilds & Specialized Channels */}
        {currentView === 'community' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Channel Category List */}
            <ChannelSidebar />

            {/* Active Channel Text / Multimedia Chat */}
            <ChannelChat />

            {/* Right Guild Member Activity List */}
            <MemberListSidebar />
          </div>
        )}

        {/* View 2: Facebook-Style Public Social & Gaming Feed */}
        {currentView === 'feed' && (
          <div className="flex-1 flex overflow-hidden">
            <SocialFeed />
          </div>
        )}
      </div>

      {/* Low-Latency Voice Room Overlay (Persistent in-game / browsing comms) */}
      <VoiceRoomOverlay />

      {/* Global Modals */}
      <ProfileModal />
      <ExploreGuildsModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
      />
      <CreateGuildModal
        isOpen={isCreateGuildOpen}
        onClose={() => setIsCreateGuildOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClanProvider>
      <ClanAppContent />
    </ClanProvider>
  );
}
