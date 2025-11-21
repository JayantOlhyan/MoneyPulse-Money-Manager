import React from 'react';
import { Account, AccountType } from '../types';
import { Wallet, Building2, CreditCard, Zap, Plus } from 'lucide-react';

interface AccountsProps {
  accounts: Account[];
}

export const Accounts: React.FC<AccountsProps> = ({ accounts }) => {
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const getIcon = (type: AccountType) => {
    switch(type) {
      case AccountType.CASH: return Wallet;
      case AccountType.BANK: return Building2;
      case AccountType.CARD: return CreditCard;
      case AccountType.APTOS_WALLET: return Zap;
      default: return Wallet;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1A1A] p-6 pb-10 md:pb-6 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <button className="text-[#FF5252] text-sm font-medium">Edit</button>
        </div>
        <div className="flex flex-col">
             <span className="text-gray-500 text-sm mb-1">Total Assets</span>
             <span className="text-3xl font-bold text-gray-900 dark:text-white">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* List/Grid */}
      <div className="mt-[-20px] md:mt-6 mx-4">
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {accounts.map((acc) => {
            const Icon = getIcon(acc.type);
            return (
                <div key={acc.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl flex items-center justify-between shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${acc.type === AccountType.APTOS_WALLET ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                    <Icon size={24} />
                    </div>
                    <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-200">{acc.name}</h3>
                    <p className="text-xs text-gray-500">{acc.type.replace('_', ' ')}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">${acc.balance.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{acc.currency}</p>
                </div>
                </div>
            );
            })}

            {/* Add Account Button */}
            <button className="w-full h-full min-h-[80px] py-4 md:py-0 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors bg-transparent">
            <Plus size={20} /> Add Account
            </button>
        </div>
      </div>
    </div>
  );
};