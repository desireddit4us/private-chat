export interface User {
  id: string;
  redditUsername: string;
  uniqueId: string;
  status: 'pending' | 'verified' | 'blocked';
  joinedAt: string;
  lastActive: string;
  isOnline: boolean;
  messageCount: number;
  hasAccess: boolean;
  accessGrantedContent: string[];
}

export interface ChatRequest {
  id: string;
  redditUsername: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'file' | 'timed_image';
  fileUrl?: string;
  fileName?: string;
  timerDuration?: number;
  expiresAt?: string;
  isExpired?: boolean;
}

export interface PrivateContent {
  id: string;
  title: string;
  description: string;
  type: 'redgif' | 'video' | 'image';
  url: string;
  uploadedAt: string;
  accessGrantedUsers: string[];
  viewCounts: Record<string, number>;
}

export interface Feedback {
  id: string;
  userId: string;
  phrase: string;
  content: string;
  rating: number;
  submittedAt: string;
  isVerified: boolean;
  redditPostUrl?: string;
}

export interface AdminSettings {
  allowScreenshots: boolean;
  allowDownloads: boolean;
  allowScreenRecording: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  customTabs: Array<{
    id: string;
    name: string;
    visible: boolean;
    component: string;
  }>;
}