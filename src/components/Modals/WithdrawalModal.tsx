import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Landmark, Smartphone, Wallet, Loader2, CheckCircle2 } from 'lucide-react';

interface WithdrawModalProps {
  balance: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const METHODS = [
  { id: 'bank', name: 'Bank Transfer', icon: Landmark },
  { id: 'upi', name: 'Mobile Pay', icon: Smartphone },
  { id: 'e-wallet', name: 'Skrill/Neteller', icon: Wallet },
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ balance, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [method, setMethod] = useState('bank');
  const [amount, setAmount] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > balance) return;
    setStep('processing');
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onSuccess(parseFloat(amount));
            onClose();
        }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#1b1f2d] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-black uppercase italic tracking-tight">Withdraw Funds</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            {step === 'form' ? (
                <form onSubmit={handleWithdraw} className="space-y-6">
                    <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-gray-500 uppercase">Available Balance</div>
                        <div className="text-xl font-black text-green-500">${balance.toFixed(2)}</div>
                    </div>

                    <div className="space-y-3">
                        {METHODS.map(m => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setMethod(m.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${method === m.id ? 'bg-white/10 border-white/20' : 'bg-black/20 border-transparent hover:border-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <m.icon size={20} className="text-gray-400" />
                                    <span className="font-bold text-sm">{m.name}</span>
                                </div>
                                {method === m.id && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Amount to withdraw</label>
                        <input 
                            required
                            type="number"
                            max={balance}
                            placeholder="Min. $20"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 font-bold outline-none focus:border-red-500/50 transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase italic"
                    >
                        Confirm Withdrawal
                    </button>
                </form>
            ) : step === 'processing' ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={48} className="text-red-500 animate-spin" />
                    <div className="text-center">
                        <h3 className="text-xl font-black uppercase italic">Processing...</h3>
                        <p className="text-gray-500 text-sm mt-1">Verification in progress</p>
                    </div>
                </div>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <CheckCircle2 size={48} className="text-green-500" />
                    <div className="text-center">
                        <h3 className="text-xl font-black uppercase italic">Success!</h3>
                        <p className="text-gray-500 text-sm mt-1">Request submitted successfully.</p>
                    </div>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};