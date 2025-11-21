import React, { useState } from 'react';
import { Calendar, Edit2, Check } from 'lucide-react';
import { Account, TransactionType, Category } from '../types';
import * as LucideIcons from 'lucide-react';

interface AddTransactionProps {
  accounts: Account[];
  categories: Category[];
  onSave: (amount: number, type: TransactionType, categoryId: string, accountId: string, note: string, date: string) => void;
  onCancel: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onSave, onCancel }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amountStr, setAmountStr] = useState('0');
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Ensure a default category is selected when switching types
  React.useEffect(() => {
    const firstCat = categories.find(c => c.type === type);
    if (firstCat) setCategoryId(firstCat.id);
  }, [type, categories]);

  const handleNumPress = (num: string) => {
    if (amountStr === '0' && num !== '.') {
      setAmountStr(num);
    } else {
      if (num === '.' && amountStr.includes('.')) return;
      if (amountStr.replace('.', '').length >= 9) return; // Limit length
      setAmountStr(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (amountStr.length === 1) {
      setAmountStr('0');
    } else {
      setAmountStr(prev => prev.slice(0, -1));
    }
  };

  const handleSave = () => {
    const val = parseFloat(amountStr);
    if (val <= 0) return;
    onSave(val, type, categoryId, accountId, note, date);
  };

  const filteredCategories = categories.filter(c => c.type === type);
  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-white">
      {/* Header Tabs */}
      <div className="flex bg-[#121212] pt-2">
        {[TransactionType.EXPENSE, TransactionType.INCOME, TransactionType.TRANSFER].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 pb-3 pt-2 text-sm font-medium uppercase tracking-wide transition-colors relative ${
              type === t ? 'text-[#FF5252]' : 'text-gray-500'
            }`}
          >
            {t === TransactionType.EXPENSE ? 'Expense' : t === TransactionType.INCOME ? 'Income' : 'Transfer'}
            {type === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5252]" />}
          </button>
        ))}
      </div>

      {/* Main Inputs Display */}
      <div className="p-4 flex flex-col gap-4 border-b border-gray-800">
        {/* Top Row: Date | Account */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-2 bg-[#2C2C2C] px-3 py-1.5 rounded-full">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2C2C2C] px-3 py-1.5 rounded-full">
             <span>{accounts.find(a => a.id === accountId)?.name}</span>
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex justify-end items-baseline gap-1 py-2">
          <span className="text-2xl text-[#FF5252] font-bold">
            {type === TransactionType.EXPENSE ? '-' : type === TransactionType.INCOME ? '+' : ''}
          </span>
          <span className="text-5xl font-light tracking-tight">{amountStr}</span>
        </div>

        {/* Category & Note Preview */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: selectedCategory?.color || '#333' }}>
                {(() => {
                  const Icon = (LucideIcons as any)[selectedCategory?.icon || 'HelpCircle'];
                  return <Icon size={20} />;
                })()}
             </div>
             <span className="font-medium text-lg">{selectedCategory?.name}</span>
          </div>
          <div className="text-right flex-1 ml-4">
            {note ? (
              <span className="text-gray-300 text-sm">{note}</span>
            ) : (
              <span className="text-gray-600 text-sm italic">Add a note...</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid & Keypad Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Category Grid (Scrollable) */}
        <div className="flex-1 p-2 overflow-y-auto border-r border-gray-800">
          <div className="grid grid-cols-3 gap-2">
            {filteredCategories.map(cat => {
              const Icon = (LucideIcons as any)[cat.icon];
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${isSelected ? 'bg-[#2C2C2C]' : 'hover:bg-[#2C2C2C]/50'}`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isSelected ? 'scale-110' : 'scale-100'} ${!isSelected && 'grayscale opacity-70'}`}
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className={`text-[10px] truncate w-full text-center ${isSelected ? 'text-white font-medium' : 'text-gray-500'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Note Input Inline */}
          <div className="mt-4 px-2">
             <div className="bg-[#2C2C2C] rounded-lg flex items-center p-2">
                <Edit2 size={16} className="text-gray-500 mr-2" />
                <input 
                   type="text" 
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                   placeholder="Write a note"
                   className="bg-transparent text-sm text-white w-full focus:outline-none placeholder-gray-600"
                />
             </div>
          </div>
        </div>

        {/* Right: Numeric Keypad */}
        <div className="w-[40%] bg-[#161616] flex flex-col">
          <div className="grid grid-cols-3 flex-1">
            {['7','8','9','4','5','6','1','2','3','.','0','DEL'].map((key) => (
              <button
                key={key}
                onClick={() => key === 'DEL' ? handleBackspace() : handleNumPress(key)}
                className="flex items-center justify-center text-xl font-medium text-gray-200 active:bg-gray-800 transition-colors"
              >
                {key === 'DEL' ? '⌫' : key}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 h-16 border-t border-gray-800">
            <button onClick={onCancel} className="text-gray-400 font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-[#FF5252] text-white font-bold hover:bg-red-600 active:bg-red-700 transition-colors flex items-center justify-center gap-1">
              <Check size={18} />
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};