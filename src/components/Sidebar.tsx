import React, { useState } from 'react';
import { Clock, Users, Trophy } from 'lucide-react';

interface SidebarProps {
  history: Array<{ id: string; user: string; bet: number; cashout: number; profit: number }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ history }) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'my' | 'top'>('all');

  // Generate some semi-random live bets for visual polish
  const mockLiveBets = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `live-${i}`,
      user: `Player_${Math.floor(Math.random() * 9000) + 1000}`,
      bet: Math.floor(Math.random() * 100) + 1,
      cashout: Math.random() > 0.4 ? (1.1 + Math.random() * 2).toFixed(2) : null,
      profit: 0
    })).map(b => ({
        ...b,
        profit: b.cashout ? b.bet * parseFloat(b.cashout as string) : 0
    }));
  }, []);

  const displayData = activeTab === 'my' ? history : mockLiveBets;

  return (
    <div className="h-full bg-[#1b1f2d] rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-xl">
      <div className="flex p-1.5 gap-1 bg-black/20">
        {[
          { id: 'all', icon: Users, label: 'All Bets' },
          { id: 'my', icon: Clock, label: 'My Bets' },
          { id: 'top', icon: Trophy, label: 'Top' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-[#2c3144] text-white shadow-lg border border-white/5' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <tab.icon size={12} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#1b1f2d] z-10">
            <tr className="text-[9px] text-gray-500 uppercase font-black border-b border-white/5">
              <th className="p-3">User</th>
              <th className="p-3 text-right">Bet</th>
              <th className="p-3 text-center">Mult.</th>
              <th className="p-3 text-right">Cash Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayData.length > 0 ? displayData.map((item: any) => (
              <tr key={item.id} className="text-xs hover:bg-white/5 transition-colors group">
                <td className="p-3 font-bold text-gray-400 group-hover:text-gray-200 truncate max-w-[80px]">
                    {item.user}
                </td>
                <td className="p-3 text-right font-medium text-gray-300">
                    ${parseFloat(item.bet).toFixed(2)}
                </td>
                <td className="p-3 text-center">
                  {item.cashout ? (
                    <span className="bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] font-black text-blue-400">
                      {parseFloat(item.cashout).toFixed(2)}x
                    </span>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className={`p-3 text-right font-black ${item.profit > 0 ? 'text-green-400' : 'text-gray-700'}`}>
                  {item.profit > 0 ? `$${item.profit.toFixed(2)}` : '-'}
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-600 text-[10px] uppercase font-bold italic">
                        No bets found
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 bg-black/20 border-t border-white/5 text-[10px] text-gray-500 flex justify-between items-center font-bold uppercase italic">
        <span>Active Players: 1,248</span>
        <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
        </div>
      </div>
    </div>
  );
};