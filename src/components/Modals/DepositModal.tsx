import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Wallet, Bitcoin, CheckCircle2 } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PAYMENT_METHODS = [
  { id: 'card', name: 'Card', icon: CreditCard, color: 'text-blue-400' },
  { id: 'wallet', name: 'E-Wallet', icon: Wallet, color: 'text-orange-400' },
  { id: 'crypto', name: 'Crypto', icon: Bitcoin, color: 'text-yellow-400' },
];

export const DepositModal: React.FC<DepositModalProps> = ({ onClose, onSuccess }) => {
  const [method, setMethod] = useState('card');
  const [amount, setAmount] = useState('100');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onSuccess(parseFloat(amount));
      onClose();
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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#1b1f2d] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-black uppercase italic tracking-tight">Deposit Funds</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleDeposit} className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    method === m.id ? 'bg-white/10 border-white/20' : 'bg-black/20 border-transparent hover:border-white/10'
                  }`}
                >
                  <m.icon size={24} className={m.color} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{m.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {['10', '50', '100', '500'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-lg font-bold text-sm transition-all ${amount === val ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Manual Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 font-bold text-lg outline-none focus:border-red-500/50 transition-all"
                  />
                </div>
              </div>

              {method === 'card' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                    <input type="text" placeholder="Card Number" className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm font-medium outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm font-medium outline-none" />
                        <input type="text" placeholder="CVV" className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm font-medium outline-none" />
                    </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase italic tracking-widest"
            >
              Deposit Now
            </button>
          </form>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black uppercase italic">Processing...</h3>
            <p className="text-gray-400 text-sm">Your payment is being securedly processed. Your balance will be updated automatically.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};