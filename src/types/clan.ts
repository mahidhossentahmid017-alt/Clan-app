export type ActivityStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface UserBadge {
  id: string;
  name: string;
  icon: string; // emoji or identifier
  color: string;
}

export interface UserProfile {
  id: string;
  username: string;
  tag: string; // e.g. #1337
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  status: ActivityStatus;
  customStatus?: string;
  currentGame?: {
    name: string;
    details?: string;
    elapsedTime?: string;
    rank?: string;
  };
  badges: UserBadge[];
  followersCount: number;
  followingCount: number;
  level: number;
  isFriend?: boolean;
}

export type ChannelType = 'text' | 'voice' | 'announcement';

export interface Channel {
  id: string;
  guildId: string;
  name: string;
  type: ChannelType;
  topic?: string;
  unreadCount?: number;
  activeVoiceUsers?: string[]; // userIds
}

export interface ChannelCategory {
  id: string;
  guildId: string;
  name: string;
  channels: Channel[];
}

export interface ClanGuild {
  id: string;
  name: string;
  tag: string;
  icon: string;
  banner?: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  ownerId: string;
  gameCategory: string; // e.g. "Valorant", "Minecraft", "Cyberpunk", "RPG Hub"
  categories: ChannelCategory[];
  verified?: boolean;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'clip';
  url: string;
  name: string;
  size?: string;
  caption?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ClanMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorTag: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  createdAt: number;
  attachments?: MediaAttachment[];
  reactions: Reaction[];
  replyToId?: string;
  replyToAuthor?: string;
  replyToSnippet?: string;
  isVoiceNote?: boolean;
  voiceDuration?: number;
  isGameInvite?: boolean;
  gameInviteDetails?: {
    gameName: string;
    mode: string;
    currentParty: number;
    maxParty: number;
    roomCode: string;
  };
}

export interface SocialFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTag: string;
  badge?: string;
  gameTag?: string;
  createdAt: string;
  content: string;
  media?: {
    type: 'image' | 'video' | 'clip';
    url: string;
    caption?: string;
    likesCount: number;
  };
  likes: number;
  hasLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    time: string;
  }[];
}

export interface VoiceParticipant {
  userId: string;
  displayName: string;
  avatar: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  currentGame?: string;
}

export interface ActiveVoiceRoom {
  channelId: string;
  guildId: string;
  guildName: string;
  channelName: string;
  participants: VoiceParticipant[];
  screenShareSource?: 'native' | 'game_clip' | 'interactive_board';
}
