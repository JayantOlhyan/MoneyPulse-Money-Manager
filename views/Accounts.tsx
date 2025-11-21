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
    <div className="min-h-full bg-[#121212] text-white pb-24">
      {/* Header */}
      <div className="bg-[#1A1A1A] p-6 pb-10 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <button className="text-[#FF5252] text-sm font-medium">Edit</button>
        </div>
        <div className="flex flex-col">
             <span className="text-gray-500 text-sm mb-1">Total Assets</span>
             <span className="text-3xl font-bold">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* List */}
      <div className="mt-[-20px] mx-4 space-y-3">
        {accounts.map((acc) => {
          const Icon = getIcon(acc.type);
          return (
            <div key={acc.id} className="bg-[#1E1E1E] p-4 rounded-xl flex items-center justify-between shadow-lg border border-gray-800">
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${acc.type === AccountType.APTOS_WALLET ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                   <Icon size={24} />
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-200">{acc.name}</h3>
                   <p className="text-xs text-gray-500">{acc.type.replace('_', ' ')}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="font-bold text-lg">${acc.balance.toLocaleString()}</p>
                 <p className="text-xs text-gray-500">{acc.currency}</p>
               </div>
            </div>
          );
        })}

        {/* Add Account Button */}
        <button className="w-full py-4 border border-dashed border-gray-700 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
           <Plus size={20} /> Add Account
        </button>
      </div>
    </div>
  );
};