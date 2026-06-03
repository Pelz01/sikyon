"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isInApp = pathname.startsWith("/app");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 flex items-center justify-center bg-black text-white font-medium text-[10px] rounded-[4px]">
            TV
          </div>
          <span className="text-sm font-medium tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
            TreasuryVault
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isInApp && (
            <Link 
              href="/about" 
              className="border border-zinc-200 hover:border-zinc-400 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-all"
            >
              How It Works
            </Link>
          )}

          {isInApp ? (
            <div className="px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-[11px] font-medium text-zinc-500">
              Wallet in app
            </div>
          ) : (
            <Link
              href="/app"
              className="border border-black bg-black text-white hover:bg-zinc-800 rounded-full px-4 py-1.5 text-[11px] font-medium transition-all"
            >
              Launch App
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
