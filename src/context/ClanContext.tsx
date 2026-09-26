import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  ClanGuild,
  ClanMessage,
  SocialFeedPost,
  ActiveVoiceRoom,
  Channel,
  MediaAttachment,
  ActivityStatus,
} from '../types/clan';
import {
  INITIAL_PROFILES,
  INITIAL_GUILDS,
  INITIAL_CHANNEL_MESSAGES,
  INITIAL_SOCIAL_FEED,
} from '../data/clanInitialData';
import { soundService } from '../services/soundService';

interface ClanContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  profiles: UserProfile[];
  updateUserStatus: (status: ActivityStatus, customStatus?: string) => void;
  guilds: ClanGuild[];
  activeGuildId: string;
  setActiveGuildId: (id: string) => void;
  activeGuild: ClanGuild | undefined;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  activeChannel: Channel | undefined;
  channelMessages: ClanMessage[];
  sendChannelMessage: (
    content: string,
    attachments?: MediaAttachment[],
    replyToMessage?: ClanMessage,
    isVoice?: boolean,
    voiceDuration?: number,
    gameInvite?: ClanMessage['gameInviteDetails']
  ) => void;
  addChannelReaction: (messageId: string, emoji: string) => void;
  deleteChannelMessage: (messageId: string) => void;
  // Social Feed (Facebook style)
  socialPosts: SocialFeedPost[];
  createSocialPost: (content: string, media?: SocialFeedPost['media'], gameTag?: string) => void;
  togglePostLike: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  // Discord Voice Rooms & Screen Share
  activeVoiceRoom: ActiveVoiceRoom | null;
  joinVoiceRoom: (channelId: string) => void;
  leaveVoiceRoom: () => void;
  toggleVoiceMute: () => void;
  toggleVoiceDeafen: () => void;
  isVoiceMuted: boolean;
  isVoiceDeafened: boolean;
  isScreenSharing: boolean;
  screenShareSource: 'native' | 'game_clip' | 'interactive_board';
  toggleScreenShare: (source?: 'native' | 'game_clip' | 'interactive_board') => Promise<void>;
  localMediaStream: MediaStream | null;
  // Mobile / Low Resource Gamer Performance Mode
  isLowResourceMode: boolean;
  toggleLowResourceMode: () => void;
  // Active Profile Modal Viewer
  inspectedProfile: UserProfile | null;
  inspectProfile: (profile: UserProfile | null) => void;
  // Create Server / Guild Modal
  createGuild: (name: string, description: string, icon: string, gameCategory: string) => void;
  // Direct Messages between members
  openDirectMessage: (user: UserProfile) => void;
}

const ClanContext = createContext<ClanContextType | undefined>(undefined);

const STORAGE_PROFILES = 'clan_platform_profiles_v2';
const STORAGE_GUILDS = 'clan_platform_guilds_v2';
const STORAGE_POSTS = 'clan_platform_posts_v2';
const STORAGE_MSGS = 'clan_platform_msgs_v2';
const STORAGE_LOW_RES = 'clan_platform_lowres_v2';

export const ClanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILES);
      return stored ? JSON.parse(stored) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => profiles[0] || INITIAL_PROFILES[0]);

  const [guilds, setGuilds] = useState<ClanGuild[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_GUILDS);
      return stored ? JSON.parse(stored) : INITIAL_GUILDS;
    } catch {
      return INITIAL_GUILDS;
    }
  });

  const [activeGuildId, setActiveGuildId] = useState<string>('guild-clan-prime');
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-general');

  const [allMessages, setAllMessages] = useState<Record<string, ClanMessage[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MSGS);
      return stored ? JSON.parse(stored) : INITIAL_CHANNEL_MESSAGES;
    } catch {
      return INITIAL_CHANNEL_MESSAGES;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialFeedPost[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_POSTS);
      return stored ? JSON.parse(stored) : INITIAL_SOCIAL_FEED;
    } catch {
      return INITIAL_SOCIAL_FEED;
    }
  });

  // Low Resource Gaming Mode (Disables heavy blur filters, lowers tick rates, limits background renders for seamless 60-120fps on low-end mobile)
  const [isLowResourceMode, setIsLowResourceMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_LOW_RES) === 'true';
    } catch {
      return false;
    }
  });

  // Voice Rooms (Discord style low-latency voice room)
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<ActiveVoiceRoom | null>(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isVoiceDeafened, setIsVoiceDeafened] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareSource, setScreenShareSource] = useState<'native' | 'game_clip' | 'interactive_board'>('native');
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  const [inspectedProfile, setInspectedProfile] = useState<UserProfile | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GUILDS, JSON.stringify(guilds));
    } catch {}
  }, [guilds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MSGS, JSON.stringify(allMessages));
    } catch {}
  }, [allMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS, JSON.stringify(socialPosts));
    } catch {}
  }, [socialPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOW_RES, String(isLowResourceMode));
    } catch {}
  }, [isLowResourceMode]);

  const activeGuild = guilds.find(g => g.id === activeGuildId) || guilds[0];

  // Find active channel inside current active guild
  const allChannelsInActiveGuild = activeGuild?.categories.flatMap(c => c.channels) || [];
  const activeChannel =
    allChannelsInActiveGuild.find(c => c.id === activeChannelId) ||
    allChannelsInActiveGuild[0];

  const channelMessages = allMessages[activeChannelId] || [];

  const updateUserStatus = (status: ActivityStatus, customStatus?: string) => {
    setCurrentUser(prev => ({
      ...prev,
      status,
      customStatus: customStatus !== undefined ? customStatus : prev.customStatus,
    }));
    setProfiles(prev =>
      prev.map(p =>
        p.id === currentUser.id
          ? { ...p, status, customStatus: customStatus !== undefined ? customStatus : p.customStatus }
          : p
      )
    );
  };

  const sendChannelMessage = (
    content: string,
    attachments?: MediaAttachment[],
    replyToMessage?: ClanMessage,
    isVoice?: boolean,
    voiceDuration?: number,
    gameInvite?: ClanMessage['gameInviteDetails']
  ) => {
    if (!content.trim() && (!attachments || attachments.length === 0) && !isVoice && !gameInvite) return;

    const newMsg: ClanMessage = {
      id: `cmsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channelId: activeChannelId,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorTag: currentUser.tag,
      authorAvatar: currentUser.avatar,
      authorBadge: currentUser.badges[0] ? `${currentUser.badges[0].icon} ${currentUser.badges[0].name}` : undefined,
      content: content.trim(),
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      createdAt: Date.now(),
      attachments: attachments || [],
      reactions: [],
      replyToId: replyToMessage?.id,
      replyToAuthor: replyToMessage?.authorName,
      replyToSnippet: replyToMessage?.content.slice(0, 80),
      isVoiceNote: isVoice,
      voiceDuration: voiceDuration || (isVoice ? 8 : undefined),
      isGameInvite: !!gameInvite,
      gameInviteDetails: gameInvite,
    };

    setAllMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    soundService.playMessageChime();

    // Auto community gamer replies for realism
    simulateCommunityInteraction(activeChannelId, content);
  };

  const simulateCommunityInteraction = (channelId: string, userText: string) => {
    if (currentUser.id !== 'user-self') return;
    const lower = userText.toLowerCase();

    window.setTimeout(() => {
      let replyAuthor = profiles.find(p => p.id === 'user-valkyrie') || profiles[1];
      let replyContent = 'Let’s go! Squad comms are online and ready 🎯';

      if (lower.includes('clip') || lower.includes('ace') || lower.includes('win')) {
        replyContent = 'Sheesh! That reaction time is top tier. Dropped a like on your clip! 🔥';
      } else if (lower.includes('invite') || lower.includes('party') || lower.includes('lfg')) {
        replyAuthor = profiles.find(p => p.id === 'user-leo-striker') || profiles[4];
        replyContent = 'Sent you a party join request! Loading up Clan voice comms right now!';
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('gg')) {
        replyAuthor = profiles.find(p => p.id === 'user-grandma-rose') || profiles[2];
        replyContent = 'Hello dear! Wishing you victory and fun in your matches today! ❤️';
      }

      const simMsg: ClanMessage = {
        id: `cmsg-sim-${Date.now()}`,
        channelId,
        authorId: replyAuthor.id,
        authorName: replyAuthor.displayName,
        authorTag: replyAuthor.tag,
        authorAvatar: replyAuthor.avatar,
        authorBadge: replyAuthor.badges[0]?.name,
        content: replyContent,
        timestamp: 'Just now',
        createdAt: Date.now(),
        reactions: [{ emoji: '🔥', userId: currentUser.id, userName: currentUser.displayName }],
      };

      setAllMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), simMsg],
      }));

      soundService.playMessageChime();
    }, 2200);
  };

  const addChannelReaction = (messageId: string, emoji: string) => {
    setAllMessages(prev => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id !== messageId) return m;
        const exists = m.reactions.some(r => r.userId === currentUser.id && r.emoji === emoji);
        let newReactions = [...m.reactions];
        if (exists) {
          newReactions = newReactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji));
        } else {
          newReactions.push({
            emoji,
            userId: currentUser.id,
            userName: currentUser.displayName,
          });
        }
        return { ...m, reactions: newReactions };
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const deleteChannelMessage = (messageId: string) => {
    setAllMessages(prev => ({
      ...prev,
      [activeChannelId]: (prev[activeChannelId] || []).filter(m => m.id !== messageId),
    }));
  };

  // Social Feed Actions (Facebook Style)
  const createSocialPost = (content: string, media?: SocialFeedPost['media'], gameTag?: string) => {
    if (!content.trim() && !media) return;

    const newPost: SocialFeedPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorTag: `@${currentUser.username}`,
      badge: currentUser.badges[0]?.name,
      gameTag: gameTag || currentUser.currentGame?.name || 'Clan Gaming',
      createdAt: 'Just now',
      content: content.trim(),
      media,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
    };

    setSocialPosts(prev => [newPost, ...prev]);
    soundService.playMessageChime();
  };

  const togglePostLike = (postId: string) => {
    setSocialPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        const isLiked = post.hasLiked;
        return {
          ...post,
          hasLiked: !isLiked,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
        };
      })
    );
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setSocialPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              authorName: currentUser.displayName,
              authorAvatar: currentUser.avatar,
              text: text.trim(),
              time: 'Just now',
            },
          ],
        };
      })
    );
    soundService.playMessageChime();
  };

  // Voice Rooms & Screen Share (Discord Style)
  const joinVoiceRoom = async (channelId: string) => {
    soundService.playCallConnected();
    const targetChannel = allChannelsInActiveGuild.find(c => c.id === channelId);

    // Initial participants in room
    const currentRoomUsers = (targetChannel?.activeVoiceUsers || []).map(uid => {
      const u = profiles.find(p => p.id === uid);
      return {
        userId: uid,
        displayName: u?.displayName || 'Gamer',
        avatar: u?.avatar || '',
        isMuted: false,
        isDeafened: false,
        isSpeaking: Math.random() > 0.5,
        isScreenSharing: false,
        currentGame: u?.currentGame?.name,
      };
    });

    const selfParticipant = {
      userId: currentUser.id,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      isMuted: isVoiceMuted,
      isDeafened: isVoiceDeafened,
      isSpeaking: false,
      isScreenSharing: false,
      currentGame: currentUser.currentGame?.name,
    };

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setLocalMediaStream(stream);
      }
    } catch {
      // simulated voice
    }

    setActiveVoiceRoom({
      channelId,
      guildId: activeGuild.id,
      guildName: activeGuild.name,
      channelName: targetChannel?.name || 'Voice Room',
      participants: [selfParticipant, ...currentRoomUsers],
    });
  };

  const leaveVoiceRoom = () => {
    soundService.playCallEnded();
    if (localMediaStream) {
      localMediaStream.getTracks().forEach(t => t.stop());
      setLocalMediaStream(null);
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }
    setIsScreenSharing(false);
    setActiveVoiceRoom(null);
  };

  const toggleVoiceMute = () => {
    setIsVoiceMuted(prev => {
      const next = !prev;
      if (localMediaStream) {
        localMediaStream.getAudioTracks().forEach(t => (t.enabled = !next));
      }
      return next;
    });
  };

  const toggleVoiceDeafen = () => {
    setIsVoiceDeafened(prev => !prev);
  };

  const toggleScreenShare = async (source: 'native' | 'game_clip' | 'interactive_board' = 'native') => {
    if (isScreenSharing && screenShareSource === source) {
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
          const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const track = displayStream.getVideoTracks()[0];
          screenTrackRef.current = track;
          track.onended = () => setIsScreenSharing(false);
          setIsScreenSharing(true);
        } else {
          setScreenShareSource('game_clip');
          setIsScreenSharing(true);
        }
      } catch {
        setScreenShareSource('game_clip');
        setIsScreenSharing(true);
      }
    } else {
      setIsScreenSharing(true);
    }
  };

  const toggleLowResourceMode = () => {
    setIsLowResourceMode(prev => !prev);
  };

  const inspectProfile = (profile: UserProfile | null) => {
    setInspectedProfile(profile);
  };

  const createGuild = (name: string, description: string, icon: string, gameCategory: string) => {
    const newGuildId = `guild-${Date.now()}`;
    const newGuild: ClanGuild = {
      id: newGuildId,
      name,
      tag: name.slice(0, 4).toUpperCase(),
      icon: icon || '🎮',
      description,
      memberCount: 1,
      onlineCount: 1,
      ownerId: currentUser.id,
      gameCategory: gameCategory || 'General Gaming',
      categories: [
        {
          id: `cat-${newGuildId}-main`,
          guildId: newGuildId,
          name: 'TEXT CHANNELS',
          channels: [
            {
              id: `chan-${newGuildId}-gen`,
              guildId: newGuildId,
              name: 'general',
              type: 'text',
              topic: `Welcome to ${name}!`,
            },
          ],
        },
        {
          id: `cat-${newGuildId}-voice`,
          guildId: newGuildId,
          name: 'VOICE CHANNELS',
          channels: [
            {
              id: `voice-${newGuildId}-lounge`,
              guildId: newGuildId,
              name: 'Lounge 1',
              type: 'voice',
              activeVoiceUsers: [],
            },
          ],
        },
      ],
    };

    setGuilds(prev => [...prev, newGuild]);
    setActiveGuildId(newGuildId);
    setActiveChannelId(`chan-${newGuildId}-gen`);
  };

  const openDirectMessage = (user: UserProfile) => {
    // switch or inspect
    inspectProfile(user);
  };

  return (
    <ClanContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        profiles,
        updateUserStatus,
        guilds,
        activeGuildId,
        setActiveGuildId,
        activeGuild,
        activeChannelId,
        setActiveChannelId,
        activeChannel,
        channelMessages,
        sendChannelMessage,
        addChannelReaction,
        deleteChannelMessage,
        socialPosts,
        createSocialPost,
        togglePostLike,
        addPostComment,
        activeVoiceRoom,
        joinVoiceRoom,
        leaveVoiceRoom,
        toggleVoiceMute,
        toggleVoiceDeafen,
        isVoiceMuted,
        isVoiceDeafened,
        isScreenSharing,
        screenShareSource,
        toggleScreenShare,
        localMediaStream,
        isLowResourceMode,
        toggleLowResourceMode,
        inspectedProfile,
        inspectProfile,
        createGuild,
        openDirectMessage,
      }}
    >
      {children}
    </ClanContext.Provider>
  );
};

export const useClan = () => {
  const context = useContext(ClanContext);
  if (!context) {
    throw new Error('useClan must be used within a ClanProvider');
  }
  return context;
};
