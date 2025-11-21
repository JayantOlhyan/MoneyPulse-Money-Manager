import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Account, Category, Transaction, TransactionType, ViewState, Currency } from '../types';
import * as LucideIcons from 'lucide-react';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  onNavigate: (view: ViewState) => void;
  currency: Currency;
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories, onNavigate, currency }) => {
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
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-md transition-colors">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => changeMonth(-1)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:scale-90 transition-transform rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <button onClick={() => changeMonth(1)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:scale-90 transition-transform rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Summary Strip - Responsive Grid */}
        <div className="md:p-6 md:bg-gray-50 md:dark:bg-[#121212]">
          <div className="grid grid-cols-3 gap-px md:gap-4 bg-gray-200 dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent pb-[1px] md:pb-0">
            <div className="bg-white dark:bg-[#1A1A1A] p-3 md:p-5 md:rounded-2xl md:shadow-sm md:border border-gray-200 dark:border-gray-800 flex flex-col items-center md:items-start">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Income</span>
              <span className="text-sm md:text-xl font-semibold text-blue-600 dark:text-blue-400">{currency.symbol}{income.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] p-3 md:p-5 md:rounded-2xl md:shadow-sm md:border border-gray-200 dark:border-gray-800 flex flex-col items-center md:items-start">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Expense</span>
              <span className="text-sm md:text-xl font-semibold text-[#FF5252]">{currency.symbol}{expense.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] p-3 md:p-5 md:rounded-2xl md:shadow-sm md:border border-gray-200 dark:border-gray-800 flex flex-col items-center md:items-start">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Total</span>
              <span className="text-sm md:text-xl font-semibold text-gray-900 dark:text-white">{currency.symbol}{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="pb-24 pt-2 md:px-6 flex-1">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm">No transactions this month</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {sortedDates.map(dateStr => {
              const dayTransactions = groupedTransactions[dateStr];
              const dateObj = new Date(dateStr);
              const dayIncome = dayTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
              const dayExpense = dayTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);

              return (
                <div key={dateStr} className="mb-4 md:bg-white md:dark:bg-[#1A1A1A] md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:dark:border-gray-800 md:overflow-hidden">
                  {/* Date Header */}
                  <div className="sticky top-[118px] md:static z-20 bg-gray-50/95 dark:bg-[#121212]/95 md:bg-gray-50 md:dark:bg-[#252525] backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex justify-between items-end text-xs text-gray-500">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{dateObj.getDate()}</span>
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium uppercase">{dateObj.toLocaleString('default', { weekday: 'short' })}</span>
                        <span className="text-[10px] opacity-70">{dateObj.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {dayIncome > 0 && <span className="text-blue-600 dark:text-blue-400">{currency.symbol}{dayIncome.toFixed(2)}</span>}
                      {dayExpense > 0 && <span className="text-[#FF5252]">{currency.symbol}{dayExpense.toFixed(2)}</span>}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-white dark:bg-transparent">
                    {dayTransactions.map((tx) => {
                      const category = categories.find(c => c.id === tx.categoryId);
                      // Dynamic Icon Rendering
                      const IconComponent = (LucideIcons as any)[category?.icon || 'HelpCircle'];

                      return (
                        <div key={tx.id} className="group dark:bg-[#121212] md:dark:bg-[#1A1A1A] active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525]">
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
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{category?.name || 'Unknown Category'}</span>
                              <span className="text-xs text-gray-500 line-clamp-1">{tx.note}</span>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className={`text-right font-medium ${tx.type === TransactionType.INCOME ? 'text-blue-600 dark:text-blue-400' : 'text-[#FF5252]'}`}>
                            {tx.type === TransactionType.INCOME ? '' : '-'}
                            {currency.symbol}
                            {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {tx.isGasless && <div className="text-[9px] text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mt-0.5">Gasless</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};