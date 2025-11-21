import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, Wallet, Smartphone, Lock, 
  RefreshCw, Share2, FileText, MessageSquare, 
  User, ArrowLeft, ChevronRight, Camera, Edit3, Check
} from 'lucide-react';
import { ViewState, UserProfile, Currency, WeekStart } from '../types';
import { CURRENCIES, WEEK_START_OPTIONS } from '../constants';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: ViewState) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  currency: Currency;
  onSetCurrency: (c: Currency) => void;
  startOfWeek: WeekStart;
  onSetStartOfWeek: (w: WeekStart) => void;
}

// --- Toggle Component ---
const Toggle = ({ isActive, onToggle }: { isActive: boolean, onToggle: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors cursor-pointer ${isActive ? 'bg-[#FF5252]' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);

// --- Currency Selection View ---
interface CurrencySelectViewProps {
  currentCurrency: Currency;
  onSelect: (c: Currency) => void;
  onBack: () => void;
}

const CurrencySelectView: React.FC<CurrencySelectViewProps> = ({ currentCurrency, onSelect, onBack }) => {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white animate-slide-left">
      <div className="sticky top-0 z-20 flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Main Currency</h2>
      </div>
      <div className="p-0">
        {CURRENCIES.map(curr => (
          <button
            key={curr.code}
            onClick={() => { onSelect(curr); onBack(); }}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800 active:bg-gray-100 dark:active:bg-[#1E1E1E]"
          >
             <div className="flex flex-col items-start">
               <span className="text-base font-medium">{curr.code} - {curr.name}</span>
               <span className="text-sm text-gray-500">{curr.symbol} Symbol</span>
             </div>
             {currentCurrency.code === curr.code && <Check size={20} className="text-[#FF5252]" />}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Week Start Selection View ---
interface WeekStartSelectViewProps {
  currentWeekStart: WeekStart;
  onSelect: (w: WeekStart) => void;
  onBack: () => void;
}

const WeekStartSelectView: React.FC<WeekStartSelectViewProps> = ({ currentWeekStart, onSelect, onBack }) => {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white animate-slide-left">
      <div className="sticky top-0 z-20 flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Start of Week</h2>
      </div>
      <div className="p-0">
        {WEEK_START_OPTIONS.map(day => (
          <button
            key={day}
            onClick={() => { onSelect(day); onBack(); }}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800 active:bg-gray-100 dark:active:bg-[#1E1E1E]"
          >
             <span className="text-base font-medium">{day}</span>
             {currentWeekStart === day && <Check size={20} className="text-[#FF5252]" />}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Profile Edit View ---
interface ProfileEditViewProps {
  userProfile: UserProfile;
  onSave: (p: UserProfile) => void;
  onBack: () => void;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({ userProfile, onSave, onBack }) => {
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...userProfile,
      name,
      avatar
    });
    onBack();
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white animate-slide-left">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </div>
        <button onClick={handleSave} className="text-[#FF5252] font-bold flex items-center gap-1">
          <Check size={18} /> Save
        </button>
      </div>

      <div className="p-8 flex flex-col items-center space-y-8">
        {/* Avatar Section */}
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#1E1E1E] shadow-2xl bg-gray-200 dark:bg-[#2C2C2C] flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-400 dark:text-gray-500" strokeWidth={1} />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={32} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 bg-[#FF5252] p-2 rounded-full shadow-lg border-2 border-white dark:border-[#121212]">
            <Edit3 size={16} className="text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>

        {/* Name Input */}
        <div className="w-full max-w-md space-y-2">
           <label className="text-xs text-gray-500 uppercase font-bold tracking-wider ml-1">Display Name</label>
           <input 
             type="text" 
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="w-full bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white p-4 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-[#FF5252] focus:ring-1 focus:ring-[#FF5252] outline-none transition-all text-lg"
             placeholder="Enter your name"
           />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">User ID</span>
                <span className="text-sm font-mono text-gray-500">{userProfile.id}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Account Type</span>
                <span className="text-xs font-bold bg-[#FF5252]/10 dark:bg-[#FF5252]/20 text-[#FF5252] px-2 py-1 rounded uppercase">Premium</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Configuration Sub-View ---
interface ConfigurationViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: ViewState) => void;
  currency: Currency;
  startOfWeek: WeekStart;
  onOpenCurrency: () => void;
  onOpenWeekStart: () => void;
}

const ConfigurationView: React.FC<ConfigurationViewProps> = ({ 
  onBack, isDarkMode, onToggleDarkMode, onNavigate, 
  currency, startOfWeek, onOpenCurrency, onOpenWeekStart
}) => {
  // Local state for mock settings
  const [isSubcategoryOn, setIsSubcategoryOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isPasscodeOn, setIsPasscodeOn] = useState(false);
  const [isBiometricsOn, setIsBiometricsOn] = useState(false);
  const [budgetMode, setBudgetMode] = useState(false);

  const SettingSectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-3 text-xs font-bold text-[#FF5252] uppercase tracking-wider bg-gray-200 dark:bg-[#1A1A1A] mt-2 first:mt-0 border-b border-gray-300 dark:border-gray-800">
      {title}
    </div>
  );

  interface SettingRowProps {
    label: string;
    value?: string;
    isToggle?: boolean;
    isOn?: boolean;
    onToggle?: () => void;
    onClick?: () => void;
  }

  const SettingRow = ({ label, value, isToggle, isOn, onToggle, onClick }: SettingRowProps) => (
    <div 
      onClick={isToggle ? onToggle : onClick} 
      className="flex justify-between items-center px-4 py-4 bg-white dark:bg-[#121212] active:bg-gray-100 dark:active:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 transition-colors cursor-pointer"
    >
      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{label}</span>
      
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-medium text-gray-500">{value}</span>}
        
        {isToggle ? (
          <Toggle isActive={!!isOn} onToggle={onToggle!} />
        ) : (
          <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white animate-slide-left pb-24 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Configuration</h2>
      </div>

      <div className="flex flex-col">
        <SettingSectionHeader title="Category/Repeat" />
        <SettingRow label="Categories" onClick={() => onNavigate('CATEGORY_SETTINGS')} />
        <SettingRow 
          label="Subcategory" 
          isToggle 
          isOn={isSubcategoryOn} 
          onToggle={() => setIsSubcategoryOn(!isSubcategoryOn)} 
        />
        <SettingRow 
          label="Budget Mode" 
          isToggle 
          isOn={budgetMode} 
          onToggle={() => setBudgetMode(!budgetMode)} 
        />

        <SettingSectionHeader title="General" />
        <SettingRow 
          label="Main Currency" 
          value={`${currency.code} (${currency.symbol})`} 
          onClick={onOpenCurrency} 
        />
        <SettingRow 
          label="Start of Week" 
          value={startOfWeek} 
          onClick={onOpenWeekStart} 
        />
        <SettingRow 
          label="Dark Mode" 
          isToggle 
          isOn={isDarkMode} 
          onToggle={onToggleDarkMode} 
        />
        <SettingRow 
          label="Sound Effect" 
          isToggle 
          isOn={isSoundOn} 
          onToggle={() => setIsSoundOn(!isSoundOn)} 
        />

        <SettingSectionHeader title="Security" />
        <SettingRow 
          label="Passcode" 
          isToggle 
          isOn={isPasscodeOn} 
          onToggle={() => setIsPasscodeOn(!isPasscodeOn)} 
        />
        <SettingRow 
          label="Biometrics" 
          isToggle 
          isOn={isBiometricsOn} 
          onToggle={() => setIsBiometricsOn(!isBiometricsOn)} 
        />
      </div>
    </div>
  );
};

// --- Main Grid View ---
export const Settings: React.FC<SettingsProps> = ({ 
  isDarkMode, onToggleDarkMode, onNavigate, 
  userProfile, onUpdateProfile,
  currency, onSetCurrency,
  startOfWeek, onSetStartOfWeek
}) => {
  const [subView, setSubView] = useState<'MAIN' | 'CONFIGURATION' | 'PROFILE_EDIT' | 'CURRENCY' | 'WEEK_START'>('MAIN');
  const isSharingRef = useRef(false);

  const handleShare = async () => {
    if (isSharingRef.current) return;
    
    const shareData = {
      title: 'Money Manager',
      text: 'Track your expenses with Aptos Money Manager!',
      url: 'https://aptos-money.app'
    };

    try {
      isSharingRef.current = true;
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Link copied to clipboard!");
      }
    } catch (error: any) {
      // Ignore abort errors
    } finally {
      isSharingRef.current = false;
    }
  };

  const GridItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 border-r border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] active:bg-gray-100 dark:active:bg-[#1E1E1E] transition-colors group relative hover:bg-gray-50 dark:hover:bg-[#1A1A1A]"
    >
      <Icon size={28} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white mb-3 transition-colors" />
      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">{label}</span>
    </button>
  );

  if (subView === 'CONFIGURATION') {
    return (
      <ConfigurationView 
        onBack={() => setSubView('MAIN')} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={onToggleDarkMode}
        onNavigate={onNavigate}
        currency={currency}
        startOfWeek={startOfWeek}
        onOpenCurrency={() => setSubView('CURRENCY')}
        onOpenWeekStart={() => setSubView('WEEK_START')}
      />
    );
  }

  if (subView === 'CURRENCY') {
    return (
      <CurrencySelectView 
        currentCurrency={currency}
        onSelect={onSetCurrency}
        onBack={() => setSubView('CONFIGURATION')}
      />
    );
  }

  if (subView === 'WEEK_START') {
    return (
      <WeekStartSelectView
        currentWeekStart={startOfWeek}
        onSelect={onSetStartOfWeek}
        onBack={() => setSubView('CONFIGURATION')}
      />
    );
  }

  if (subView === 'PROFILE_EDIT') {
    return (
      <ProfileEditView 
        userProfile={userProfile}
        onSave={onUpdateProfile}
        onBack={() => setSubView('MAIN')}
      />
    );
  }

  return (
    <div className="min-h-full bg-gray-100 dark:bg-[#121212] pb-24 md:pb-0 animate-fade-in">
      {/* Profile Header - Clickable now */}
      <button 
        onClick={() => setSubView('PROFILE_EDIT')}
        className="w-full bg-white dark:bg-[#1A1A1A] p-6 flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 active:bg-gray-50 dark:active:bg-[#252525] transition-colors text-left group"
      >
        <div className="w-16 h-16 bg-gray-200 dark:bg-[#2C2C2C] rounded-full flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700 shadow-inner overflow-hidden relative">
          {userProfile.avatar ? (
             <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
          ) : (
             <User size={32} strokeWidth={1.5} />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Edit3 size={20} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#FF5252] transition-colors">{userProfile.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            {userProfile.isPremium && (
                <span className="px-2 py-0.5 bg-[#FF5252] text-white text-[10px] font-bold rounded uppercase tracking-wider">Premium</span>
            )}
            <span className="text-xs text-gray-500">ID: {userProfile.id}</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white" />
      </button>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
        <GridItem icon={SettingsIcon} label="Configuration" onClick={() => setSubView('CONFIGURATION')} />
        <GridItem icon={Wallet} label="Accounts" onClick={() => onNavigate('ACCOUNTS')} />
        <GridItem icon={Smartphone} label="Pay" onClick={() => onNavigate('SMOOTH_SEND')} />
        
        <GridItem icon={Lock} label="Passcode" onClick={() => alert("Enter Passcode")} />
        <GridItem icon={RefreshCw} label="Backup" onClick={() => alert("Creating Backup...")} />
        <GridItem icon={Share2} label="Share" onClick={handleShare} />
        
        <GridItem icon={FileText} label="Excel" onClick={() => alert("Exporting to .CSV...")} />
        <GridItem icon={MessageSquare} label="Feedback" onClick={() => alert("Open Feedback Form")} />
      </div>

       {/* Footer */}
      <div className="p-8 text-center opacity-50 dark:opacity-30">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Aptos Money Manager
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          v3.1.0 (Build 245)
        </p>
      </div>
    </div>
  );
};