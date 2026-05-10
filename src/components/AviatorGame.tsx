import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface AviatorGameProps {
  multiplier: number;
  gameState: 'waiting' | 'flying' | 'crashed';
}

export const AviatorGame: React.FC<AviatorGameProps> = ({ multiplier, gameState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: number;
    const checkDimensions = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0 && containerRef.current.clientHeight > 0) {
        setIsReady(true);
      } else {
        timeoutId = window.requestAnimationFrame(checkDimensions);
      }
    };

    checkDimensions();
    return () => {
      if (timeoutId) window.cancelAnimationFrame(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#141721',
      transparent: true,
      powerPreference: 'high-performance',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: AviatorScene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isReady]);

  useEffect(() => {
    if (gameRef.current?.scene.scenes[0]) {
      const scene = gameRef.current.scene.scenes[0] as AviatorScene;
      if (scene.updateState) {
        scene.updateState(gameState, multiplier);
      }
    }
  }, [gameState, multiplier]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#141721]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        {!isReady && (
          <div className="text-gray-500 animate-pulse">Initializing Graphics...</div>
        )}
        {isReady && gameState === 'waiting' && (
          <div className="text-center animate-pulse">
            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold">Waiting for next round</div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 animate-[loading_3s_linear_infinite]" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
        {isReady && gameState === 'flying' && (
          <div className="text-8xl md:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {multiplier.toFixed(2)}x
          </div>
        )}
        {isReady && gameState === 'crashed' && (
          <div className="text-center">
            <div className="text-red-500 text-6xl md:text-8xl font-black italic uppercase tracking-tighter drop-shadow-lg">
              FLEW AWAY!
            </div>
            <div className="text-4xl font-bold text-white mt-2">
              {multiplier.toFixed(2)}x
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

class AviatorScene extends Phaser.Scene {
  private plane!: Phaser.GameObjects.Sprite;
  private curve!: Phaser.GameObjects.Graphics;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private currentState: string = 'waiting';
  private currentMultiplier: number = 1.0;
  private gridGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super('AviatorScene');
  }

  preload() {
    // Red plane icon placeholder
    const planeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="1"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`;
    const blob = new Blob([planeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    this.load.image('plane', url);
    
    // Smoke particle
    const circleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="5" fill="white" fill-opacity="0.3"/></svg>`;
    const circleBlob = new Blob([circleSvg], { type: 'image/svg+xml' });
    const circleUrl = URL.createObjectURL(circleBlob);
    this.load.image('particle', circleUrl);
  }

  create() {
    this.gridGraphics = this.add.graphics();
    this.drawGrid();

    this.curve = this.add.graphics();
    
    this.particles = this.add.particles(0, 0, 'particle', {
      speed: 50,
      scale: { start: 1, end: 0 },
      alpha: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
    });
    this.particles.stop();

    this.plane = this.add.sprite(-100, -100, 'plane');
    this.plane.setScale(0.8);
    this.plane.setOrigin(0.5, 0.5);
    this.plane.setVisible(false);

    // Initial state update if triggered before create
    this.updateState(this.currentState, this.currentMultiplier);

    // Handle resize
    this.scale.on('resize', () => {
        this.drawGrid();
    });
  }

  drawGrid() {
    if (!this.gridGraphics) return;
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0xffffff, 0.05);
    const step = 50;
    const { width, height } = this.scale;
    
    for (let x = 0; x < width + step; x += step) {
      this.gridGraphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height + step; y += step) {
      this.gridGraphics.lineBetween(0, y, width, y);
    }
  }

  updateState(state: string, multiplier: number) {
    this.currentState = state;
    this.currentMultiplier = multiplier;

    if (!this.plane) return; // Might be called before create()

    if (state === 'flying') {
      this.plane.setVisible(true);
      this.plane.setAlpha(1);
      this.particles.start();
    } else if (state === 'waiting') {
      this.plane.setVisible(false);
      this.particles.stop();
      this.curve.clear();
    } else if (state === 'crashed') {
      this.particles.stop();
      // Animate plane flying away fast
      this.tweens.add({
        targets: this.plane,
        x: this.plane.x + 500,
        y: this.plane.y - 300,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
            if (this.plane) {
              this.plane.setVisible(false);
              this.plane.setAlpha(1);
            }
        }
      });
    }
  }

  update() {
    if (this.currentState === 'flying' && this.plane) {
      const { width, height } = this.scale;
      
      const padding = 100;
      const progressX = Math.min((this.currentMultiplier - 1) * (width * 0.1), width - padding * 2);
      const progressY = Math.min((this.currentMultiplier - 1) * (height * 0.08), height - padding * 2);
      
      const targetX = padding + progressX;
      const targetY = (height - padding) - progressY;

      this.plane.setPosition(targetX, targetY);
      this.particles.setPosition(targetX, targetY);
      
      this.curve.clear();
      this.curve.lineStyle(4, 0xff0000, 1);
      
      const startX = padding;
      const startY = height - padding;
      
      this.curve.beginPath();
      this.curve.moveTo(startX, startY);
      this.curve.quadraticCurveTo(startX + (targetX - startX) * 0.5, startY, targetX, targetY);
      this.curve.strokePath();

      this.gridGraphics.x = -(this.time.now * 0.02) % 50;
    }
  }
}