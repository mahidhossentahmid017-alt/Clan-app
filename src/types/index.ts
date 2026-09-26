export interface FamilyMember {
  id: string;
  name: string;
  role: 'Grandmother' | 'Mother' | 'Father' | 'Son' | 'Daughter' | 'Family';
  nickname: string;
  avatar: string;
  color: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage: string;
  phoneNumber?: string;
  birthday?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  size?: string;
  duration?: number; // for audio/video in seconds
  caption?: string;
  thumbnail?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  createdAt: number;
  status: 'sent' | 'delivered' | 'read';
  attachments?: MediaAttachment[];
  reactions: Reaction[];
  replyToId?: string;
  replyToText?: string;
  replyToSenderName?: string;
  isVoiceNote?: boolean;
  voiceDuration?: number;
  voiceWaveform?: number[];
  isImportant?: boolean;
  isCheckin?: boolean;
  checkinType?: 'safe' | 'home' | 'need_call' | 'dinner';
}

export interface Chat {
  id: string;
  isGroup: boolean;
  title: string;
  avatar?: string;
  participantIds: string[];
  unreadCount: number;
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    createdAt: number;
    isMedia?: boolean;
  };
  pinnedAnnouncement?: string;
}

export type CallType = 'voice' | 'video';

export interface CallParticipant {
  memberId: string;
  name: string;
  avatar: string;
  role: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

export interface ActiveCall {
  id: string;
  chatId: string;
  chatTitle: string;
  type: CallType;
  startTime: number;
  participants: CallParticipant[];
  isGroup: boolean;
  isScreenSharing: boolean;
  screenShareSource?: 'native' | 'tech_assist' | 'photos' | 'recipe';
}

export interface IncomingCallNotification {
  callId: string;
  caller: FamilyMember;
  type: CallType;
  chatId: string;
  chatTitle: string;
  isGroup: boolean;
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  organizer: string;
  attendees: string[];
}
