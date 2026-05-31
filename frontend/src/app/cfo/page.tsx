"use client";

import { useState } from "react";

interface TreasuryItem {
  id: string;
  title: string;
  institution: string;
  balance: string;
  blobId: string;
  txHash: string;
  date: string;
  status: "verified" | "pending" | "draft";
}

export default function CFODashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  // Form states
  const [reportTitle, setReportTitle] = useState("");
  const [declaredBalance, setDeclaredBalance] = useState("");
  const [institution, setInstitution] = useState("Coinbase Prime");
  const [period, setPeriod] = useState("Q2 2026");

  // Mock list of uploaded files
  const [history, setHistory] = useState<TreasuryItem[]>([
    {
      id: "att_01",
      title: "Q1 Treasury Reserve Audit",
      institution: "Fidelity Digital Assets",
      balance: "$225,320,000.00 USD",
      blobId: "wal_0x8f7c9e0d1a...",
      txHash: "sui_0x9cfb829ed8...",
      date: "2026-04-01",
      status: "verified"
    },
    {
      id: "att_02",
      title: "April Cash Equivalent Yield Report",
      institution: "Anchorage Digital",
      balance: "$150,000,000.00 USD",
      blobId: "wal_0x2c4e9f8a6b...",
      txHash: "sui_0x5c4d8e7b9a...",
      date: "2026-05-02",
      status: "verified"
    }
  ]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !reportTitle || !declaredBalance) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate upload stages
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsUploading(false);
            setSuccess(true);
            
            // Add to history list as pending
            const newItem: TreasuryItem = {
              id: `att_${Date.now()}`,
              title: reportTitle,
              institution: institution,
              balance: `$${Number(declaredBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
              blobId: `wal_0x${Math.random().toString(16).substr(2, 10)}...`,
              txHash: `sui_0x${Math.random().toString(16).substr(2, 10)}...`,
              date: new Date().toISOString().split("T")[0],
              status: "pending"
            };
            setHistory(prevHistory => [newItem, ...prevHistory]);
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const resetForm = () => {
    setFile(null);
    setReportTitle("");
    setDeclaredBalance("");
    setSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-6 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8 animate-fade-in-up">
        <div>
          <span className="text-cyan-400 text-xs font-mono font-medium tracking-widest">Office of the CFO</span>
          <h1 className="text-4xl font-medium tracking-tight text-white mt-1">CFO Intake Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Submit reserve statements, generate cryptographic signatures, and request auditor signoffs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
          <span className="text-xs text-slate-500 font-mono">Tatum Node Endpoint: Sui Devnet</span>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Attested Capital</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">$375,320,000.00</div>
          <span className="text-[9px] text-emerald-400 font-mono mt-1.5 block">✓ Verified On-Chain</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Pending Auditor Review</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">
            {history.filter(h => h.status === "pending").length} Statement(s)
          </div>
          <span className="text-[9px] text-yellow-500 font-mono mt-1.5 block">⌛ Awaiting Co-signature</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Walrus Blobs Saved</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">4.8 MB</div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">2 Distinct Blocks</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Tatum Node Health</span>
          <div className="text-2xl font-medium text-emerald-400 mt-1 font-mono">100% SLA</div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Ping: 92ms</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Submission Form */}
        <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="vault-card rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden tech-border-corner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Attest Reserve Report
            </h2>

            {!success ? (
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                
                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium font-mono text-slate-400 block tracking-wider">Statement Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Q2 Reserve Attestation" 
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      required
                      className="w-full bg-[#08090a] border border-white/5 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium font-mono text-slate-400 block tracking-wider">Custodian / Institution</label>
                    <select 
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full bg-[#08090a] border border-white/5 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                    >
                      <option>Coinbase Prime</option>
                      <option>Fidelity Digital Assets</option>
                      <option>Anchorage Digital</option>
                      <option>Bank of New York Mellon</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium font-mono text-slate-400 block tracking-wider">Declared Balance (USD)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 45000000" 
                      value={declaredBalance}
                      onChange={(e) => setDeclaredBalance(e.target.value)}
                      required
                      className="w-full bg-[#08090a] border border-white/5 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium font-mono text-slate-400 block tracking-wider">Fiscal Period</label>
                    <select 
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-[#08090a] border border-white/5 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                    >
                      <option>Q2 2026</option>
                      <option>Q1 2026</option>
                      <option>Q4 2025</option>
                      <option>Q3 2025</option>
                    </select>
                  </div>
                </div>

                {/* File Dropzone */}
                <div className="border border-white/5 rounded-xl p-8 text-center hover:border-blue-500/30 transition-colors bg-[#08090a]/40 group relative">
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-blue-500/20">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white tracking-wider font-sans">Upload Statement Report</h4>
                      <p className="text-[10px] text-slate-500 mt-1 font-sans">PDF, CSV, or Excel (max 50MB)</p>
                    </div>
                    {file ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                        Selected: {file.name}
                      </div>
                    ) : (
                      <span className="inline-block px-4 py-2 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300 font-medium hover:bg-white/10 transition-all tracking-wider font-sans">
                        Browse File
                      </span>
                    )}
                  </label>
                </div>

                {/* Upload Action Button */}
                {isUploading ? (
                  <div className="space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Encrypting, fragmenting, and uploading to Walrus...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#08090a] rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    disabled={!file || !reportTitle || !declaredBalance}
                    className="w-full py-4 text-white font-medium rounded-xl transition-all glow-cyan-button flex items-center justify-center gap-2 text-xs tracking-wider disabled:opacity-35"
                  >
                    Commit & Request Attestation
                  </button>
                )}
              </form>
            ) : (
              // Success Screen
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Attestation Registered</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto font-sans">
                    The report has been fragmented and saved to Walrus. Cryptographic proof parameters are logged on Sui.
                  </p>
                </div>

                <div className="vault-glass text-left p-5 rounded-xl max-w-sm mx-auto border border-white/5 space-y-3 font-mono text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Statement ID</span>
                    <span className="text-white font-medium">att_03</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Asset Balance</span>
                    <span className="text-emerald-400 font-medium">${Number(declaredBalance).toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Walrus Blob ID</span>
                    <span className="text-white truncate max-w-[160px]" title="wal_0x0df2c9ba9c">wal_0x0df2c9ba9c...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Sui Contract Tx</span>
                    <span className="text-blue-400 truncate max-w-[160px]" title="sui_0x3ab8f498c4">sui_0x3ab8f498c4...</span>
                  </div>
                </div>

                <button 
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg border border-white/5 transition-all tracking-wider font-sans"
                >
                  Upload Another Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Submissions Registry History */}
        <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="vault-card rounded-2xl p-6 border border-white/10 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Recent Intake Submissions</h3>
              <p className="text-xs text-slate-500 mt-1">Audit trail of statements registered by your department.</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-3 hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-medium text-white text-xs font-sans truncate max-w-[160px]">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.institution} • {item.date}</span>
                    </div>
                    {item.status === "verified" ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        VERIFIED
                      </span>
                    ) : item.status === "pending" ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 animate-pulse">
                        PENDING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-slate-500/10 border border-white/10 text-slate-400">
                        DRAFT
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
                    <span className="text-slate-300 font-medium">{item.balance}</span>
                    <div className="flex gap-2 font-sans font-medium">
                      <a href="#" className="text-blue-400 hover:text-blue-300">Blob</a>
                      <span className="text-slate-800">|</span>
                      <a href="#" className="text-blue-400 hover:text-blue-300">Sui</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}
