import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface HistoryModalProps {
  onClose: () => void;
}

const MOCK_TRANS = [
    { id: '1', type: 'deposit', method: 'Visa Card', amount: 500, status: 'completed', date: '2023-10-25 14:22' },
    { id: '2', type: 'withdrawal', method: 'Bank Transfer', amount: 1200, status: 'pending', date: '2023-10-24 09:15' },
    { id: '3', type: 'deposit', method: 'Crypto (BTC)', amount: 150, status: 'completed', date: '2023-10-22 18:40' },
    { id: '4', type: 'deposit', method: 'Skrill', amount: 50, status: 'failed', date: '2023-10-20 11:10' },
];

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
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
        className="relative bg-[#1b1f2d] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-black uppercase italic tracking-tight">Transaction History</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-2 overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] text-gray-500 uppercase font-black border-b border-white/5">
                        <th className="p-4">Type</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {MOCK_TRANS.map(t => (
                        <tr key={t.id} className="text-xs hover:bg-white/5 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-2 font-bold uppercase italic">
                                    {t.type === 'deposit' ? (
                                        <div className="p-1 bg-green-500/20 rounded text-green-500"><ArrowDownLeft size={14} /></div>
                                    ) : (
                                        <div className="p-1 bg-red-500/20 rounded text-red-500"><ArrowUpRight size={14} /></div>
                                    )}
                                    {t.type}
                                </div>
                            </td>
                            <td className="p-4 text-gray-300 font-medium">{t.method}</td>
                            <td className="p-4 font-black text-sm">${t.amount.toFixed(2)}</td>
                            <td className="p-4 text-gray-500 font-medium">{t.date}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    t.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                    t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                    'bg-red-500/20 text-red-500'
                                }`}>
                                    {t.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </motion.div>
    </div>
  );
};