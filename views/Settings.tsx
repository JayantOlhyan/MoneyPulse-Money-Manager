import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, Wallet, Smartphone, Lock, 
  Monitor, RefreshCw, Share2, FileText, MessageSquare, 
  User, ArrowLeft, ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: ViewState) => void;
}

// --- Toggle Component ---
const Toggle = ({ isActive, onToggle }: { isActive: boolean, onToggle: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors cursor-pointer ${isActive ? 'bg-[#FF5252]' : 'bg-gray-600'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);

// --- Configuration Sub-View ---
interface ConfigurationViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: ViewState) => void;
}

const ConfigurationView: React.FC<ConfigurationViewProps> = ({ onBack, isDarkMode, onToggleDarkMode, onNavigate }) => {
  // Local state for mock settings
  const [isSubcategoryOn, setIsSubcategoryOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isPasscodeOn, setIsPasscodeOn] = useState(false);
  const [isBiometricsOn, setIsBiometricsOn] = useState(false);
  const [budgetMode, setBudgetMode] = useState(false);

  const SettingSectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-3 text-xs font-bold text-[#FF5252] uppercase tracking-wider bg-[#1A1A1A] mt-2 first:mt-0">
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
      className="flex justify-between items-center px-4 py-4 bg-[#121212] active:bg-[#1E1E1E] border-b border-gray-800 transition-colors cursor-pointer"
    >
      <span className="text-sm text-gray-200 font-medium">{label}</span>
      
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-medium text-gray-500">{value}</span>}
        
        {isToggle ? (
          <Toggle isActive={!!isOn} onToggle={onToggle!} />
        ) : (
          <ChevronRight size={16} className="text-gray-600" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-[#121212] text-white animate-slide-left pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 p-4 bg-[#1A1A1A] border-b border-gray-800 shadow-md">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Configuration</h2>
      </div>

      <div className="flex flex-col">
        <SettingSectionHeader title="Category/Repeat" />
        <SettingRow label="Income Category Settings" onClick={() => onNavigate('CATEGORY_SETTINGS')} />
        <SettingRow label="Expenses Category Settings" onClick={() => onNavigate('CATEGORY_SETTINGS')} />
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
        <SettingRow label="Main Currency" value="USD ($)" onClick={() => alert("Change Currency")} />
        <SettingRow label="Start of Week" value="Sunday" onClick={() => alert("Change Start of Week")} />
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
export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleDarkMode, onNavigate }) => {
  const [subView, setSubView] = useState<'MAIN' | 'CONFIGURATION'>('MAIN');
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
        // Simple alert as toast replacement in this context
        alert("Link copied to clipboard!");
      }
    } catch (error: any) {
      // Ignore abort errors (user cancelled share)
      if (error.name !== 'AbortError') {
         console.error('Error sharing:', error);
      }
    } finally {
      isSharingRef.current = false;
    }
  };

  const GridItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 border-r border-b border-gray-800 active:bg-[#1E1E1E] transition-colors group relative"
    >
      <Icon size={28} strokeWidth={1.5} className="text-gray-400 group-hover:text-white mb-3 transition-colors" />
      <span className="text-xs font-medium text-gray-500 group-hover:text-gray-300">{label}</span>
    </button>
  );

  if (subView === 'CONFIGURATION') {
    return (
      <ConfigurationView 
        onBack={() => setSubView('MAIN')} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={onToggleDarkMode}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#121212] pb-24 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-[#1A1A1A] p-6 flex items-center gap-4 border-b border-gray-800">
        <div className="w-16 h-16 bg-[#2C2C2C] rounded-full flex items-center justify-center text-gray-400 border border-gray-700 shadow-inner">
          <User size={32} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Demo User</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-[#FF5252] text-white text-[10px] font-bold rounded uppercase tracking-wider">Premium</span>
            <span className="text-xs text-gray-500">ID: 849201</span>
          </div>
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 border-t border-gray-800 bg-[#121212]">
        <GridItem icon={SettingsIcon} label="Configuration" onClick={() => setSubView('CONFIGURATION')} />
        <GridItem icon={Wallet} label="Accounts" onClick={() => onNavigate('ACCOUNTS')} />
        <GridItem icon={Smartphone} label="Pay" onClick={() => onNavigate('SMOOTH_SEND')} />
        
        <GridItem icon={Lock} label="Passcode" onClick={() => alert("Enter Passcode")} />
        <GridItem icon={Monitor} label="PC Manager" onClick={() => alert("Connect to PC via Wi-Fi")} />
        <GridItem icon={RefreshCw} label="Backup" onClick={() => alert("Creating Backup...")} />
        
        <GridItem icon={Share2} label="Share" onClick={handleShare} />
        <GridItem icon={FileText} label="Excel" onClick={() => alert("Exporting to .CSV...")} />
        <GridItem icon={MessageSquare} label="Feedback" onClick={() => alert("Open Feedback Form")} />
      </div>

       {/* Footer */}
      <div className="p-8 text-center opacity-30">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Aptos Money Manager
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          v3.0.1 (Build 240)
        </p>
      </div>
    </div>
  );
};