
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  CARD = 'CARD',
  APTOS_WALLET = 'APTOS_WALLET'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  address?: string; // For Aptos wallets
}

export interface Category {
  id: string;
  name: string;
  icon: any; // Lucide icon component name or reference
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string
  note: string;
  categoryId: string;
  accountId: string;
  toAccountId?: string; // For transfers
  type: TransactionType;
  isGasless?: boolean; // For SmoothSend
  txHash?: string; // On-chain hash
}

export interface Budget {
  categoryId: string;
  limit: number;
}

export interface UserProfile {
  name: string;
  id: string;
  avatar?: string; // Base64 data URL
  isPremium: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export type WeekStart = 'Sunday' | 'Monday' | 'Saturday';

export type ViewState = 'TRANS' | 'STATS' | 'ACCOUNTS' | 'MORE' | 'SMOOTH_SEND' | 'ADD_OVERLAY' | 'CATEGORY_SETTINGS' | 'AI_CHAT';

// Mock SmoothSend SDK response
export interface SmoothSendResult {
  success: boolean;
  txHash?: string;
  feeSaved: number;
  timestamp: number;
}
