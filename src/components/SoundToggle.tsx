import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl, Howler } from 'howler';

const sounds = {
    bgm: new Howl({
        src: ['https://assets.mixkit.co/music/preview/mixkit-cyberpunk-game-loop-849.mp3'],
        loop: true,
        volume: 0.2,
        html5: true
    }),
    takeoff: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-jet-passing-by-1533.mp3'],
        volume: 0.5
    }),
    cashout: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'],
        volume: 0.4
    }),
    crash: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-explosion-with-debris-2188.mp3'],
        volume: 0.3
    })
};

export const playSFX = (key: keyof typeof sounds) => {
    sounds[key].play();
};

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('muted') === 'true';
  });

  useEffect(() => {
    Howler.mute(isMuted);
    localStorage.setItem('muted', String(isMuted));
    
    if (!isMuted) {
        sounds.bgm.play();
    } else {
        sounds.bgm.pause();
    }
  }, [isMuted]);

  return (
    <button 
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-4 left-4 z-50 p-3 bg-[#1b1f2d] border border-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-xl backdrop-blur-md"
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};