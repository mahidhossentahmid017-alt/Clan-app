import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  FamilyMember,
  Chat,
  Message,
  ActiveCall,
  CallType,
  IncomingCallNotification,
  FamilyEvent,
  MediaAttachment,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_EVENTS,
} from '../data/initialData';
import { soundService } from '../services/soundService';

interface FamilyContextType {
  currentUser: FamilyMember;
  setCurrentUser: (user: FamilyMember) => void;
  members: FamilyMember[];
  updateMemberStatus: (status: 'online' | 'away' | 'busy' | 'offline', message: string) => void;
  chats: Chat[];
  activeChatId: string;
  setActiveChatId: (chatId: string) => void;
  activeChat: Chat | undefined;
  messages: Message[];
  sendMessage: (text: string, attachments?: MediaAttachment[], replyToMessage?: Message, isVoice?: boolean, voiceDuration?: number, checkinType?: Message['checkinType']) => void;
  addReaction: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
  createNewChat: (participantIds: string[], title?: string, isGroup?: boolean) => string;
  // Calling
  activeCall: ActiveCall | null;
  startCall: (chatId: string, type: CallType) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
  localStream: MediaStream | null;
  isScreenSharing: boolean;
  screenShareSource: 'native' | 'tech_assist' | 'photos' | 'recipe';
  toggleScreenShare: (source?: 'native' | 'tech_assist' | 'photos' | 'recipe') => Promise<void>;
  incomingCall: IncomingCallNotification | null;
  acceptIncomingCall: () => void;
  declineIncomingCall: () => void;
  simulateIncomingCall: (callerRole?: string) => void;
  // Senior Mode
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  // Family Hub & Events
  familyEvents: FamilyEvent[];
  addFamilyEvent: (event: Omit<FamilyEvent, 'id'>) => void;
  sendQuickCheckin: (type: 'safe' | 'home' | 'need_call' | 'dinner', customNote?: string) => void;
  // Media lightbox
  lightboxMedia: MediaAttachment | null;
  openLightbox: (media: MediaAttachment) => void;
  closeLightbox: () => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const STORAGE_KEY_CHATS = 'clan_chats_v1';
const STORAGE_KEY_MSGS = 'clan_msgs_v1';
const STORAGE_KEY_SENIOR = 'clan_senior_mode_v1';

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [currentUser, setCurrentUser] = useState<FamilyMember>(INITIAL_MEMBERS[0]); // Alex (You)
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHATS);
      return stored ? JSON.parse(stored) : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MSGS);
      return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeChatId, setActiveChatId] = useState<string>('chat-family-group');
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SENIOR) === 'true';
    } catch {
      return false;
    }
  });

  // Call states
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenShareSource, setScreenShareSource] = useState<'native' | 'tech_assist' | 'photos' | 'recipe'>('native');
  const [incomingCall, setIncomingCall] = useState<IncomingCallNotification | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  // Events & Lightbox
  const [familyEvents, setFamilyEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [lightboxMedia, setLightboxMedia] = useState<MediaAttachment | null>(null);

  // Persist chats and messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
    } catch {
      // ignore
    }
  }, [chats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(allMessages));
    } catch {
      // ignore
    }
  }, [allMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SENIOR, String(isSeniorMode));
    } catch {
      // ignore
    }
  }, [isSeniorMode]);

  // Clean unread count when switching to active chat
  useEffect(() => {
    setChats(prev =>
      prev.map(c => (c.id === activeChatId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const messages = allMessages[activeChatId] || [];

  const updateMemberStatus = (status: 'online' | 'away' | 'busy' | 'offline', message: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === currentUser.id ? { ...m, status, statusMessage: message } : m))
    );
    setCurrentUser(prev => ({ ...prev, status, statusMessage: message }));
  };

  const sendMessage = (
    text: string,
    attachments?: MediaAttachment[],
    replyToMessage?: Message,
    isVoice?: boolean,
    voiceDuration?: number,
    checkinType?: Message['checkinType']
  ) => {
    if (!text.trim() && (!attachments || attachments.length === 0) && !isVoice) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      createdAt: Date.now(),
      status: 'sent',
      attachments: attachments || [],
      reactions: [],
      replyToId: replyToMessage?.id,
      replyToText: replyToMessage?.text,
      replyToSenderName: members.find(m => m.id === replyToMessage?.senderId)?.name,
      isVoiceNote: isVoice,
      voiceDuration: voiceDuration || (isVoice ? 8 : undefined),
      voiceWaveform: isVoice
        ? Array.from({ length: 24 }, () => Math.floor(Math.random() * 70) + 20)
        : undefined,
      isCheckin: !!checkinType,
      checkinType,
    };

    setAllMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update last message in chat preview
    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: {
              text: isVoice
                ? '🎙️ Voice note'
                : attachments && attachments.length > 0
                ? `📷 Photo: ${text || 'Shared photo'}`
                : text,
              senderId: currentUser.id,
              senderName: currentUser.nickname,
              timestamp: 'Just now',
              createdAt: Date.now(),
              isMedia: (attachments && attachments.length > 0) || isVoice,
            },
          };
        }
        return c;
      })
    );

    // Play subtle feedback
    soundService.playMessageChime();

    // Auto family response simulation if sending to Grandma or Family Group from Alex!
    if (currentUser.id === 'user-you') {
      simulateRealisticFamilyReply(activeChatId, text);
    }
  };

  const simulateRealisticFamilyReply = (chatId: string, userText: string) => {
    // Only simulate occasionally or contextual
    const delay = Math.floor(Math.random() * 2000) + 1800;

    window.setTimeout(() => {
      let replySender = members.find(m => m.id === 'user-grandma');
      let replyText = 'So happy to hear from you, dear! Sending warm hugs ❤️👵';

      const lower = userText.toLowerCase();

      if (chatId === 'chat-family-group') {
        if (lower.includes('dinner') || lower.includes('food') || lower.includes('brunch')) {
          replySender = members.find(m => m.id === 'user-mom');
          replyText = 'Yay! Let me know if anyone wants extra waffles on Sunday! 🥞';
        } else if (lower.includes('call') || lower.includes('video')) {
          replySender = members.find(m => m.id === 'user-grandma');
          replyText = 'I am sitting in my rocking chair ready whenever you start the call Alex! 🌹';
        } else if (lower.includes('safe') || lower.includes('home')) {
          replySender = members.find(m => m.id === 'user-mom');
          replyText = 'So glad you are safe and sound! Love you honey ❤️';
        } else {
          replySender = members.find(m => m.id === 'user-dad');
          replyText = 'Sounds great! Enjoy your day, kids 👍';
        }
      } else if (chatId === 'chat-grandma') {
        if (lower.includes('rose') || lower.includes('flower') || lower.includes('garden')) {
          replyText = 'The yellow tea roses bloomed this morning! I will show you on our video call! 🌼';
        } else {
          replyText = 'Thank you for messaging your grandma, Alex. You make my day brighter! 👵❤️';
        }
      } else if (chatId === 'chat-mom') {
        replySender = members.find(m => m.id === 'user-mom');
        replyText = 'Got your message sweetie! Don’t forget to hydrate and eat well today. Love you!';
      } else if (chatId === 'chat-dad') {
        replySender = members.find(m => m.id === 'user-dad');
        replyText = 'Roger that! Let me know if you need any help fixing anything around the apartment.';
      } else if (chatId === 'chat-leo') {
        replySender = members.find(m => m.id === 'user-leo');
        replyText = 'Bet! Thanks Alex, talk soon 🎮';
      }

      if (!replySender) return;

      const replyMsg: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        chatId,
        senderId: replySender.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        createdAt: Date.now(),
        status: 'delivered',
        reactions: [{ emoji: '❤️', userId: replySender.id, userName: replySender.name }],
      };

      setAllMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), replyMsg],
      }));

      setChats(prev =>
        prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: {
                text: replyText,
                senderId: replySender!.id,
                senderName: replySender!.nickname,
                timestamp: 'Just now',
                createdAt: Date.now(),
              },
            };
          }
          return c;
        })
      );

      soundService.playMessageChime();
    }, delay);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setAllMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map(m => {
        if (m.id !== messageId) return m;

        // Toggle reaction
        const existingIdx = m.reactions.findIndex(
          r => r.userId === currentUser.id && r.emoji === emoji
        );
        let newReactions = [...m.reactions];
        if (existingIdx >= 0) {
          newReactions.splice(existingIdx, 1);
        } else {
          // Remove existing different reaction by this user or allow multiple
          newReactions = newReactions.filter(r => r.userId !== currentUser.id);
          newReactions.push({
            emoji,
            userId: currentUser.id,
            userName: currentUser.nickname,
          });
        }
        return { ...m, reactions: newReactions };
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  const deleteMessage = (messageId: string) => {
    setAllMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: chatMsgs.filter(m => m.id !== messageId),
      };
    });
  };

  const createNewChat = (participantIds: string[], title?: string, isGroup = false): string => {
    const newChatId = `chat-${Date.now()}`;
    const allParticipantIds = Array.from(new Set([currentUser.id, ...participantIds]));

    const partner = members.find(m => participantIds.includes(m.id));
    const computedTitle = isGroup
      ? title || 'Family Chat Group'
      : partner?.name || 'Private Chat';
    const computedAvatar = isGroup
      ? '/src/assets/images/family_photo_park_1790394119074.jpg'
      : partner?.avatar;

    const newChat: Chat = {
      id: newChatId,
      isGroup,
      title: computedTitle,
      avatar: computedAvatar,
      participantIds: allParticipantIds,
      unreadCount: 0,
      lastMessage: {
        text: isGroup ? 'Family group created' : 'Chat started',
        senderId: currentUser.id,
        senderName: currentUser.nickname,
        timestamp: 'Just now',
        createdAt: Date.now(),
      },
    };

    setChats(prev => [newChat, ...prev]);
    setAllMessages(prev => ({
      ...prev,
      [newChatId]: [
        {
          id: `msg-init-${Date.now()}`,
          chatId: newChatId,
          senderId: currentUser.id,
          text: isGroup
            ? `Welcome to ${computedTitle}! 🎉`
            : `Hello ${partner?.name || ''}! 👋`,
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          createdAt: Date.now(),
          status: 'read',
          reactions: [],
        },
      ],
    }));

    setActiveChatId(newChatId);
    return newChatId;
  };

  // Calling logic
  const startCall = async (chatId: string, type: CallType) => {
    soundService.startOutgoingRinging();

    const targetChat = chats.find(c => c.id === chatId) || activeChat;
    const isGroup = targetChat.isGroup;

    // Get participants
    const otherMemberIds = targetChat.participantIds.filter(id => id !== currentUser.id);
    const initialParticipants = [
      {
        memberId: currentUser.id,
        name: currentUser.nickname,
        avatar: currentUser.avatar,
        role: currentUser.role,
        isMuted: false,
        isVideoOff: type === 'voice',
        isSpeaking: false,
        isScreenSharing: false,
      },
      ...otherMemberIds.map(id => {
        const mem = members.find(m => m.id === id);
        return {
          memberId: id,
          name: mem?.nickname || 'Family Member',
          avatar: mem?.avatar || '',
          role: mem?.role || 'Family',
          isMuted: false,
          isVideoOff: type === 'voice',
          isSpeaking: false,
          isScreenSharing: false,
        };
      }),
    ];

    // Try acquiring real local camera/mic stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === 'video',
          audio: true,
        });
        setLocalStream(stream);
      }
    } catch {
      // Permission denied or preview sandbox constraint: seamless simulated video stream
    }

    // Connect after 1.5s ringing simulation
    window.setTimeout(() => {
      soundService.stopRinging();
      soundService.playCallConnected();

      setActiveCall({
        id: `call-${Date.now()}`,
        chatId: targetChat.id,
        chatTitle: targetChat.title,
        type,
        startTime: Date.now(),
        participants: initialParticipants,
        isGroup,
        isScreenSharing: false,
      });
    }, 1500);
  };

  const endCall = () => {
    soundService.stopRinging();
    soundService.playCallEnded();

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    setActiveCall(null);
    setIsScreenSharing(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (localStream) {
        localStream.getAudioTracks().forEach(track => {
          track.enabled = !next;
        });
      }
      return next;
    });
  };

  const toggleVideo = async () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);

    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !nextVideoOff;
      });
    } else if (!nextVideoOff) {
      // Try to re-request video
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setLocalStream(stream);
      } catch {
        // Fallback
      }
    }
  };

  const toggleScreenShare = async (source: 'native' | 'tech_assist' | 'photos' | 'recipe' = 'native') => {
    if (isScreenSharing && screenShareSource === source) {
      // Turn off screen sharing
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      setIsScreenSharing(false);
      return;
    }

    setScreenShareSource(source);

    if (source === 'native') {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          const track = displayStream.getVideoTracks()[0];
          screenTrackRef.current = track;

          track.onended = () => {
            setIsScreenSharing(false);
          };
          setIsScreenSharing(true);
        } else {
          // Native getDisplayMedia not supported in this frame, use Tech Assist / Interactive Board
          setScreenShareSource('tech_assist');
          setIsScreenSharing(true);
        }
      } catch {
        // User cancelled native prompt or in sandbox -> launch Tech Assist interactive screen
        setScreenShareSource('tech_assist');
        setIsScreenSharing(true);
      }
    } else {
      // Interactive family collaborative share (Tech Help / Album / Recipes)
      setIsScreenSharing(true);
    }
  };

  // Incoming call handling
  const simulateIncomingCall = (callerRole = 'Grandmother') => {
    const caller = members.find(m => m.role === callerRole) || members[1];
    soundService.startIncomingRingtone();
    setIncomingCall({
      callId: `call-inc-${Date.now()}`,
      caller,
      type: 'video',
      chatId: 'chat-grandma',
      chatTitle: caller.name,
      isGroup: false,
    });
  };

  const acceptIncomingCall = async () => {
    if (!incomingCall) return;
    soundService.stopRinging();
    soundService.playCallConnected();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: incomingCall.type === 'video',
          audio: true,
        });
        setLocalStream(stream);
      }
    } catch {
      // Simulated video
    }

    setActiveCall({
      id: incomingCall.callId,
      chatId: incomingCall.chatId,
      chatTitle: incomingCall.caller.name,
      type: incomingCall.type,
      startTime: Date.now(),
      participants: [
        {
          memberId: currentUser.id,
          name: currentUser.nickname,
          avatar: currentUser.avatar,
          role: currentUser.role,
          isMuted: false,
          isVideoOff: false,
          isSpeaking: false,
          isScreenSharing: false,
        },
        {
          memberId: incomingCall.caller.id,
          name: incomingCall.caller.nickname,
          avatar: incomingCall.caller.avatar,
          role: incomingCall.caller.role,
          isMuted: false,
          isVideoOff: false,
          isSpeaking: true,
          isScreenSharing: false,
        },
      ],
      isGroup: incomingCall.isGroup,
      isScreenSharing: false,
    });

    setIncomingCall(null);
  };

  const declineIncomingCall = () => {
    soundService.stopRinging();
    soundService.playCallEnded();
    setIncomingCall(null);
  };

  const toggleSeniorMode = () => {
    setIsSeniorMode(prev => !prev);
  };

  const addFamilyEvent = (newEvent: Omit<FamilyEvent, 'id'>) => {
    const event: FamilyEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setFamilyEvents(prev => [event, ...prev]);

    // Also notify in family group chat
    sendMessage(`📅 New Family Event added: ${event.title} (${event.date})`);
  };

  const sendQuickCheckin = (type: 'safe' | 'home' | 'need_call' | 'dinner', customNote?: string) => {
    let checkinText = '';
    switch (type) {
      case 'safe':
        checkinText = `🟢 I am safe and sound! ${customNote || ''}`.trim();
        break;
      case 'home':
        checkinText = `🏡 I just arrived home safely! ${customNote || ''}`.trim();
        break;
      case 'need_call':
        checkinText = `📞 Quick request: Can someone give me a call when free? ${customNote || ''}`.trim();
        break;
      case 'dinner':
        checkinText = `🍲 Dinner is ready / heading to dinner! ${customNote || ''}`.trim();
        break;
    }

    sendMessage(checkinText, undefined, undefined, false, undefined, type);
  };

  const openLightbox = (media: MediaAttachment) => setLightboxMedia(media);
  const closeLightbox = () => setLightboxMedia(null);

  return (
    <FamilyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        members,
        updateMemberStatus,
        chats,
        activeChatId,
        setActiveChatId,
        activeChat,
        messages,
        sendMessage,
        addReaction,
        deleteMessage,
        createNewChat,
        activeCall,
        startCall,
        endCall,
        toggleMute,
        toggleVideo,
        isMuted,
        isVideoOff,
        localStream,
        isScreenSharing,
        screenShareSource,
        toggleScreenShare,
        incomingCall,
        acceptIncomingCall,
        declineIncomingCall,
        simulateIncomingCall,
        isSeniorMode,
        toggleSeniorMode,
        familyEvents,
        addFamilyEvent,
        sendQuickCheckin,
        lightboxMedia,
        openLightbox,
        closeLightbox,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
