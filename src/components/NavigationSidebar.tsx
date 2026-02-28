'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command-center', label: 'OpenClaw Command Center', icon: '🎛️', href: 'https://dashboard-gilt-one-zc4y5uu95v.vercel.app' },
  { id: 'custom-commands', label: 'Custom Command Engine', icon: '⚙️', href: '#' },
  { id: 'team', label: 'Team Board', icon: '👥', href: '/' },
  { id: 'projects', label: 'Project Board', icon: '📋', href: '/' },
  { id: 'articles', label: 'Article Board', icon: '📰', href: 'https://vizard-clips-app.vercel.app/articles' },
  { id: 'video', label: 'Video Cue System', icon: '🎬', href: 'https://vizard-clips-app.vercel.app/dashboard' },
  { id: 'ideas', label: 'Idea Board', icon: '💡', href: 'https://vizard-clips-app.vercel.app/ideas' },
  { id: 'wishlist', label: 'Wish List', icon: '⭐', href: '#' },
  { id: 'resources', label: 'Resource Library', icon: '📚', href: '#' },
  { id: 'bookmarks', label: 'Bookmark Manager', icon: '🔖', href: 'https://vizard-clips-app.vercel.app/bookmarks' },
];

export function NavigationSidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-16 h-full bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Logo/Top */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <span className="text-2xl">🎬</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`relative flex items-center justify-center h-14 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors group ${
              item.id === 'team' ? 'bg-purple-900/30 border-r-2 border-purple-500 text-white' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Icon */}
            <span className="text-xl">{item.icon}</span>
            
            {/* Tooltip */}
            {hoveredItem === item.id && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl border border-gray-700">
                {item.label}
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
