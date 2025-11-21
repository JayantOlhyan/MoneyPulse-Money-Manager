import { Account, AccountType, Category, TransactionType } from './types';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Cash', type: AccountType.CASH, balance: 150.00, currency: 'USD' },
  { id: '2', name: 'Chase Bank', type: AccountType.BANK, balance: 2450.50, currency: 'USD' },
  { id: '3', name: 'Aptos Hot Wallet', type: AccountType.APTOS_WALLET, balance: 125.00, currency: 'USDC', address: '0x123...abc' },
];

// Updated to match the "Charcoal & Red" aesthetic. 
// Using generic string names for icons which will be mapped in components
export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'Utensils', color: '#FF5252', type: TransactionType.EXPENSE },
  { id: '2', name: 'Transport', icon: 'Bus', color: '#FF9800', type: TransactionType.EXPENSE },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: '#2196F3', type: TransactionType.EXPENSE },
  { id: '4', name: 'Salary', icon: 'Briefcase', color: '#4CAF50', type: TransactionType.INCOME },
  { id: '5', name: 'Crypto', icon: 'Bitcoin', color: '#9C27B0', type: TransactionType.INCOME },
  { id: '6', name: 'Entertainment', icon: 'Film', color: '#E91E63', type: TransactionType.EXPENSE },
  { id: '7', name: 'Health', icon: 'Heart', color: '#F44336', type: TransactionType.EXPENSE },
  { id: '8', name: 'Education', icon: 'Book', color: '#3F51B5', type: TransactionType.EXPENSE },
  { id: '9', name: 'Bills', icon: 'FileText', color: '#607D8B', type: TransactionType.EXPENSE },
];

export const MOCK_HISTORY = [
  {
    id: '101',
    amount: 15.50,
    date: new Date().toISOString(),
    note: 'Lunch at Chipotle',
    categoryId: '1',
    accountId: '1',
    type: TransactionType.EXPENSE
  },
  {
    id: '103',
    amount: 45.00,
    date: new Date().toISOString(),
    note: 'Gas',
    categoryId: '2',
    accountId: '2',
    type: TransactionType.EXPENSE
  },
  {
    id: '102',
    amount: 1200,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    note: 'Monthly Salary',
    categoryId: '4',
    accountId: '2',
    type: TransactionType.INCOME
  },
  {
    id: '104',
    amount: 89.99,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    note: 'New Shoes',
    categoryId: '3',
    accountId: '2',
    type: TransactionType.EXPENSE
  }
];

export const AVAILABLE_ICONS = [
  'Utensils', 'Bus', 'ShoppingBag', 'Briefcase', 'Bitcoin', 'Film', 'Heart', 'Book', 'FileText',
  'Coffee', 'Car', 'Home', 'Smartphone', 'Wifi', 'Gift', 'Music', 'Gamepad', 'Plane',
  'Dumbbell', 'Stethoscope', 'GraduationCap', 'Baby', 'Dog', 'Cat', 'Hammer', 'Zap'
];

export const AVAILABLE_COLORS = [
  '#FF5252', '#FF9800', '#2196F3', '#4CAF50', '#9C27B0', '#E91E63', 
  '#F44336', '#3F51B5', '#607D8B', '#009688', '#FFC107', '#795548', 
  '#9E9E9E', '#673AB7', '#333333', '#FFFFFF'
];