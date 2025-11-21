import React, { useState, useEffect } from 'react';
import { ViewState, Transaction, Account, TransactionType, AccountType, Category } from './types';
import { INITIAL_ACCOUNTS, INITIAL_CATEGORIES, MOCK_HISTORY } from './constants';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard'; // This is now the "Trans." view
import { AddTransaction } from './views/AddTransaction';
import { Stats } from './views/Stats';
import { SmoothSend } from './views/SmoothSend';
import { Settings } from './views/Settings'; // This is now the "More" view
import { Accounts } from './views/Accounts';
import { AIChat } from './views/AIChat';
import { CategorySettings } from './views/CategorySettings';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('TRANS');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_HISTORY);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  
  // Force dark mode for the requested aesthetic
  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Set background color to match design
    document.body.style.backgroundColor = '#121212';
  }, []);
  
  // --- Handlers ---

  const handleAddTransaction = (
    amount: number,
    type: TransactionType,
    categoryId: string,
    accountId: string,
    note: string,
    date: string
  ) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount,
      type,
      categoryId,
      accountId,
      note,
      date,
    };

    setTransactions(prev => [newTx, ...prev]);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        let newBalance = acc.balance;
        if (type === TransactionType.INCOME) newBalance += amount;
        else newBalance -= amount;
        return { ...acc, balance: newBalance };
      }
      return acc;
    }));

    setIsAddOverlayOpen(false);
  };

  const handleSmoothSendComplete = (details: { amount: number, recipient: string, hash?: string }) => {
    const aptosAcc = accounts.find(a => a.type === AccountType.APTOS_WALLET);
    if (!aptosAcc) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: details.amount,
      type: TransactionType.EXPENSE,
      categoryId: '5', 
      accountId: aptosAcc.id,
      note: `Sent to ${details.recipient.slice(0, 6)}...`,
      date: new Date().toISOString(),
      isGasless: true,
      txHash: details.hash
    };

    setTransactions(prev => [newTx, ...prev]);
    
    setAccounts(prev => prev.map(acc => {
        if (acc.id === aptosAcc.id) {
            return { ...acc, balance: acc.balance - details.amount };
        }
        return acc;
    }));

    setView('TRANS');
  };

  const handleNavChange = (newView: ViewState) => {
    if (newView === 'ADD_OVERLAY') {
      setIsAddOverlayOpen(true);
    } else {
      setView(newView);
    }
  };

  // --- Render Logic ---

  const renderView = () => {
    switch (view) {
      case 'TRANS':
        return <Dashboard accounts={accounts} transactions={transactions} categories={categories} onNavigate={setView} />;
      case 'STATS':
        return <Stats transactions={transactions} categories={categories} />;
      case 'ACCOUNTS':
        return <Accounts accounts={accounts} />;
      case 'AI_CHAT':
        return <AIChat accounts={accounts} transactions={transactions} categories={categories} />;
      case 'SMOOTH_SEND':
        const aptosAcc = accounts.find(a => a.type === AccountType.APTOS_WALLET);
        if (!aptosAcc) return <div>No Aptos Wallet Found</div>;
        return (
            <SmoothSend 
                aptosAccount={aptosAcc} 
                onBack={() => setView('TRANS')}
                onTransactionComplete={handleSmoothSendComplete}
            />
        );
      case 'CATEGORY_SETTINGS':
        return (
            <CategorySettings
                categories={categories}
                onUpdateCategories={setCategories}
                onBack={() => setView('MORE')}
            />
        );
      case 'MORE':
        return (
          <Settings 
            isDarkMode={true} 
            onToggleDarkMode={() => {}}
            onNavigate={setView}
          />
        );
      default:
        return <Dashboard accounts={accounts} transactions={transactions} categories={categories} onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center text-gray-100 font-sans selection:bg-[#FF5252] selection:text-white">
        <div className="w-full max-w-md bg-[#121212] h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col">
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide relative">
                {renderView()}
            </div>

            {/* Bottom Navigation */}
            {view !== 'SMOOTH_SEND' && view !== 'CATEGORY_SETTINGS' && (
                <BottomNav currentView={view} onChangeView={handleNavChange} />
            )}

            {/* Add Transaction Overlay (Bottom Sheet) */}
            {isAddOverlayOpen && (
              <div className="absolute inset-0 z-50 flex items-end justify-center">
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                  onClick={() => setIsAddOverlayOpen(false)}
                />
                {/* Sheet */}
                <div className="w-full h-[85%] bg-[#1E1E1E] rounded-t-3xl relative shadow-2xl animate-slide-up overflow-hidden">
                  <AddTransaction 
                    accounts={accounts}
                    categories={categories}
                    onSave={handleAddTransaction}
                    onCancel={() => setIsAddOverlayOpen(false)}
                  />
                </div>
              </div>
            )}

        </div>
    </div>
  );
};

export default App;