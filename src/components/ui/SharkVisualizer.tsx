'use client';

import React, { useEffect, useState, useRef } from 'react';
import { BezelCard } from './BezelCard';

interface FishData {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const SharkVisualizer: React.FC = () => {
  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 200, y: 200 });
  const fishData = useRef<FishData[]>([]);
  const fishRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 8 + 4, // 4px to 12px
      delay: Math.random() * 5, // 0 to 5s
      duration: Math.random() * 4 + 4, // 4s to 8s
    }));
    setBubbles(newBubbles);

    // Track mouse globally to update local coordinates
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize fish flock
    const width = containerRef.current?.clientWidth || 400;
    const height = containerRef.current?.clientHeight || 400;
    fishData.current = Array.from({ length: 8 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    // Animation Loop
    let animationFrameId: number;
    const update = () => {
      const { x: mx, y: my } = mousePos.current;
      
      fishData.current.forEach((fish, i) => {
        // Calculate vector to mouse
        const dx = mx - fish.x;
        const dy = my - fish.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Acceleration towards mouse
        if (dist > 10) {
          fish.vx += (dx / dist) * 0.4;
          fish.vy += (dy / dist) * 0.4;
        }

        // Add some random noise for "flocking" feel
        fish.vx += (Math.random() - 0.5) * 0.5;
        fish.vy += (Math.random() - 0.5) * 0.5;

        // Speed limit & Friction
        fish.vx *= 0.94;
        fish.vy *= 0.94;

        fish.x += fish.vx;
        fish.y += fish.vy;

        // Update DOM element
        const el = fishRefs.current[i];
        if (el) {
          const angle = Math.atan2(fish.vy, fish.vx) * (180 / Math.PI);
          el.style.transform = `translate(${fish.x}px, ${fish.y}px) rotate(${angle}deg)`;
        }
      });
      
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BezelCard innerClassName="shark-card">
      <div className="shark-container" ref={containerRef}>
        
        {/* Deep Water Gradient Background */}
        <div className="water-background"></div>

        {/* Floating Bubbles */}
        {bubbles.map(b => (
          <div 
            key={b.id} 
            className="bubble"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`
            }}
          />
        ))}

        {/* School of Fish */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`fish-${i}`}
            ref={(el) => {
              if (el) fishRefs.current[i] = el;
            }}
            style={{
              position: 'absolute',
              top: '-4px', // half of height to center
              left: '-8px', // half of width to center
              width: '16px',
              height: '8px',
              zIndex: 3,
              willChange: 'transform',
            }}
          >
            {/* Minimalist Glowing Fish SVG */}
            <svg viewBox="0 0 16 8" width="100%" height="100%">
              <path d="M 0 4 L 4 0 L 12 2 L 16 4 L 12 6 L 4 8 Z" fill="#06b6d4" opacity="0.8" />
              <circle cx="12" cy="4" r="1" fill="#fff" />
            </svg>
          </div>
        ))}

        {/* Animated Waves */}
        <div className="ocean-waves">
          <svg className="wave wave1" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="rgba(6, 182, 212, 0.2)" />
          </svg>
          <svg className="wave wave2" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,50 C150,0 350,100 500,50 C650,0 850,100 1000,50 L1000,100 L0,100 Z" fill="rgba(99, 102, 241, 0.3)" />
          </svg>
        </div>

        {/* The Shark Fin */}
        <div className="shark-fin-wrapper">
          <svg className="shark-fin" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Minimalist Shark Fin Path */}
            <path d="M 20 90 Q 40 20 55 10 Q 60 50 80 90 Z" fill="url(#finGrad)" filter="url(#glow)" />
            {/* Water slice effect */}
            <line x1="0" y1="90" x2="100" y2="90" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Tech Radar / Scanner Overlay */}
        <div className="shark-radar-line"></div>

        {/* Status Text */}
        <div className="shark-status">
          <div className="status-dot"></div>
          <span>DEEP DIVE MODE</span>
        </div>
      </div>
    </BezelCard>
  );
};
