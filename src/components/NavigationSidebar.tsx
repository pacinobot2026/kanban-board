'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: '⚡', href: 'https://dashboard-gilt-one-zc4y5uu95v.vercel.app' },
  { id: 'custom-commands', label: 'Custom Commands', icon: '⌘', href: '#' },
  { id: 'team', label: 'Team Board', icon: '◉', href: '/' },
  { id: 'projects', label: 'Project Board', icon: '▦', href: '/' },
  { id: 'articles', label: 'Article Board', icon: '□', href: 'https://vizard-clips-app.vercel.app/articles' },
  { id: 'video', label: 'Video Cue System', icon: '▶', href: 'https://vizard-clips-app.vercel.app/dashboard' },
  { id: 'ideas', label: 'Idea Board', icon: '◈', href: 'https://vizard-clips-app.vercel.app/ideas' },
  { id: 'wishlist', label: 'Wish List', icon: '☆', href: '#' },
  { id: 'resources', label: 'Resource Library', icon: '⊞', href: '#' },
  { id: 'bookmarks', label: 'Bookmark Manager', icon: '⊡', href: 'https://vizard-clips-app.vercel.app/bookmarks' },
];

export function NavigationSidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-14 h-full bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`relative flex items-center justify-center h-12 text-gray-500 hover:text-white hover:bg-gray-900 transition-all group ${
              item.id === 'team' ? 'text-purple-400 bg-gray-900' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Icon */}
            <span className="text-lg font-light">{item.icon}</span>
            
            {/* Tooltip */}
            {hoveredItem === item.id && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap z-50 shadow-2xl border border-gray-700">
                {item.label}
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
              </div>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
