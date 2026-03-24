
import { CryptoWallet, Book, User, PlanDetails } from './types';

export const COMMISSIONS = {
  'E-book': 0.10,
  'Paper': 0.15,
  'Audiobook': 0.05
};

export const ALL_CURRENCIES = [
  { code: 'SOL', name: 'Solana', type: 'crypto' },
  { code: 'BTC', name: 'Bitcoin', type: 'crypto' },
  { code: 'ETH', name: 'Ethereum', type: 'crypto' },
  { code: 'USDT', name: 'Tether', type: 'crypto' },
  { code: 'MON', name: 'Monad', type: 'crypto' },
  { code: 'BASE', name: 'Base', type: 'crypto' },
  { code: 'SUI', name: 'Sui', type: 'crypto' },
  { code: 'MATIC', name: 'Polygon', type: 'crypto' },
  { code: 'USD', name: 'US Dollar', type: 'fiat' },
];

export const SUBSCRIPTION_PLANS: PlanDetails[] = [
  {
    id: 'Newbie',
    name: 'Newbie (Trial)',
    limit: 5,
    prices: { Daily: 0.5, Monthly: 5, Yearly: 40 },
    features: ['List up to 5 books', 'Standard AI Support', 'Basic Sales View']
  },
  {
    id: 'Pro',
    name: 'Professional',
    limit: 100,
    prices: { Daily: 3, Monthly: 25, Yearly: 220 },
    features: ['List up to 100 books', 'Auto-Featured Listings', 'Advanced Analytics']
  },
  {
    id: 'Enterprise',
    name: 'Business Elite',
    limit: Infinity,
    prices: { Daily: 7, Monthly: 60, Yearly: 550 },
    features: ['Unlimited Listings', '0% Platform Commissions', 'Custom Branding']
  }
];

export const WALLETS: CryptoWallet[] = [
  { name: 'Solana', symbol: 'SOL', address: 'F2UJS1wNzsfcQTknPsxBk7B25qWbU9JtiRW1eRgdwLJY', icon: 'sol' },
  { name: 'Ethereum', symbol: 'ETH', address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50', icon: 'eth' },
  { name: 'Monad', symbol: 'MON', address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50', icon: 'mon' },
  { name: 'Base', symbol: 'BASE', address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50', icon: 'base' },
  { name: 'Sui', symbol: 'SUI', address: '0x41629e22deff6965100a4c28567dea45036d0360e6126a9c7f9c8fb1860a36c4', icon: 'sui' },
  { name: 'Polygon', symbol: 'MATIC', address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50', icon: 'matic' },
  { name: 'Bitcoin', symbol: 'BTC', address: 'bc1q9s855ehn959s5t2g6kjt9q7pt5t55n9gq7gpd7', icon: 'btc' },
];

const storedName = localStorage.getItem('book_user_name') || 'User Name';
const storedHandle = localStorage.getItem('book_user_handle') || '@user';
const storedTier = localStorage.getItem('book_user_tier') as any || 'Newbie';

export const MOCK_USER: User = {
  id: 'u1',
  username: storedHandle,
  fullName: storedName,
  avatarUrl: `https://ui-avatars.com/api/?name=${storedName}&background=00FFBA&color=000`,
  points: 0,
  isVerified: storedTier !== 'Newbie',
  role: 'buyer',
  subscriptionTier: storedTier, 
  listingCount: JSON.parse(localStorage.getItem('book_listings') || '[]').length
};

export const MOCK_BOOKS: Book[] = [];
