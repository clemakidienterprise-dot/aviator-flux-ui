import { useState, useEffect, useRef } from 'react';
import { playSFX } from '../components/SoundToggle';

type GameState = 'waiting' | 'flying' | 'crashed';

interface Bet {
  amount: number;
  isCashedOut: boolean;
  autoCashoutMultiplier?: number;
}

export const useGameLogic = () => {
  const [balance, setBalance] = useState(5000);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [history, setHistory] = useState<any[]>([]);
  const [lastCrashes, setLastCrashes] = useState<number[]>([]);
  const [activeBets, setActiveBets] = useState<(Bet | null)[]>([null, null]);
  
  const crashPointRef = useRef(2.5);
  const startTimeRef = useRef(0);

  const startRound = () => {
    // Determine random crash point
    // High chance of early crash, small chance of huge win
    const r = Math.random();
    let crashPoint = 1.0;
    if (r > 0.05) {
        crashPoint = 1 + Math.exp(Math.random() * 2.5);
    }
    
    crashPointRef.current = crashPoint;
    setMultiplier(1.0);
    setGameState('flying');
    startTimeRef.current = Date.now();
    playSFX('takeoff');
  };

  const endRound = () => {
    setGameState('crashed');
    setLastCrashes(prev => [multiplier, ...prev].slice(0, 10));
    setActiveBets([null, null]);
    playSFX('crash');
    
    setTimeout(() => {
      setGameState('waiting');
      setTimeout(startRound, 3000);
    }, 4000);
  };

  useEffect(() => {
    startRound();
  }, []);

  useEffect(() => {
    if (gameState !== 'flying') return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      // Exponential growth formula: m = e^(0.1 * t)
      const currentMult = Math.pow(Math.E, 0.1 * elapsed);
      
      if (currentMult >= crashPointRef.current) {
        setMultiplier(crashPointRef.current);
        endRound();
        clearInterval(interval);
      } else {
        setMultiplier(currentMult);
        
        // Check auto-cashouts
        setActiveBets(prev => {
            let changed = false;
            const next = prev.map((bet, i) => {
                if (bet && !bet.isCashedOut && bet.autoCashoutMultiplier && currentMult >= bet.autoCashoutMultiplier) {
                    changed = true;
                    const win = bet.amount * bet.autoCashoutMultiplier;
                    setBalance(b => b + win);
                    playSFX('cashout');
                    return { ...bet, isCashedOut: true, cashoutMultiplier: bet.autoCashoutMultiplier };
                }
                return bet;
            });
            return changed ? next : prev;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  const placeBet = (index: number, amount: number, autoCashout?: number) => {
    if (gameState !== 'waiting' || amount > balance) return;
    
    setBalance(prev => prev - amount);
    setActiveBets(prev => {
        const next = [...prev];
        next[index] = { amount, isCashedOut: false, autoCashoutMultiplier: autoCashout };
        return next;
    });
  };

  const cashOut = (index: number) => {
    const bet = activeBets[index];
    if (gameState !== 'flying' || !bet || bet.isCashedOut) return;

    const win = bet.amount * multiplier;
    setBalance(prev => prev + win);
    playSFX('cashout');

    setActiveBets(prev => {
        const next = [...prev];
        next[index] = { ...bet, isCashedOut: true, cashoutMultiplier: multiplier };
        return next;
    });

    setHistory(prev => [
        { 
            id: Math.random().toString(36), 
            user: 'You', 
            bet: bet.amount, 
            cashout: multiplier, 
            profit: win 
        },
        ...prev
    ].slice(0, 20));
  };

  return {
    balance,
    setBalance,
    multiplier,
    gameState,
    history,
    lastCrashes,
    placeBet,
    cashOut,
    activeBets
  };
};