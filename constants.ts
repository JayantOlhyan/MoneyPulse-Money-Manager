import { Account, AccountType, Category, TransactionType, UserProfile, Currency, WeekStart } from './types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const WEEK_START_OPTIONS: WeekStart[] = ['Sunday', 'Monday', 'Saturday'];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Cash', type: AccountType.CASH, balance: 150.00, currency: 'USD' },
  { id: '2', name: 'Chase Bank', type: AccountType.BANK, balance: 2450.50, currency: 'USD' },
  { id: '3', name: 'Aptos Wallet', type: AccountType.APTOS_WALLET, balance: 125.00, currency: 'USDC', address: '0x123...abc' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'Utensils', color: '#FF5252', type: TransactionType.EXPENSE },
  { id: '2', name: 'Transport', icon: 'Bus', color: '#448AFF', type: TransactionType.EXPENSE },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: '#7C4DFF', type: TransactionType.EXPENSE },
  { id: '4', name: 'Entertainment', icon: 'Film', color: '#FFAB40', type: TransactionType.EXPENSE },
  { id: '5', name: 'Bills', icon: 'Receipt', color: '#607D8B', type: TransactionType.EXPENSE },
  { id: '6', name: 'Salary', icon: 'Briefcase', color: '#4CAF50', type: TransactionType.INCOME },
  { id: '7', name: 'Investment', icon: 'TrendingUp', color: '#00BCD4', type: TransactionType.INCOME },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Doe',
  id: '8839201',
  isPremium: true,
  avatar: '' // Empty default
};

export const MOCK_HISTORY = [
  { id: '101', amount: 45.50, date: new Date().toISOString(), note: 'Grocery run', categoryId: '1', accountId: '2', type: TransactionType.EXPENSE },
  { id: '102', amount: 12.00, date: new Date().toISOString(), note: 'Uber to work', categoryId: '2', accountId: '2', type: TransactionType.EXPENSE },
  { id: '103', amount: 2500.00, date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Monthly Salary', categoryId: '6', accountId: '2', type: TransactionType.INCOME },
];

export const AVAILABLE_ICONS = [
  'Utensils', 'Bus', 'ShoppingBag', 'Film', 'Receipt', 'Briefcase', 'TrendingUp',
  'Home', 'Smartphone', 'Wifi', 'Gift', 'Coffee', 'Music', 'Book', 'Heart', 'Smile',
  'Zap', 'Anchor', 'Award', 'Briefcase', 'Camera', 'Cloud', 'Droplet', 'Eye'
];

export const AVAILABLE_COLORS = [
  '#FF5252', '#448AFF', '#7C4DFF', '#FFAB40', '#607D8B', '#4CAF50', '#00BCD4',
  '#E91E63', '#9C27B0', '#3F51B5', '#009688', '#8BC34A', '#FFEB3B', '#FF9800', '#795548'
];