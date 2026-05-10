import React, { useState, useEffect } from 'react';
import { AviatorGame } from './components/AviatorGame';
import { BettingPanel } from './components/BettingPanel';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DepositModal } from './components/Modals/DepositModal';
import { WithdrawModal } from './components/Modals/WithdrawModal';
import { HistoryModal } from './components/Modals/HistoryModal';
import { SoundToggle } from './components/SoundToggle';
import { useGameLogic } from './hooks/useGameLogic';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const {
    balance,
    setBalance,
    multiplier,
    gameState,
    history,
    lastCrashes,
    placeBet,
    cashOut,
    activeBets
  } = useGameLogic();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1116] text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col">
      <TopBar 
        balance={balance} 
        lastCrashes={lastCrashes}
        onDeposit={() => setIsDepositOpen(true)}
        onWithdraw={() => setIsWithdrawOpen(true)}
        onHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 flex flex-col lg:flex-row p-2 gap-2 overflow-hidden">
        {/* Left Sidebar - Stats */}
        <div className="hidden lg:block w-80 shrink-0">
          <Sidebar history={history} />
        </div>

        {/* Center - Game Area */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <div className="flex-1 relative bg-[#141721] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <AviatorGame multiplier={multiplier} gameState={gameState} />
          </div>

          {/* Bottom - Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 shrink-0">
            <BettingPanel 
              id="bet-1"
              balance={balance}
              gameState={gameState}
              multiplier={multiplier}
              onPlaceBet={(amount, autoCashout) => placeBet(0, amount, autoCashout)}
              onCashOut={() => cashOut(0)}
              activeBet={activeBets[0]}
            />
            <BettingPanel 
              id="bet-2"
              balance={balance}
              gameState={gameState}
              multiplier={multiplier}
              onPlaceBet={(amount, autoCashout) => placeBet(1, amount, autoCashout)}
              onCashOut={() => cashOut(1)}
              activeBet={activeBets[1]}
            />
          </div>
        </div>
      </main>

      <SoundToggle />

      {/* Modals */}
      <AnimatePresence>
        {isDepositOpen && (
          <DepositModal 
            onClose={() => setIsDepositOpen(false)} 
            onSuccess={(amt) => setBalance(prev => prev + amt)}
          />
        )}
        {isWithdrawOpen && (
          <WithdrawModal 
            balance={balance}
            onClose={() => setIsWithdrawOpen(false)} 
            onSuccess={(amt) => setBalance(prev => prev - amt)}
          />
        )}
        {isHistoryOpen && (
          <HistoryModal onClose={() => setIsHistoryOpen(false)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;