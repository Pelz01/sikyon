"use client";

import { useState } from "react";

interface LedgerItem {
  id: string;
  title: string;
  institution: string;
  balance: string;
  period: string;
  blobId: string;
  txHash: string;
  cfoSigner: string;
  auditorSigner: string;
  date: string;
  status: "verified" | "pending";
}

export default function BoardRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const initialLedger: LedgerItem[] = [
    {
      id: "att_01",
      title: "Q1 Treasury Reserve Audit",
      institution: "Fidelity Digital Assets",
      balance: "$225,320,000.00 USD",
      period: "Q1 2026",
      blobId: "wal_0x8f7c9e0d1a2938afbc9e",
      txHash: "sui_0x9cfb829ed8203f198e3b",
      cfoSigner: "0xCFO...4A2 (Signed)",
      auditorSigner: "0xAUD...9F1 (Co-signed)",
      date: "2026-04-01",
      status: "verified"
    },
    {
      id: "att_02",
      title: "April Cash Equivalent Yield Report",
      institution: "Anchorage Digital",
      balance: "$150,000,000.00 USD",
      period: "April 2026",
      blobId: "wal_0x2c4e9f8a6b4d3e5f2a1b",
      txHash: "sui_0x5c4d8e7b9a2d3e1f8c9b",
      cfoSigner: "0xCFO...4A2 (Signed)",
      auditorSigner: "0xAUD...9F1 (Co-signed)",
      date: "2026-05-02",
      status: "verified"
    },
    {
      id: "att_03",
      title: "Q2 Corporate Cash Reserve Statement",
      institution: "Coinbase Prime",
      balance: "$45,210,000.00 USD",
      period: "Q2 2026",
      blobId: "wal_0x0df2c9ba9c289f81a7d3",
      txHash: "sui_0x3ab8f498c4d2e1a90cbf",
      cfoSigner: "0xCFO...4A2 (Signed)",
      auditorSigner: "Awaiting Verification",
      date: "2026-05-30",
      status: "pending"
    }
  ];

  const filteredLedger = initialLedger.filter((item) => {
    // Apply search query
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.blobId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply filter tabs
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && item.status === activeFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-6 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8 animate-fade-in-up">
        <div>
          <span className="text-amber-500 text-xs font-mono font-medium tracking-widest">Reserve Ledger</span>
          <h1 className="text-4xl font-medium tracking-tight text-white mt-1">Attestation Registry</h1>
          <p className="text-slate-400 text-sm mt-1">Read-only cryptographic log. Inspect reserve audits, SUI anchor parameters, and Walrus blob IDs.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg vault-glass border border-white/5 text-xs text-slate-400 font-mono shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Tatum RPC Sync: Ready
        </div>
      </div>

      {/* Explorer Tool Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 font-mono text-[10px]">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2.5 font-medium rounded-lg border transition-all tracking-wider ${ activeFilter === "all" ? "bg-slate-900 border-white/10 text-white shadow-sm" : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300" }`}
          >
            All Ledger Logs ({initialLedger.length})
          </button>
          <button 
            onClick={() => setActiveFilter("verified")}
            className={`px-4 py-2.5 font-medium rounded-lg border transition-all tracking-wider ${ activeFilter === "verified" ? "bg-slate-900 border-white/10 text-emerald-400 shadow-sm" : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300" }`}
          >
            Verified ({initialLedger.filter(i => i.status === "verified").length})
          </button>
          <button 
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2.5 font-medium rounded-lg border transition-all tracking-wider ${ activeFilter === "pending" ? "bg-slate-900 border-white/10 text-yellow-500 shadow-sm" : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300" }`}
          >
            Pending ({initialLedger.filter(i => i.status === "pending").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-md font-mono">
          <svg className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Filter by title, custodian, or blob ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#08090a] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-[10px] text-white focus:outline-none focus:border-amber-500/50 transition-colors tracking-wider"
          />
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="vault-card rounded-2xl border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        
        {/* Table Head */}
        <div className="grid grid-cols-12 gap-4 p-5 bg-white/[0.02] border-b border-white/5 text-[10px] font-medium text-slate-500 tracking-wider font-mono hidden md:grid">
          <div className="col-span-4">Statement Payload</div>
          <div className="col-span-2">Period</div>
          <div className="col-span-3">Attested reserves</div>
          <div className="col-span-2">Verification Registry</div>
          <div className="col-span-1 text-center">Inspect</div>
        </div>

        {/* Table Rows */}
        {filteredLedger.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredLedger.map((item) => (
              <div key={item.id} className="transition-colors hover:bg-white/[0.01]">
                {/* Main Row */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center text-sm cursor-pointer select-none font-mono"
                >
                  {/* File & Custodian */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/15">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="font-sans">
                      <p className="font-medium text-white text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.institution}</p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="col-span-2 text-slate-400 md:block hidden text-xs">
                    {item.period}
                  </div>

                  {/* Declared Balance */}
                  <div className="col-span-3 font-medium text-emerald-400 text-xs">
                    {item.balance}
                  </div>

                  {/* Verification Status */}
                  <div className="col-span-2 font-sans text-xs">
                    {item.status === "verified" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20 font-mono">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-medium border border-yellow-500/20 font-mono animate-pulse">
                        PENDING
                      </span>
                    )}
                  </div>

                  {/* Expand Toggle */}
                  <div className="col-span-1 flex justify-center text-slate-500">
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedId === item.id ? "rotate-180 text-amber-500" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Section (Audit Trail details) */}
                {expandedId === item.id && (
                  <div className="bg-[#050607]/45 p-6 border-t border-white/5 space-y-6 animate-fade-in-up font-mono text-xs text-slate-400">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left specs */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-medium text-slate-500 tracking-wider font-sans">Verification Identifiers</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] text-slate-600 block">WALRUS STORAGE BLOB LINK</span>
                            <a href="#" className="text-amber-500 hover:underline block truncate">{item.blobId}</a>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-600 block">SUI REGISTRY CONTRACT TRANSACTION</span>
                            <span className="text-slate-300 block truncate">{item.txHash}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right specs */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-medium text-slate-500 tracking-wider font-sans">Multi-sig Signers</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] text-slate-600 block">CFO MINT SIGNATURE</span>
                            <span className="text-slate-300 block">{item.cfoSigner}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-600 block">AUDITOR REVIEW SIGNATURE</span>
                            <span className={`block font-medium ${item.status === "verified" ? "text-emerald-400" : "text-yellow-500"}`}>
                              {item.auditorSigner}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-600 font-sans">
                      <span>Log date: {item.date}</span>
                      <span>Sui Consensus parameters queried via Tatum RPC Node</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 font-mono text-xs tracking-wider">
            No attestation entries found.
          </div>
        )}

      </div>
    </div>
  </div>
);
}
