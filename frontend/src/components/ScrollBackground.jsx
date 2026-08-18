import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ScrollBackground() {
  const { theme } = useTheme();
  
  // Track vertical page scroll progress (from 0 to 1)
  const { scrollYProgress } = useScroll();

  // Create smooth spring interpolations to avoid laggy animation jumps
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 25,
    restDelta: 0.001
  });


  // 1. Orb 1 (Primary Color - moves from top-left diagonally to bottom-right)
  const orb1X = useTransform(smoothProgress, [0, 1], ['-10%', '65%']);
  const orb1Y = useTransform(smoothProgress, [0, 1], ['15%', '65%']);
  const orb1Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.35, 1.1]);
  const orb1Rotate = useTransform(smoothProgress, [0, 1], [0, 360]);

  // 2. Orb 2 (Secondary Color - moves from bottom-right diagonally to top-left)
  const orb2X = useTransform(smoothProgress, [0, 1], ['85%', '10%']);
  const orb2Y = useTransform(smoothProgress, [0, 1], ['75%', '25%']);
  const orb2Scale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 0.8, 1.25]);

  // 3. Grid Parallax (Moves background grid slightly slower than scroll speed)
  const gridY = useTransform(smoothProgress, [0, 1], [0, -150]);

  // 4. Cursor Follow Glow setup
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (!theme.enable_animations) return;

    const handleMouseMove = (e) => {
      // Offset values to keep the 350px glowing spotlight orb centered on the cursor
      mouseX.set(e.clientX - 175);
      mouseY.set(e.clientY - 175);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [theme.enable_animations]);

  // 5. Canvas Parallax Fluid Wave setup
  const canvasRef = useRef(null);
  const canvasMouse = useRef({ x: -1000, y: -1000 });
  const turbulence = useRef(0);

  // Sync canvas mouse position separately for frame rate speed
  useEffect(() => {
    if (!theme.enable_animations) return;
    const handleMouseMove = (e) => {
      canvasMouse.current.x = e.clientX;
      canvasMouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [theme.enable_animations]);

  useEffect(() => {
    if (!theme.enable_animations) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // High-tech particles list (Neural Plexus Nodes)
    const nodes = [];
    const count = 75;
    
    // Tech-themed code symbols to mix into the network
    const techSymbols = ['0', '1', '{}', '</>', '=>', '[]', 'const', 'db', 'npm', 'api', 'let', 'import', 'true', 'false'];

    for (let i = 0; i < count; i++) {
      const depth = Math.random() * 0.8 + 0.2; // Z-depth representation from 0.2 to 1.0
      const isSymbol = Math.random() > 0.60;
      
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.40 * depth, // deeper moves slower
        baseVy: (Math.random() - 0.5) * 0.40 * depth,
        vx: 0,
        vy: 0,
        depth,
        size: isSymbol ? (depth * 8 + 10) : (depth * 2.5 + 1.2), // larger dynamic font size (10px to 18px) or dot radius
        alpha: depth * 0.40 + 0.10,
        isSymbol,
        symbol: isSymbol ? techSymbols[Math.floor(Math.random() * techSymbols.length)] : null,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI
      });
    }


    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#6366f1';
      
      // Calculate scroll speed turbulence
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Add scroll velocity to turbulence with smooth damping decay
      turbulence.current = turbulence.current * 0.94 + Math.abs(scrollDiff) * 0.06;
      if (turbulence.current > 100) turbulence.current = 100;

      // 1. Draw Network Plexus Lines & Data Packets
      ctx.lineWidth = 0.5;
      for (let i = 0; i < count; i++) {
        const n1 = nodes[i];
        
        // Connect to other nodes
        for (let j = i + 1; j < count; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            
            // Opacity decreases as distance increases and depth fades
            const lineAlpha = (1 - dist / 95) * 0.16 * (1 + turbulence.current * 0.015) * n1.depth;
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = lineAlpha;
            ctx.stroke();

            // Draw a sliding fiber-optic packet bead along the active connection path
            const slideProgress = (Date.now() * 0.0012 + n1.pulsePhase) % 1;
            const px = n1.x + dx * slideProgress;
            const py = n1.y + dy * slideProgress;

            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = (1 - dist / 95) * 0.55 * n1.depth;
            ctx.fill();
          }
        }

        // Connect to mouse cursor spotlight
        const mdx = canvasMouse.current.x - n1.x;
        const mdy = canvasMouse.current.y - n1.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < 160) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(canvasMouse.current.x, canvasMouse.current.y);
          const mouseLineAlpha = (1 - mDist / 160) * 0.25 * n1.depth;
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = mouseLineAlpha;
          ctx.stroke();
        }
      }

      // 2. Update and Draw Nodes
      nodes.forEach((n) => {
        // Accelerate velocity with scroll speed turbulence
        const currentVx = n.baseVx * (1 + turbulence.current * 0.12);
        const currentVy = n.baseVy * (1 + turbulence.current * 0.12);
        
        n.x += currentVx;
        // Scroll pushes particles slightly based on depth
        n.y += currentVy - (scrollDiff * 0.08 * n.depth);

        // Screen wraps boundaries
        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;

        // Randomly mutate coding symbols to mimic a live compiler/terminal
        if (n.isSymbol && Math.random() < 0.004) {
          n.symbol = techSymbols[Math.floor(Math.random() * techSymbols.length)];
        }

        // Slow pulsing brightness
        n.pulsePhase += n.pulseSpeed;
        const pulseRatio = (Math.sin(n.pulsePhase) + 1) / 2; // 0 to 1
        const finalAlpha = n.alpha * (0.6 + pulseRatio * 0.4) * (1 + turbulence.current * 0.008);

        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = finalAlpha;

        if (n.isSymbol) {
          // Enable neon glow shadows for closer symbols
          if (n.depth > 0.6) {
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 8;
          }
          
          ctx.font = `bold ${Math.round(n.size)}px monospace`;
          ctx.fillText(n.symbol, n.x, n.y);
          
          // Disable shadow state for performance
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Restore alpha context
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.enable_animations]);



  // If animations are globally disabled in settings, render static background glows
  if (!theme.enable_animations) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[-10] overflow-hidden bg-[#0f172a]" style={{ zIndex: -10 }}>
        {/* Static Grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(var(--primary-color) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Static Glow 1 */}
        <div 
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.14]"
          style={{ backgroundColor: 'var(--primary-color)' }}
        />
        {/* Static Glow 2 */}
        <div 
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ backgroundColor: '#818cf8' }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-10] overflow-hidden bg-[#0f172a] select-none" style={{ zIndex: -10 }}>
      
      {/* Interactive Parallax Stardust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Cyber Grid Pattern with Parallax Scroll Offset */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02] z-0"
        style={{
          y: gridY,
          backgroundImage: `
            linear-gradient(to right, var(--primary-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary-color) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px'
        }}
      />

      {/* Dynamic Glow Orb 1 (Primary Theme Color) */}
      <motion.div
        className="absolute w-[50vw] max-w-[650px] aspect-square rounded-full blur-[130px] opacity-[0.12] z-0"
        style={{
          x: orb1X,
          y: orb1Y,
          scale: orb1Scale,
          rotate: orb1Rotate,
          backgroundColor: 'var(--primary-color)'
        }}
      />

      {/* Dynamic Glow Orb 2 (Secondary Indigo Color) */}
      <motion.div
        className="absolute w-[40vw] max-w-[500px] aspect-square rounded-full blur-[120px] opacity-[0.08] z-0"
        style={{
          x: orb2X,
          y: orb2Y,
          scale: orb2Scale,
          backgroundColor: '#818cf8' // Indigo 400
        }}
      />

      {/* Dynamic Cursor-Follow Glow Orb (Trailing spotlight) */}
      <motion.div
        className="absolute w-[350px] aspect-square rounded-full blur-[90px] opacity-[0.06] z-0"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          backgroundColor: 'var(--primary-color)'
        }}
      />

      {/* Ambient shadow gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(15,23,42,0.4))] z-20 pointer-events-none" />

    </div>
  );
}
