
import React, { useState, useEffect } from 'react';
import { FileText, PieChart, Wallet, MoreHorizontal, Plus, Sparkles } from 'lucide-react';
import { ViewState, Transaction, Account, TransactionType, AccountType, Category, UserProfile, Currency, WeekStart } from './types';
import { INITIAL_ACCOUNTS, INITIAL_CATEGORIES, MOCK_HISTORY, INITIAL_USER_PROFILE, CURRENCIES, WEEK_START_OPTIONS } from './constants';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { AddTransaction } from './views/AddTransaction';
import { Stats } from './views/Stats';
import { SmoothSend } from './views/SmoothSend';
import { Settings } from './views/Settings';
import { Accounts } from './views/Accounts';
import { CategorySettings } from './views/CategorySettings';
import { AIChat } from './views/AIChat';

const App: React.FC = () => {
  // --- State with Persistence ---
  const [view, setView] = useState<ViewState>('TRANS');
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);

  // Helper to load from local storage or fall back to default
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return fallback;
    }
  };

  const [accounts, setAccounts] = useState<Account[]>(() => loadState('accounts', INITIAL_ACCOUNTS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', MOCK_HISTORY));
  const [categories, setCategories] = useState<Category[]>(() => loadState('categories', INITIAL_CATEGORIES));
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadState('userProfile', INITIAL_USER_PROFILE));
  
  // Settings State
  const [currency, setCurrency] = useState<Currency>(() => loadState('currency', CURRENCIES[0]));
  const [startOfWeek, setStartOfWeek] = useState<WeekStart>(() => loadState('startOfWeek', WEEK_START_OPTIONS[0]));
  const [isDarkMode, setIsDarkMode] = useState(() => loadState('isDarkMode', true));
  
  // --- Effects ---
  useEffect(() => localStorage.setItem('accounts', JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('userProfile', JSON.stringify(userProfile)), [userProfile]);
  useEffect(() => localStorage.setItem('currency', JSON.stringify(currency)), [currency]);
  useEffect(() => localStorage.setItem('startOfWeek', JSON.stringify(startOfWeek)), [startOfWeek]);
  useEffect(() => localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode)), [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0a0a0a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f4f6';
    }
  }, [isDarkMode]);
  
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
        return (
          <Dashboard 
            accounts={accounts} 
            transactions={transactions} 
            categories={categories} 
            onNavigate={setView}
            currency={currency}
          />
        );
      case 'STATS':
        return (
          <Stats 
            transactions={transactions} 
            categories={categories}
            currency={currency}
          />
        );
      case 'ACCOUNTS':
        return <Accounts accounts={accounts} />;
      case 'AI_CHAT':
        return (
          <AIChat 
            accounts={accounts}
            transactions={transactions}
            categories={categories}
          />
        );
      case 'SMOOTH_SEND':
        const aptosAcc = accounts.find(a => a.type === AccountType.APTOS_WALLET);
        if (!aptosAcc) return <div className="p-8 text-center dark:text-white">No Aptos Wallet Found</div>;
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
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onNavigate={setView}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            currency={currency}
            onSetCurrency={setCurrency}
            startOfWeek={startOfWeek}
            onSetStartOfWeek={setStartOfWeek}
          />
        );
      default:
        return <Dashboard accounts={accounts} transactions={transactions} categories={categories} onNavigate={setView} currency={currency} />;
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => handleNavChange(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
        view === id 
          ? 'bg-[#FF5252]/10 text-[#FF5252] font-semibold' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2C]'
      }`}
    >
      <Icon size={20} strokeWidth={view === id ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] flex text-gray-900 dark:text-gray-100 font-sans selection:bg-[#FF5252] selection:text-white overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-gray-800 z-50">
          <div className="p-6 pb-2">
             <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF5252] to-purple-500 bg-clip-text text-transparent">MoneyPulse</h1>
             <p className="text-xs text-gray-500 dark:text-gray-500 tracking-wider uppercase font-medium mt-1">Aptos Money Manager</p>
          </div>

          <div className="p-4">
            <button 
              onClick={() => setIsAddOverlayOpen(true)}
              className="w-full bg-[#FF5252] hover:bg-red-600 active:bg-red-700 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={20} strokeWidth={3} />
              <span>Add Transaction</span>
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
             <div className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 py-2 mt-2">Menu</div>
             <SidebarItem id="TRANS" icon={FileText} label="Transactions" />
             <SidebarItem id="STATS" icon={PieChart} label="Statistics" />
             <SidebarItem id="ACCOUNTS" icon={Wallet} label="Accounts" />
             
             <div className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 py-2 mt-6">Smart Features</div>
             <SidebarItem id="AI_CHAT" icon={Sparkles} label="Financial Advisor" />
             
             <div className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 py-2 mt-6">Settings</div>
             <SidebarItem id="MORE" icon={MoreHorizontal} label="Settings" />
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
             <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] cursor-pointer" onClick={() => setView('MORE')}>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#333] overflow-hidden">
                   {userProfile.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{userProfile.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile.isPremium ? 'Premium User' : 'Free Plan'}</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 h-full relative flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto scrollbar-hide relative">
                <div className="w-full min-h-full flex flex-col">
                  <div className="flex-1 w-full max-w-5xl mx-auto bg-white dark:bg-[#121212] shadow-none md:shadow-xl min-h-full md:min-h-[calc(100vh-2rem)] md:my-4 md:rounded-2xl overflow-hidden border-0 md:border border-gray-200 dark:border-gray-800 relative">
                      {renderView()}
                  </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav currentView={view} onChangeView={handleNavChange} />
        </div>

        {/* Add Transaction Overlay */}
        {isAddOverlayOpen && (
          <div className="absolute inset-0 z-[100] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsAddOverlayOpen(false)}
            />
            {/* Sheet/Modal */}
            <div className="w-full md:w-auto md:min-w-[500px] h-[85%] md:h-auto md:max-h-[90vh] bg-gray-50 dark:bg-[#1E1E1E] rounded-t-3xl md:rounded-2xl relative shadow-2xl animate-slide-up overflow-hidden flex flex-col">
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
  );
};

export default App;
