"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HardDrive, 
  ShieldCheck, 
  Activity, 
  Check, 
  ArrowLeft 
} from "lucide-react";

export default function AboutPage() {
  const [activeLayer, setActiveLayer] = useState<"walrus" | "sui" | "tatum">("walrus");

  const layersInfo = {
    walrus: {
      name: "Walrus Storage Protocol",
      role: "Decentralized Raw File Storage",
      desc: "Unlike standard clouds that keep files intact on single servers, Walrus uses Fountain codes (erasure coding) to slice files into redundant pieces and scatter them globally. It is serverless, content-addressed, and permanently retrievable.",
      metrics: [
        { label: "Data Integrity", value: "Mathematical Erasure Coding" },
        { label: "Locating Protocol", value: "256-bit Blob ID Pointer" },
        { label: "Censorship Barrier", value: "100% Serverless Node Grid" }
      ]
    },
    sui: {
      name: "Sui L1 Smart Contract",
      role: "Immutable Proof Settlement",
      desc: "Sui hosts the attestation Move contract. When files are uploaded, a Sui object records the file hash, uploader identity, and audit signatures. This creates an unalterable, time-stamped proof of custody registered by consensus nodes.",
      metrics: [
        { label: "Consensus Model", value: "Delegated Proof-of-Stake" },
        { label: "Contract Language", value: "Sui Move (attestation.move)" },
        { label: "Proof Security", value: "Cryptographic Multi-sig Signatures" }
      ]
    },
    tatum: {
      name: "Tatum RPC Gateway",
      role: "Enterprise Blockchain Infrastructure",
      desc: "Tatum hosts the low-latency RPC full nodes and indexing queries. Instead of frontend apps waiting for raw Sui chain indexing, Tatum routes all smart contract queries, updates, and balance checks under 100 milliseconds.",
      metrics: [
        { label: "API SLA Guarantee", value: "99.9% Production Node Uptime" },
        { label: "Query Optimization", value: "Enterprise Indexing Engine" },
        { label: "Latency Rating", value: "Sub-100ms Response Times" }
      ]
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-luminosity brightness-[0.25] contrast-[1.05] z-0" 
        style={{ backgroundImage: "url('/hero_bg.png')" }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 space-y-12 relative z-10">
        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-4 font-mono">
            <ArrowLeft size={12} />
            BACK TO HOME
          </Link>
          <div>
            <span className="text-zinc-500 text-[10px] font-mono font-medium tracking-widest">Protocol Specifications</span>
            <h1 className="text-4xl font-medium tracking-tight text-white mt-1">Under the Hood: TreasuryVault</h1>
            <p className="text-zinc-400 text-sm mt-1">Learn how the decentralized three-layer consensus model ensures reserves verification.</p>
          </div>
        </div>

        {/* Interactive Protocol Blueprint */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up" style={{ animationDelay: "50ms" }}>
          
          {/* Left Side: Interactive Layer Selection */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Attestation Stack Blueprint</h3>
              <p className="text-xs text-zinc-500">Toggle between the architecture layers to inspect protocol specifics.</p>
              
              <div className="space-y-2.5 pt-2">
                <button 
                  onClick={() => setActiveLayer("walrus")}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center gap-3 ${ activeLayer === "walrus" ? "bg-white border-white text-black" : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-white" }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${ activeLayer === "walrus" ? "bg-zinc-100 border-zinc-200 text-black" : "bg-zinc-950 border-zinc-800 text-zinc-400" }`}>
                    <HardDrive size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-xs">Walrus Protocol</h4>
                    <span className={`text-[10px] block ${activeLayer === "walrus" ? "text-zinc-600" : "text-zinc-500"}`}>Decentralized Storage Layer</span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveLayer("sui")}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center gap-3 ${ activeLayer === "sui" ? "bg-white border-white text-black" : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-white" }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${ activeLayer === "sui" ? "bg-zinc-100 border-zinc-200 text-black" : "bg-zinc-950 border-zinc-800 text-zinc-400" }`}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-xs">Sui Smart Contracts</h4>
                    <span className={`text-[10px] block ${activeLayer === "sui" ? "text-zinc-600" : "text-zinc-500"}`}>Immutable Verification Registry</span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveLayer("tatum")}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center gap-3 ${ activeLayer === "tatum" ? "bg-white border-white text-black" : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-white" }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${ activeLayer === "tatum" ? "bg-zinc-100 border-zinc-200 text-black" : "bg-zinc-950 border-zinc-800 text-zinc-400" }`}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-xs">Tatum Infrastructure</h4>
                    <span className={`text-[10px] block ${activeLayer === "tatum" ? "text-zinc-600" : "text-zinc-500"}`}>Enterprise Node API & Gateway</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
              System Topology: Decoupled Web3 Services
            </div>
          </div>

          {/* Right Side: Specifications Panel */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 md:p-8 backdrop-blur-sm min-h-[340px] flex flex-col justify-between relative overflow-hidden transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-medium tracking-wider text-zinc-400 block mb-1">
                    {layersInfo[activeLayer].role}
                  </span>
                  <h3 className="text-xl font-medium text-white">{layersInfo[activeLayer].name}</h3>
                </div>

                <p className="text-zinc-300 leading-relaxed text-xs">
                  {layersInfo[activeLayer].desc}
                </p>

                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <h5 className="text-[10px] font-medium text-zinc-500 tracking-wider">Technical Specifications</h5>
                  <div className="grid md:grid-cols-3 gap-6 font-mono text-[11px]">
                    {layersInfo[activeLayer].metrics.map((m, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-zinc-500 text-[8px] block">{m.label}</span>
                        <span className="text-zinc-200 block font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Comparison Grid: Traditional vs. Decoupled Attestation */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div>
            <h3 className="text-lg font-medium text-white">Trust Matrix: Traditional vs. TreasuryVault</h3>
            <p className="text-xs text-zinc-500 mt-1 font-mono tracking-wider">Why institutional reserve validation requires a three-layer blockchain architecture.</p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-12 gap-4 p-4 bg-zinc-900/30 border-b border-zinc-800 text-[10px] font-medium text-zinc-500 tracking-wider font-mono hidden md:grid">
              <div className="col-span-3">Feature Parameter</div>
              <div className="col-span-4">Traditional Centralized (S3 / GCS)</div>
              <div className="col-span-5">TreasuryVault Protocol</div>
            </div>

            <div className="divide-y divide-zinc-800 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 font-medium text-white">Tamper Protection</div>
                <div className="col-span-4 text-zinc-400">File can be altered or replaced silently by system admins.</div>
                <div className="col-span-5 text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] flex items-center gap-1">
                    <Check size={10} className="text-emerald-400" />
                    Sui Verified
                  </span>
                  <span>Impossible. File modification invalidates the Sui blockchain hash checklist.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 font-medium text-white">Storage Redundancy</div>
                <div className="col-span-4 text-zinc-400">Single cloud server backup (vulnerable to datacenter outages).</div>
                <div className="col-span-5 text-zinc-300">Distributed multi-node storage slices across Walrus network.</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 font-medium text-white">Trust Model</div>
                <div className="col-span-4 text-zinc-400">Trust the email sender or cloud credential key validation.</div>
                <div className="col-span-5 text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] flex items-center gap-1">
                    <Check size={10} className="text-emerald-400" />
                    Consensus
                  </span>
                  <span>Trust the cryptography. Multi-sig consensus co-signing by CFO & Auditor.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 font-medium text-white">API Performance</div>
                <div className="col-span-4 text-zinc-400">Variable cloud throttling or node query limits.</div>
                <div className="col-span-5 text-zinc-300">SLA-backed node routing and high-speed indexing via Tatum gateway.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
