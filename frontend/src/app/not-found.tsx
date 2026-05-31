import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center bg-[#0a0a0c] text-zinc-100 antialiased font-sans">
      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h1 className="text-4xl font-medium tracking-tight text-white mb-2">Page Not Found</h1>
      <p className="text-sm text-zinc-500 mb-8 font-mono">CODE: 404_VAULT_OUT_OF_BOUNDS</p>
      <Link href="/" className="border border-zinc-800 bg-white text-black hover:bg-zinc-100 rounded-full px-5 py-2.5 text-xs font-medium tracking-wider transition-all">
        Return to Dashboard
      </Link>
    </div>
  );
}
