import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, ShieldCheck, User, ScanLine } from 'lucide-react';
import { Account } from '../types';
import { smoothSendTransfer } from '../services/smoothSendService';

interface SmoothSendProps {
  aptosAccount: Account;
  onBack: () => void;
  onTransactionComplete: (txDetails: any) => void;
}

export const SmoothSend: React.FC<SmoothSendProps> = ({ aptosAccount, onBack, onTransactionComplete }) => {
  const [step, setStep] = useState<'INPUT' | 'CONFIRM' | 'PROCESSING' | 'SUCCESS'>('INPUT');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState('');

  const handleConfirm = async () => {
    setStep('PROCESSING');
    try {
      const result = await smoothSendTransfer(recipient, parseFloat(amount));
      if (result.success) {
        setTxHash(result.txHash || '');
        setStep('SUCCESS');
        // Notify parent after a delay to let user see success screen
        setTimeout(() => {
          onTransactionComplete({
            amount: parseFloat(amount),
            recipient,
            hash: result.txHash
          });
        }, 2000);
      }
    } catch (e: any) {
      setError(e.message);
      setStep('INPUT');
    }
  };

  if (step === 'PROCESSING') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Processing SmoothSend™</h2>
        <p className="text-gray-500">Broadcasting gasless transaction to Aptos Network...</p>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-green-50 p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Transfer Sent!</h2>
        <p className="text-green-700 mb-6">Your USDC has been sent without gas fees.</p>
        <div className="bg-white p-4 rounded-xl w-full max-w-xs shadow-sm border border-green-100 text-left">
          <p className="text-xs text-gray-400 uppercase mb-1">Transaction Hash</p>
          <p className="text-xs text-gray-800 font-mono break-all">{txHash}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 pt-6 flex items-center gap-4 shadow-md">
        <button onClick={onBack} className="p-1 hover:bg-gray-700 rounded-full"><ArrowLeft size={24} /></button>
        <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
                Aptos SmoothSend <Zap size={16} className="text-yellow-400 fill-current" />
            </h2>
            <p className="text-xs text-gray-400">Gasless Stablecoin Transfer</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -mr-10 -mt-10"></div>
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <h3 className="text-3xl font-bold flex items-baseline gap-1">
                {aptosAccount.balance.toFixed(2)} <span className="text-lg font-normal text-gray-400">USDC</span>
            </h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-900/30 w-fit px-2 py-1 rounded border border-green-900/50">
                <Zap size={12} /> Gas fees covered by sponsor
            </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <button className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500">
                        <ScanLine size={18} />
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USDC)</label>
                <div className="relative">
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-semibold"
                    />
                    <span className="absolute right-4 top-4 text-gray-500 font-medium text-sm">USDC</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
         <button 
            onClick={handleConfirm}
            disabled={!recipient || !amount || parseFloat(amount) > aptosAccount.balance}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-black transition-all"
         >
            Send Now (Gasless)
         </button>
      </div>
    </div>
  );
};