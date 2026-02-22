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
  { id: 'control', label: 'Control Panel', icon: '🎛️', href: 'https://dashboard-gilt-one-zc4y5uu95v.vercel.app' },
];

export function NavigationSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div 
      className={`h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-48' : 'w-14'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
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
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`relative flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group ${
              item.id === 'team' ? 'bg-purple-900/30 border-r-2 border-purple-500' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Icon */}
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            
            {/* Label - shown when expanded */}
            {isExpanded && (
              <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}

            {/* Tooltip - shown when collapsed and hovered */}
            {!isExpanded && hoveredItem === item.id && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-lg border border-gray-700">
                {item.label}
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* Logo/Bottom */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl flex-shrink-0">🎬</span>
          {isExpanded && (
            <span className="text-sm font-bold text-white whitespace-nowrap overflow-hidden">Pacino</span>
          )}
        </div>
      </div>
    </div>
  );
}
