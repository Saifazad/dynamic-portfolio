import React, { useState, useEffect, useRef } from 'react';
import { VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AmbientSound() {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const lfoRef = useRef(null);
  const filterRef = useRef(null);
  const gainNodeRef = useRef(null);

  const startSynth = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Main Oscillator (Warm triangle waves)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65, ctx.currentTime); // C2 note, deep atmospheric drone
      oscRef.current = osc;

      // Biquad Filter (Remove any buzzing high frequencies)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filterRef.current = filter;

      // Gain Node (Volume limit)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime); // Start silent to fade in
      gainNodeRef.current = gainNode;

      // LFO Oscillator (Slow cosmic volume sweep)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Slow cycle (once per 8s)
      lfoRef.current = lfo;

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.025, ctx.currentTime);

      // Route: LFO -> LFO-Gain -> Main Volume Gain
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      // Route: Oscillator -> Filter -> Gain -> Destination (Speakers)
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start oscillators
      osc.start(0);
      lfo.start(0);

      // Smoothly fade in volume to 0.05
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);
      setIsPlaying(true);
    } catch (err) {
      console.error("Web Audio API synthesis failed to start:", err);
    }
  };

  const stopSynth = () => {
    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !gainNode) return;

    // Smoothly fade out volume to prevent pops/clicks
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    setTimeout(() => {
      try {
        oscRef.current?.stop();
        lfoRef.current?.stop();
        ctx.close();
      } catch (e) {}
      
      oscRef.current = null;
      lfoRef.current = null;
      audioCtxRef.current = null;
      gainNodeRef.current = null;
      setIsPlaying(false);
    }, 550);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  // Mute immediately if user switches off animations in settings
  useEffect(() => {
    if (!theme.enable_animations && isPlaying) {
      stopSynth();
    }
  }, [theme.enable_animations]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          oscRef.current?.stop();
          lfoRef.current?.stop();
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  if (!theme.enable_animations) return null;

  return (
    <>
      <style>{`
        @keyframes eq1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes eq2 {
          0%, 100% { height: 16px; }
          50% { height: 6px; }
        }
        @keyframes eq3 {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        .animate-eq-bar-1 { animation: eq1 0.8s ease-in-out infinite; }
        .animate-eq-bar-2 { animation: eq2 0.6s ease-in-out infinite 0.15s; }
        .animate-eq-bar-3 { animation: eq3 0.7s ease-in-out infinite 0.3s; }
      `}</style>

      <button
        onClick={togglePlay}
        className="fixed bottom-6 left-6 p-4 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-white shadow-xl hover:scale-105 transition-all z-40 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 h-[50px] w-[50px] overflow-hidden"
        title="Toggle Atmospheric Sound Ambient Synth"
      >
        {isPlaying ? (
          <div className="flex items-end gap-[3px] h-[16px] w-[16px] justify-center">
            <span className="w-[3px] bg-indigo-400 rounded-full animate-eq-bar-1" style={{ backgroundColor: 'var(--primary-color)' }} />
            <span className="w-[3px] bg-indigo-400 rounded-full animate-eq-bar-2" style={{ backgroundColor: 'var(--primary-color)' }} />
            <span className="w-[3px] bg-indigo-400 rounded-full animate-eq-bar-3" style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
        ) : (
          <VolumeX size={18} className="text-slate-400" />
        )}
      </button>
    </>
  );
}
