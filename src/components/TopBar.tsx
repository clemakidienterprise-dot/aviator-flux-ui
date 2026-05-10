import React from 'react';
import { Wallet, Menu, ChevronDown, History, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface TopBarProps {
  balance: number;
  lastCrashes: number[];
  onDeposit: () => void;
  onWithdraw: () => void;
  onHistory: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ balance, lastCrashes, onDeposit, onWithdraw, onHistory }) => {
  return (
    <header className="bg-[#1b1f2d] border-b border-white/5 p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <img src="https://aviator.spribegaming.com/logo.svg" alt="Aviator" className="h-6 w-auto hidden sm:block" />
            <div className="text-red-500 font-black italic text-xl sm:hidden">AVIATOR</div>
        </div>
        
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
          {lastCrashes.map((val, i) => (
            <div 
              key={i} 
              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                val < 2 ? 'bg-blue-500/20 text-blue-400' : 
                val < 10 ? 'bg-purple-500/20 text-purple-400' : 
                'bg-pink-500/20 text-pink-400'
              }`}
            >
              {val.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/10 group cursor-pointer">
          <Wallet size={16} className="text-green-500" />
          <span className="font-bold text-sm tracking-tight">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
          <ChevronDown size={14} className="text-gray-500 group-hover:text-white transition-colors" />
        </div>

        <button 
          onClick={onDeposit}
          className="bg-[#28a745] hover:bg-[#218838] px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all flex items-center gap-2"
        >
          <ArrowDownToLine size={14} /> Deposit
        </button>

        <div className="flex items-center gap-1">
            <button onClick={onWithdraw} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white" title="Withdraw">
                <ArrowUpFromLine size={20} />
            </button>
            <button onClick={onHistory} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white" title="History">
                <History size={20} />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                <Menu size={20} />
            </button>
        </div>
      </div>
    </header>
  );
};