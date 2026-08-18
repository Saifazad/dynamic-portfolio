import React, { useRef } from 'react';

/**
 * Reusable 3D Perspective Tilt Card.
 * Uses hardware-accelerated CSS variables for buttery-smooth performance.
 */
export default function TiltCard({ children, className = '', style = {}, maxRotation = 12 }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x position within card boundaries
    const y = e.clientY - rect.top;  // Mouse y position within card boundaries

    // Normalize coordinates to percentage from center (-0.5 to 0.5)
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;

    // Calculate rotation degrees based on rotation limits
    const rx = -py * maxRotation;
    const ry = px * maxRotation;

    // Apply styles directly to style properties for instant visual feedback
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    // Reset coordinates to default state (flat)
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transform transition-all duration-200 ease-out select-none preserve-3d group ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        ...style
      }}
    >
      {children}
      
      {/* Dynamic Cursor Interactive Glare Shine */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.08) 0%, transparent 65%)`,
          zIndex: 5
        }}
      />
    </div>
  );
}
