import React, { useState } from 'react';
import { Minus, Plus, Zap } from 'lucide-react';

interface BettingPanelProps {
  id: string;
  balance: number;
  gameState: 'waiting' | 'flying' | 'crashed';
  multiplier: number;
  onPlaceBet: (amount: number, autoCashout?: number) => void;
  onCashOut: () => void;
  activeBet: { amount: number; isCashedOut: boolean; cashoutMultiplier?: number } | null;
}

export const BettingPanel: React.FC<BettingPanelProps> = ({
  balance,
  gameState,
  multiplier,
  onPlaceBet,
  onCashOut,
  activeBet
}) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>('');
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);

  const handleBet = () => {
    if (betAmount > balance) return;
    onPlaceBet(betAmount, isAutoEnabled ? parseFloat(autoCashout) : undefined);
  };

  const isWaiting = gameState === 'waiting';
  const isFlying = gameState === 'flying';
  
  const canBet = isWaiting && !activeBet;
  const canCashOut = isFlying && activeBet && !activeBet.isCashedOut;

  return (
    <div className="bg-[#1b1f2d] p-4 rounded-xl border border-white/5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 5, 10].map(v => (
            <button 
              key={v}
              onClick={() => setBetAmount(v)}
              className="px-3 py-1 text-xs font-bold rounded bg-white/5 hover:bg-white/10 transition-colors"
            >
              ${v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase">Auto</span>
            <button 
                onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isAutoEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isAutoEnabled ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-[#141721] rounded-lg p-2 flex items-center gap-2 border border-white/10">
          <button onClick={() => setBetAmount(Math.max(1, betAmount - 1))} className="p-1 hover:text-red-500 transition-colors">
            <Minus size={16} />
          </button>
          <input 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full bg-transparent text-center font-bold text-lg outline-none"
          />
          <button onClick={() => setBetAmount(betAmount + 1)} className="p-1 hover:text-green-500 transition-colors">
            <Plus size={16} />
          </button>
        </div>

        {canBet ? (
          <button 
            onClick={handleBet}
            className="flex-1 bg-[#28a745] hover:bg-[#218838] text-white font-black text-xl rounded-lg shadow-[0_4px_0_rgb(21,115,40)] active:translate-y-1 active:shadow-none transition-all uppercase italic"
          >
            BET
          </button>
        ) : canCashOut ? (
          <button 
            onClick={onCashOut}
            className="flex-1 bg-[#ffc107] hover:bg-[#e0a800] text-[#1b1f2d] font-black text-lg rounded-lg shadow-[0_4px_0_rgb(180,135,0)] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center leading-tight"
          >
            <span className="uppercase italic">Cash Out</span>
            <span className="text-sm font-bold">{(betAmount * multiplier).toFixed(2)} USD</span>
          </button>
        ) : (
          <button 
            disabled
            className="flex-1 bg-gray-700 text-gray-400 font-black text-xl rounded-lg cursor-not-allowed uppercase italic"
          >
            {activeBet?.isCashedOut ? 'WAITING...' : 'PLACED'}
          </button>
        )}
      </div>

      {isAutoEnabled && (
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5 animate-in fade-in slide-in-from-top-1">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-xs font-bold text-gray-400 uppercase">Auto Cashout:</span>
          <input 
            type="number"
            step="0.1"
            placeholder="1.50"
            value={autoCashout}
            onChange={(e) => setAutoCashout(e.target.value)}
            className="bg-transparent text-sm font-bold text-white outline-none w-16"
          />
          <span className="text-xs font-bold text-gray-500">x</span>
        </div>
      )}
    </div>
  );
};