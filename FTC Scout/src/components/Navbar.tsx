"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, BarChart, Home } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-orange-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <path d="M3 16.5l9-5.5 9 5.5"/>
              <path d="M3 12.5l9-5.5 9 5.5"/>
              <path d="M3 8.5l9-5.5 9 5.5"/>
            </svg>
            <span className="tracking-tight">FTC Scout</span>
          </Link>
          <div className="flex space-x-2">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                pathname === '/'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/scout"
              className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                pathname.startsWith('/scout')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Database size={18} />
              <span className="hidden sm:inline">Scout</span>
            </Link>
            <Link
              href="/analysis"
              className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                pathname.startsWith('/analysis')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <BarChart size={18} />
              <span className="hidden sm:inline">Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 