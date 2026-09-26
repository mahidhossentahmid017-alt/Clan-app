import React, { useState, useEffect, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Monitor,
  Maximize2,
  Minimize2,
  Users,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';
import { ScreenShareViewer } from './ScreenShareViewer';

export const CallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
    localStream,
    isScreenSharing,
    screenShareSource,
    toggleScreenShare,
    currentUser,
    members,
    sendMessage,
    messages,
  } = useFamily();

  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInCallChat, setShowInCallChat] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [inCallMessageText, setInCallMessageText] = useState('');
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(1);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync real local stream to video tag
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOff]);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Periodic natural conversation speaker alternation simulation
  useEffect(() => {
    if (!activeCall) return;
    const speakerTimer = setInterval(() => {
      setActiveSpeakerIndex(prev => {
        const next = (prev + 1) % activeCall.participants.length;
        return next === 0 ? 1 : next; // Alternate between other family members
      });
    }, 4500);

    return () => clearInterval(speakerTimer);
  }, [activeCall]);

  if (!activeCall) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendInCallChat = () => {
    if (!inCallMessageText.trim()) return;
    sendMessage(inCallMessageText.trim());
    setInCallMessageText('');
  };

  // Minimized Floating Picture-in-Picture View
  if (isMinimized) {
    const leadParticipant = activeCall.participants.find(p => p.memberId !== currentUser.id) || activeCall.participants[0];
    return (
      <div className="fixed bottom-4 right-4 z-50 w-72 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <img
            src={leadParticipant.avatar || '/src/assets/images/avatar_grandma_1790394071440.jpg'}
            alt={leadParticipant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          {/* Top Bar */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between text-white text-xs">
            <span className="font-semibold truncate max-w-[120px]">
              {activeCall.chatTitle}
            </span>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/20 rounded-md"
              title="Expand call"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-mono">
              {formatDuration(callDuration)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-full ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800/80 text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>
              <button
                onClick={endCall}
                className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700"
              >
                <PhoneOff className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Calling Experience
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-white animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-display">
              <span>{activeCall.chatTitle}</span>
              {activeCall.isGroup && (
                <span className="text-[11px] text-slate-400 font-normal">
                  ({activeCall.participants.length} family members)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {formatDuration(callDuration)} · HD Family Connection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio volume toggle */}
          <button
            onClick={() => setIsSpeakerMuted(prev => !prev)}
            className={`p-2 rounded-xl border border-slate-700 transition-colors ${
              isSpeakerMuted ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
          >
            {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* In-Call Chat Button */}
          <button
            onClick={() => setShowInCallChat(prev => !prev)}
            className={`p-2 rounded-xl border border-slate-700 transition-colors ${
              showInCallChat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="In-call chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Minimize to Picture-in-Picture"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Arena */}
      <div className="flex-1 flex overflow-hidden relative p-3 sm:p-6 gap-4">
        {/* Left/Center: Video Grid or Screen Share */}
        <div className="flex-1 flex flex-col h-full relative">
          {isScreenSharing ? (
            /* Screen Share Viewer */
            <div className="flex-1 w-full h-full relative">
              <ScreenShareViewer
                source={screenShareSource}
                onClose={() => toggleScreenShare(screenShareSource)}
                stream={localStream}
              />
            </div>
          ) : (
            /* Multi-Party or 1-on-1 Video Grid */
            <div
              className={`flex-1 grid gap-4 w-full h-full ${
                activeCall.participants.length > 2
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 auto-rows-fr'
                  : 'grid-cols-1 sm:grid-cols-2 auto-rows-fr'
              }`}
            >
              {/* Participant Video Tiles */}
              {activeCall.participants.map((participant, index) => {
                const isSelf = participant.memberId === currentUser.id;
                const isSpeaking = activeSpeakerIndex === index && !isSelf;

                return (
                  <div
                    key={participant.memberId}
                    className={`relative rounded-3xl overflow-hidden bg-slate-900 border-2 transition-all flex items-center justify-center ${
                      isSpeaking
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* If self and video is ON with real stream */}
                    {isSelf && !isVideoOff && localStream ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      /* Realistic Avatar Stream */
                      <div className="relative w-full h-full flex items-center justify-center bg-radial from-slate-800 to-slate-950">
                        <img
                          src={
                            participant.avatar ||
                            '/src/assets/images/avatar_grandma_1790394071440.jpg'
                          }
                          alt={participant.name}
                          className="w-full h-full object-cover max-h-[70vh] opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      </div>
                    )}

                    {/* Speaking Wave Ripple Indicator */}
                    {isSpeaking && (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                        <span>Speaking...</span>
                      </div>
                    )}

                    {/* Participant Details Bar */}
                    <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
                        <span className="font-semibold text-white">
                          {isSelf ? `${participant.name} (You)` : participant.name}
                        </span>
                        <span className="text-[10px] text-slate-300">
                          · {participant.role}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-1.5">
                        {isSelf && isMuted && (
                          <div className="p-1.5 rounded-full bg-rose-600/90 text-white">
                            <MicOff className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {isSelf && isVideoOff && (
                          <div className="p-1.5 rounded-full bg-slate-800/90 text-slate-300">
                            <VideoOff className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Drawer: In-Call Family Chat */}
        {showInCallChat && (
          <div className="w-80 h-full bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>In-Call Family Chat</span>
              </h4>
              <button
                onClick={() => setShowInCallChat(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
              {messages.slice(-8).map(m => {
                const isYou = m.senderId === currentUser.id;
                const sender = members.find(mem => mem.id === m.senderId);
                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl ${
                      isYou
                        ? 'bg-emerald-600/80 text-white ml-6'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 mr-6'
                    }`}
                  >
                    <p className="text-[10px] font-semibold opacity-75 mb-0.5">
                      {isYou ? 'You' : sender?.nickname}
                    </p>
                    <p>{m.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Input in call */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={inCallMessageText}
                onChange={e => setInCallMessageText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendInCallChat()}
                placeholder="Message call members..."
                className="flex-1 px-3 py-1.5 bg-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 border border-slate-700 outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendInCallChat}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Call Controls Bar */}
      <div className="h-20 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-center gap-3 sm:gap-4 shrink-0 relative">
        {/* Microphone Toggle */}
        <button
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isMuted
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Camera Toggle */}
        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isVideoOff
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title={isVideoOff ? 'Turn video on' : 'Turn video off'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </button>

        {/* Screen Share / Collaborative Modes Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(prev => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title="Screen share & family experiences"
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Screen Share Dropdown Options */}
          {showShareMenu && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-30">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800 mb-1">
                Collaborate & Share Screen:
              </div>

              <button
                onClick={() => {
                  toggleScreenShare('native');
                  setShowShareMenu(false);
                }}
                className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs hover:bg-slate-800 transition-colors"
              >
                <Monitor className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-white">Share My Screen</p>
                  <p className="text-[10px] text-slate-400">Browser / desktop display</p>
                </div>
              </button>

              <button
                onClick={() => {
                  toggleScreenShare('tech_assist');
                  setShowShareMenu(false);
                }}
                className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold text-white">Grandma Tech Help</p>
                  <p className="text-[10px] text-slate-400">Guide grandma on screen</p>
                </div>
              </button>

              <button
                onClick={() => {
                  toggleScreenShare('photos');
                  setShowShareMenu(false);
                }}
                className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs hover:bg-slate-800 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="font-semibold text-white">Family Photo Slideshow</p>
                  <p className="text-[10px] text-slate-400">Browse memories together</p>
                </div>
              </button>

              <button
                onClick={() => {
                  toggleScreenShare('recipe');
                  setShowShareMenu(false);
                }}
                className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="font-semibold text-white">Family Recipe Board</p>
                  <p className="text-[10px] text-slate-400">Cook brunch together</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* End Call Button (Hero red action) */}
        <button
          onClick={endCall}
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all shadow-xl shadow-rose-600/40 active:scale-90"
          title="End family call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
