"use client";

import { useState } from "react";

interface PendingAudit {
  id: string;
  title: string;
  institution: string;
  balance: string;
  uploader: string;
  blobId: string;
  expectedHash: string;
  date: string;
  fileSize: string;
}

export default function AuditorDashboard() {
  const [selectedAudit, setSelectedAudit] = useState<PendingAudit | null>({
    id: "att_03",
    title: "Q2 Corporate Cash Reserve Statement",
    institution: "Coinbase Prime",
    balance: "$45,210,000.00 USD",
    uploader: "0xCFO...4A2",
    blobId: "wal_0x0df2c9ba9c289f81a7",
    expectedHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    date: "2026-05-30",
    fileSize: "2.4 MB"
  });

  const [activeList, setActiveList] = useState<PendingAudit[]>([
    {
      id: "att_03",
      title: "Q2 Corporate Cash Reserve Statement",
      institution: "Coinbase Prime",
      balance: "$45,210,000.00 USD",
      uploader: "0xCFO...4A2",
      blobId: "wal_0x0df2c9ba9c289f81a7",
      expectedHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      date: "2026-05-30",
      fileSize: "2.4 MB"
    }
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const startVerification = () => {
    setIsVerifying(true);
    setVerificationStep(1);

    // Simulate stepping through checks
    setTimeout(() => {
      setVerificationStep(2);
      setTimeout(() => {
        setVerificationStep(3);
        setTimeout(() => {
          setIsVerifying(false);
          setIsVerified(true);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleApprovalSubmit = () => {
    setIsApproved(true);
    // Clear list after mock database update
    setTimeout(() => {
      setActiveList([]);
      setSelectedAudit(null);
      setIsVerified(false);
      setIsApproved(false);
      setVerificationStep(0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-6 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8 animate-fade-in-up">
        <div>
          <span className="text-amber-500 text-xs font-mono font-medium tracking-widest">Verification Desk</span>
          <h1 className="text-4xl font-medium tracking-tight text-white mt-1">Auditor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Review pending statement submissions, audit cryptographic hashes, and co-sign attestations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-slate-500 font-mono">Tatum Node Endpoint: Sui Devnet</span>
        </div>
      </div>

      {/* Auditor Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Pending Review</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">{activeList.length} Statement(s)</div>
          <span className="text-[9px] text-yellow-500 font-mono mt-1.5 block">⌛ Awaiting Multi-sig Check</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Approved Attestations</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">14 Reports</div>
          <span className="text-[9px] text-emerald-400 font-mono mt-1.5 block">✓ 100% Cryptographic Match</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Total Audited Balance</span>
          <div className="text-2xl font-medium text-white mt-1 font-mono">$375,320,000.00</div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Verified Ledger Reserves</span>
        </div>
        <div className="vault-card rounded-2xl p-5 border border-white/5">
          <span className="text-slate-500 text-[10px] font-medium font-mono block">Gateway Latency</span>
          <div className="text-2xl font-medium text-emerald-400 mt-1 font-mono">92ms</div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">Tatum SLA Confirmed</span>
        </div>
      </div>

      {/* Split Pane Interface */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane - Pending Items List */}
        <div className="lg:col-span-5 space-y-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="vault-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white tracking-wider">Pending Attestations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a statement payload to initialize the cryptographic checking sequence.</p>
            </div>

            {activeList.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {activeList.map((audit) => (
                  <button
                    key={audit.id}
                    onClick={() => {
                      setSelectedAudit(audit);
                      setIsVerified(false);
                      setIsApproved(false);
                      setVerificationStep(0);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${ selectedAudit?.id === audit.id ? "bg-slate-900 border-amber-500/30 text-white" : "bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10" }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-white text-xs font-sans truncate max-w-[200px]">{audit.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{audit.institution} • {audit.date}</p>
                      <p className="text-xs text-amber-500 font-medium mt-1">{audit.balance}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 border border-dashed border-white/5 rounded-xl text-xs font-medium">
                No statement requests require review.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Verification details */}
        <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {selectedAudit ? (
            <div className="vault-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-6 relative overflow-hidden tech-border-corner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
              
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block tracking-wider">Active Evaluation</span>
                  <h3 className="text-xl font-medium text-white mt-1">{selectedAudit.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Intake wallet: {selectedAudit.uploader} • Date: {selectedAudit.date}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block font-sans">Declared Balance</span>
                  <span className="text-lg font-medium text-emerald-400 mt-1 block">{selectedAudit.balance}</span>
                </div>
              </div>

              {/* Specifications Detail Box */}
              <div className="grid md:grid-cols-2 gap-6 bg-slate-950/60 p-4 rounded-xl border border-white/5 font-mono text-xs">
                <div>
                  <span className="text-slate-600 text-[9px] block font-medium">Walrus Blob Storage Link</span>
                  <span className="text-slate-300 block truncate" title={selectedAudit.blobId}>{selectedAudit.blobId}</span>
                </div>
                <div>
                  <span className="text-slate-600 text-[9px] block font-medium">Expected SHA-256 Hash (Sui)</span>
                  <span className="text-slate-300 block truncate" title={selectedAudit.expectedHash}>{selectedAudit.expectedHash}</span>
                </div>
              </div>

              {/* Audit Checklist Simulator */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-medium font-mono text-slate-500 tracking-wider">Audit Verification Steps</h4>
                
                <div className="space-y-3 font-mono text-xs">
                  {/* Step 1 */}
                  <div className={`p-3 rounded-lg border transition-all flex items-center justify-between ${ verificationStep >= 1 ? "bg-[#08090a] border-white/10" : "bg-slate-950/20 border-white/5 text-slate-600" }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${ verificationStep > 1 ? "bg-emerald-400" : verificationStep === 1 ? "bg-amber-500 animate-pulse" : "bg-slate-800" }`}></span>
                      <span>1. Retrieve statement shards from Walrus network</span>
                    </div>
                    {verificationStep > 1 && <span className="text-emerald-400">✓ Retrieved ({selectedAudit.fileSize})</span>}
                    {verificationStep === 1 && <span className="text-amber-500 animate-pulse">Downloading shards...</span>}
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3 rounded-lg border transition-all flex items-center justify-between ${ verificationStep >= 2 ? "bg-[#08090a] border-white/10" : "bg-slate-950/20 border-white/5 text-slate-600" }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${ verificationStep > 2 ? "bg-emerald-400" : verificationStep === 2 ? "bg-amber-500 animate-pulse" : "bg-slate-800" }`}></span>
                      <span>2. Compute local file SHA-256 digest</span>
                    </div>
                    {verificationStep > 2 && <span className="text-emerald-400">✓ Computed Checksum</span>}
                    {verificationStep === 2 && <span className="text-amber-500 animate-pulse">Running sha256sum...</span>}
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3 rounded-lg border transition-all flex items-center justify-between ${ verificationStep >= 3 ? "bg-[#08090a] border-white/10" : "bg-slate-950/20 border-white/5 text-slate-600" }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${ isVerified ? "bg-emerald-400" : verificationStep === 3 ? "bg-amber-500 animate-pulse" : "bg-slate-800" }`}></span>
                      <span>3. Match with Sui Smart Contract anchor via Tatum RPC</span>
                    </div>
                    {isVerified && <span className="text-emerald-400 font-medium">✓ 100% Cryptographic Match</span>}
                    {verificationStep === 3 && <span className="text-amber-500 animate-pulse">Matching checksums...</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex gap-4 font-mono">
                {!isVerified ? (
                  <button
                    onClick={startVerification}
                    disabled={isVerifying}
                    className="w-full py-4 text-slate-950 font-medium rounded-xl transition-all glow-amber-button flex items-center justify-center gap-2 text-xs tracking-wider disabled:opacity-40"
                  >
                    {isVerifying ? "Running Cryptographic Audit..." : "Run Integrity Check"}
                  </button>
                ) : !isApproved ? (
                  <button
                    onClick={handleApprovalSubmit}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs tracking-wider"
                  >
                    Co-sign & Commit Attestation
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center rounded-xl font-medium font-mono text-xs tracking-wider animate-fade-in-up">
                    🎉 Attestation Approved and Anchored to Sui Registry!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="vault-card rounded-2xl p-12 border border-white/10 text-center text-slate-500 font-mono text-xs tracking-wider">
              No statement payload selected. Select a report to start verification.
            </div>
          )}
        </div>

      </div>
    </div>
  </div>
);
}
