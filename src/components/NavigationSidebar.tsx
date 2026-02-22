'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'team', label: 'Team Board', icon: '👥', href: '/' },
  { id: 'openclaw', label: 'OpenClaw Board', icon: '🤖', href: '/openclaw' },
  { id: 'video', label: 'Video Board', icon: '🎬', href: 'https://vizard-clips-app.vercel.app' },
  { id: 'control', label: 'Control Panel', icon: '🎛️', href: 'https://skill2-dashboard.vercel.app' },
];

export function NavigationSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      className={`h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-48' : 'w-14'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              item.id === 'team' ? 'bg-purple-900/30 border-r-2 border-purple-500' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isExpanded && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
          </a>
        ))}
      </nav>

      {/* Logo/Bottom */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎬</span>
          {isExpanded && (
            <span className="text-sm font-bold text-white">Pacino</span>
          )}
        </div>
      </div>
    </div>
  );
}
