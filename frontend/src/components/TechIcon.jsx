import React from 'react';

export default function TechIcon({ name, className = "w-6 h-6", size = 22 }) {
  const normalized = (name || '').toLowerCase().trim();

  // Flutter
  if (normalized.includes('flutter')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none">
        <path d="M14.314 0L2.3 12.014l3.696 3.696L21.706 0h-7.392z" fill="#42A5F5" />
        <path d="M14.286 10.971L8.686 16.571l3.714 3.715 3.314-3.315 5.972-5.971h-7.4z" fill="#0D47A1" />
        <path d="M8.686 16.571l3.714 3.715L8.686 24 4.971 20.286l3.715-3.715z" fill="#01579B" />
        <path d="M12.4 20.286l3.714-3.715 5.572 5.572L17.971 24l-5.571-3.714z" fill="#29B6F6" />
      </svg>
    );
  }

  // Dart
  if (normalized.includes('dart')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none">
        <path d="M4.108 4.108A4.108 4.108 0 0 1 7 2.9h10a4.108 4.108 0 0 1 2.892 1.208l-6.9 6.9-6.884-6.9z" fill="#01579B" />
        <path d="M4.108 4.108L13 13l-4 8a4.108 4.108 0 0 1-2.908-1.208l-3.2-6.4A4.108 4.108 0 0 1 2.9 10.5V7a4.108 4.108 0 0 1 1.208-2.892z" fill="#29B6F6" />
        <path d="M13 13l6.892-6.892A4.108 4.108 0 0 1 21.1 9v6a4.108 4.108 0 0 1-1.208 2.892l-6.892 3.2L13 13z" fill="#00B0FF" />
        <path d="M13 13l-4 8 4 3 6.892-2.908A4.108 4.108 0 0 0 21.1 18l-8.1-5z" fill="#00838F" />
      </svg>
    );
  }

  // React
  if (normalized.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" width={size} height={size} fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Next.js
  if (normalized.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 180 180" width={size} height={size}>
        <mask height="180" id="mask-next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#mask-next)">
          <circle cx="90" cy="90" fill="black" r="90" stroke="#fff" strokeWidth="8" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_next)" />
          <rect fill="url(#paint1_linear_next)" height="72" width="12" x="115" y="54" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_next" x1="109" x2="144.5" y1="116.5" y2="160.5">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_next" x1="121" x2="120.799" y1="54" y2="106.875">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Node.js
  if (normalized.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 32 32" width={size} height={size} fill="none">
        <path d="M16 2.5L3.5 9.7V24.3L16 31.5L28.5 24.3V9.7L16 2.5Z" fill="#339933" />
        <path d="M16 4.7L26.3 10.7V22.7L16 28.7L5.7 22.7V10.7L16 4.7Z" fill="#43853D" />
        <path d="M16 11C13.2 11 11 13.2 11 16C11 18.8 13.2 21 16 21C18.8 21 21 18.8 21 16C21 13.2 18.8 11 16 11Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // JavaScript
  if (normalized.includes('javascript') || normalized === 'js') {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size}>
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M6.5 18.5l2-1.2c.4.8.8 1.4 1.7 1.4.9 0 1.4-.4 1.4-1.3v-6.9h2.5v7c0 2.2-1.3 3.2-3.4 3.2-1.9 0-3.2-1-3.7-2.2zM15 18.2l2-1.2c.5.9 1.2 1.5 2.3 1.5 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.8-1.6l-.7-.3c-2-.9-3.3-2-3.3-4.3 0-2.1 1.6-3.7 4.1-3.7 1.8 0 3.1.6 3.9 2.2l-1.9 1.2c-.4-.7-.9-1.1-1.9-1.1s-1.5.5-1.5 1.1c0 .7.5 1 1.6 1.5l.7.3c2.3 1 3.5 2.1 3.5 4.5 0 2.6-2 3.9-4.5 3.9-2.5 0-4-1.2-4.6-2.4z" fill="#000000" />
      </svg>
    );
  }

  // TypeScript
  if (normalized.includes('typescript') || normalized === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size}>
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M12.5 8h-7v2.2h2.3v9.3h2.4v-9.3h2.3V8zm3.2 6.5c.5.8 1.2 1.3 2.1 1.3.8 0 1.3-.4 1.3-1 0-.6-.5-.9-1.5-1.3l-.6-.2c-1.8-.7-2.9-1.7-2.9-3.5 0-1.8 1.4-3.1 3.5-3.1 1.5 0 2.6.5 3.3 1.8l-1.6 1c-.3-.6-.8-.9-1.6-.9-.7 0-1.2.4-1.2.9 0 .5.4.8 1.4 1.2l.6.2c2 .8 3 1.8 3 3.7 0 2.1-1.6 3.3-3.8 3.3-2.1 0-3.4-1-4-2.1l1.6-1.4z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Express.js
  if (normalized.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#FFFFFF" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M7 16V8l5 8V8M15 8h3a2 2 0 0 1 0 4h-3M15 12h3a2 2 0 0 1 0 4h-3" />
      </svg>
    );
  }

  // MySQL / PostgreSQL / SQL / Database
  if (normalized.includes('sql') || normalized.includes('postgres') || normalized.includes('database')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#38BDF8" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }

  // Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="#38BDF8">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    );
  }

  // Redux Toolkit
  if (normalized.includes('redux')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="#764ABC">
        <path d="M16.5 6.5C14.6 4.6 11.4 4.6 9.5 6.5c-1.9 1.9-1.9 5.1 0 7l1.4 1.4-1.4 1.4c-2.7 2.7-7.1 2.7-9.8 0-2.7-2.7-2.7-7.1 0-9.8 2.7-2.7 7.1-2.7 9.8 0l1.4 1.4 1.4-1.4c1.9-1.9 5.1-1.9 7 0 1.9 1.9 1.9 5.1 0 7l-1.4 1.4 1.4 1.4c2.7 2.7 7.1 2.7 9.8 0 2.7-2.7 2.7-7.1 0-9.8-2.7-2.7-7.1-2.7-9.8 0l-1.4 1.4-1.4-1.4z" />
      </svg>
    );
  }

  // REST API / Networking
  if (normalized.includes('api') || normalized.includes('rest')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  // Dio / Axios / Networking
  if (normalized.includes('dio') || normalized.includes('axios')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }

  // Bcrypt / Security
  if (normalized.includes('bcrypt') || normalized.includes('auth')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

  // Provider / GoRouter / State Management
  if (normalized.includes('provider') || normalized.includes('router')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    );
  }

  // Architecture / Design Pattern (MVVM, SaaS, PRD)
  if (normalized.includes('mvvm') || normalized.includes('saas') || normalized.includes('architecture') || normalized.includes('prd')) {
    return (
      <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }

  // Default fallback code bracket
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
