
export type BookType = 'E-book' | 'Audiobook' | 'Paper';
export type SubscriptionTier = 'Newbie' | 'Basic' | 'Pro' | 'Enterprise';
export type SubscriptionPeriod = 'Daily' | 'Monthly' | 'Yearly';
export type Language = 'ar' | 'en';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  currency: string;
  coverUrl: string;
  sellerId: string;
  type: BookType;
  category: string;
  description: string;
  commissionRate: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  points: number;
  isVerified: boolean;
  role: 'buyer' | 'seller' | 'admin';
  subscriptionTier: SubscriptionTier | 'Free';
  listingCount: number;
  userWalletAddress?: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';

export interface ChatMessage {
  id: string;
  senderId: string;
  type: MessageType;
  content: string; // text or URL or coords
  fileName?: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  participant: User;
  lastMessage?: string;
  unreadCount: number;
}

export interface CryptoWallet {
  name: string;
  symbol: string;
  address: string;
  icon: string;
}

export interface PlanDetails {
  id: SubscriptionTier;
  name: string;
  limit: number;
  prices: {
    Daily: number;
    Monthly: number;
    Yearly: number;
  };
  features: string[];
}
