import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Account, Category, Transaction, TransactionType, ViewState } from '../types';
import * as LucideIcons from 'lucide-react';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  // Filter transactions for current month
  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentDate.getMonth() && 
           tDate.getFullYear() === currentDate.getFullYear();
  });

  // Calculate totals
  const income = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expense = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const total = income - expense;

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-full bg-[#121212] text-gray-100">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-[#1A1A1A] border-b border-gray-800 shadow-md">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => changeMonth(-1)} className="p-2 text-gray-400 hover:text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold tracking-wide">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <button onClick={() => changeMonth(1)} className="p-2 text-gray-400 hover:text-white active:scale-90 transition-transform">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-3 gap-px bg-gray-800 pb-[1px]">
          <div className="bg-[#1A1A1A] p-3 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Income</span>
            <span className="text-sm font-semibold text-blue-400">{income.toLocaleString()}</span>
          </div>
          <div className="bg-[#1A1A1A] p-3 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Expense</span>
            <span className="text-sm font-semibold text-[#FF5252]">{expense.toLocaleString()}</span>
          </div>
          <div className="bg-[#1A1A1A] p-3 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total</span>
            <span className="text-sm font-semibold text-white">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="pb-24 pt-2">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm">No transactions this month</p>
          </div>
        ) : (
          sortedDates.map(dateStr => {
            const dayTransactions = groupedTransactions[dateStr];
            const dateObj = new Date(dateStr);
            const dayIncome = dayTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
            const dayExpense = dayTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);

            return (
              <div key={dateStr} className="mb-2">
                {/* Date Header */}
                <div className="sticky top-[118px] z-20 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2 flex justify-between items-end text-xs text-gray-500">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-300">{dateObj.getDate()}</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium uppercase">{dateObj.toLocaleString('default', { weekday: 'short' })}</span>
                      <span className="text-[10px] opacity-70">{dateObj.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {dayIncome > 0 && <span className="text-blue-400">{dayIncome.toFixed(2)}</span>}
                    {dayExpense > 0 && <span className="text-[#FF5252]">{dayExpense.toFixed(2)}</span>}
                  </div>
                </div>

                {/* Transactions */}
                <div>
                  {dayTransactions.map((tx) => {
                    const category = categories.find(c => c.id === tx.categoryId);
                    // Dynamic Icon Rendering
                    const IconComponent = (LucideIcons as any)[category?.icon || 'HelpCircle'];

                    return (
                      <div key={tx.id} className="group active:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between p-4 border-b border-gray-800/50 last:border-0">
                        <div className="flex items-center gap-4">
                          {/* Category Icon */}
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                            style={{ backgroundColor: category?.color || '#666' }}
                          >
                            <IconComponent size={18} strokeWidth={2} />
                          </div>
                          
                          {/* Details */}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-200">{category?.name || 'Unknown Category'}</span>
                            <span className="text-xs text-gray-500 line-clamp-1">{tx.note}</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className={`text-right font-medium ${tx.type === TransactionType.INCOME ? 'text-blue-400' : 'text-[#FF5252]'}`}>
                          {tx.type === TransactionType.INCOME ? '' : '-'}
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {tx.isGasless && <div className="text-[9px] text-yellow-500 uppercase tracking-wider mt-0.5">Gasless</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};