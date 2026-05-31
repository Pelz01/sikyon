"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  Activity, 
  HardDrive, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Network
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const workflowSteps = [
    {
      title: "1. Client-Side Hash Intake",
      subtitle: "Privacy-Preserving SHA-256 Extraction",
      desc: "The CFO imports raw financial statements locally. The browser extracts a cryptographic SHA-256 checksum in memory. The actual plaintext contents never touch a server, preventing critical institutional leaks.",
      action: "Open CFO Intake",
      link: "/app?tab=cfo",
      details: [
        { label: "Intake Node", value: "Client Local Thread" },
        { label: "Hashing Standard", value: "SHA-256 Cryptographic" },
        { label: "Privacy SLA", value: "Zero Plaintext Leakage" }
      ]
    },
    {
      title: "2. Walrus Blob Partitioning",
      subtitle: "Decentralized Redundant Archiving",
      desc: "The statement is partitioned and encoded using Fountain codes across the Walrus decentralized network. This secures files against node failures and generates an immutable content-addressed Blob ID.",
      action: "Explore Mechanism",
      link: "/about",
      details: [
        { label: "Storage Core", value: "Walrus Storage Nodes" },
        { label: "Redundancy Core", value: "Erasure Fountain Coding" },
        { label: "Address Hash", value: "walrus://blob/0x38bf...f42c" }
      ]
    },
    {
      title: "3. Sui Consensus Anchor",
      subtitle: "Smart Contract Registry Minting",
      desc: "An attestation object is minted on the Sui L1 ledger. The object permanently binds the Walrus Blob ID, the local SHA-256 hash, and the CFO's cryptographic signature, creating an unalterable proof of custody.",
      action: "View Ledger Explorer",
      link: "/app?tab=registry",
      details: [
        { label: "L1 Registry", value: "attestation.move" },
        { label: "State Settlement", value: "Sui Ledger Object" },
        { label: "Access Spec", value: "Read-only Immutable" }
      ]
    },
    {
      title: "4. Tatum RPC Verification",
      subtitle: "Low-Latency Audit Validation",
      desc: "Auditors retrieve the Sui contract states instantly using Tatum's indexed RPC endpoints. The auditor verifies the Walrus blob hash against the Sui registry to sign off on-chain.",
      action: "Launch Audit Portal",
      link: "/app?tab=auditor",
      details: [
        { label: "Gateway Node", value: "Tatum RPC Gateway" },
        { label: "SLA Response", value: "Indexed Query < 100ms" },
        { label: "Consensus Model", value: "Multi-sig Verification" }
      ]
    }
  ];

  const faqData: FAQItem[] = [
    {
      question: "How does TreasuryVault secure institutional document privacy?",
      answer: "We employ client-side hashing. When the CFO selects a statement, the browser calculates its SHA-256 hash locally in memory. The public ledger only stores the cryptographic hashes, metadata pointers, and signatures. Raw data stored on Walrus can be fully encrypted, ensuring no external party can read the statements without keys."
    },
    {
      question: "What are the benefits of Walrus storage over centralized AWS S3?",
      answer: "AWS S3 stores files on centralized servers, vulnerable to administrative deletion, database alterations, and targeted outages. Walrus partitions files using erasure codes across independent nodes. It is decentralized, serverless, tamper-proof, and content-addressed."
    },
    {
      question: "How does Tatum improve the application speed?",
      answer: "Querying raw blockchain node providers directly is slow and prone to timeouts. Tatum handles transaction routing, indexes contract parameters, and offers low-latency enterprise RPC gateways, ensuring the dashboard updates in milliseconds."
    },
    {
      question: "What happens if a document hash does not match the ledger?",
      answer: "If even a single character in the uploaded statement is modified, the computed SHA-256 hash will mismatch the Sui registry hash. The Auditor Portal instantly flags this mismatch as a 'Corrupt/Failed Verification' and rejects co-signing."
    }
  ];

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Editorial Full-Bleed Hero Section */}
      <section className="relative h-auto md:h-[calc(100vh-64px)] md:min-h-[600px] flex flex-col justify-end pt-24 pb-16 md:pb-24 px-6 md:px-16 overflow-hidden bg-white text-zinc-950">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
          style={{ backgroundImage: "url('/hero_bg.jpg')" }}
        ></div>
        {/* Soft Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10"></div>

        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          {/* Giant Bottom-Left Typography */}
          <div className="space-y-4 max-w-2xl animate-fade-in-up text-left relative z-30">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[0.88]">
              Cryptographic<br />
              Treasury<br />
              Vaults
            </h1>
          </div>

          {/* Bottom-Right Ivory Floating Card */}
          <div className="w-full md:max-w-sm shrink-0 animate-fade-in-up relative z-30" style={{ animationDelay: "100ms" }}>
            <div className="bg-[#fcfdfd] border border-zinc-200 rounded-xl p-6 md:p-8 text-left space-y-6 text-zinc-900 shadow-sm">
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                An enterprise-grade document attestation platform. Partition files on <span className="font-medium text-black">Walrus</span>, anchor hashes on the <span className="font-medium text-black">Sui Ledger</span>, and verify instantly via <span className="font-medium text-black">Tatum RPC</span> nodes.
              </p>

              <div className="space-y-2.5">
                <Link 
                  href="/app?tab=cfo" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-black hover:bg-zinc-800 text-white text-[11px] font-medium tracking-wider transition-all"
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
                <Link 
                  href="/app?tab=registry" 
                  className="w-full flex items-center justify-center py-3 rounded-full border border-zinc-250 bg-transparent hover:bg-zinc-50 text-zinc-800 text-[11px] font-medium tracking-wider transition-all"
                >
                  Global Registry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modular Stacks Details Grid */}
      <div className="bg-white border-t border-zinc-200">
        <section className="py-12 md:py-20 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Horizontal Divider and Header Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-950 leading-none">
              Decoupled stack.<br />
              Secure at every layer.
            </h2>
          </div>
          <div className="max-w-md md:pt-2">
            <p className="text-zinc-550 text-sm leading-relaxed font-medium">
              TreasuryVault decouples storage, blockchain registry, and network querying layers to ensure professional modular uptime.
            </p>
          </div>
        </div>

        {/* 3-Column Card Layout */}
        <div className="grid md:grid-cols-3 gap-8 font-sans">
          {/* Card 1 - Walrus */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-stretch min-h-[460px] shadow-sm relative overflow-hidden transition-all hover:border-zinc-350 hover:bg-zinc-50/40">
            {/* Ambient Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.04),transparent_65%)] pointer-events-none z-0"></div>

            <div className="space-y-6 relative z-10">
              {/* Badge Tag */}
              <div>
                <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200/80 rounded-[2px] text-[10px] font-medium tracking-wide">
                  Storage layer
                </span>
              </div>
              {/* Card Title */}
              <h3 className="text-2xl font-medium tracking-tight text-zinc-950 leading-tight">
                The storage layer<br />
                every audit relies on
              </h3>
            </div>

            {/* Centered Floating Notification Toast */}
            <div className="my-8 relative z-10 flex justify-center">
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-md w-full max-w-[280px] flex items-start gap-3.5 text-left transition-transform hover:-translate-y-0.5 duration-200">
                {/* Mesh Box */}
                <div className="w-10 h-10 bg-zinc-950 rounded-lg relative flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M4 4h16v16H4z M4 12h16 M12 4v16" />
                    <path d="M2 2l20 20 M2 22L22 2" strokeOpacity="0.25" />
                  </svg>
                  {/* Slack mini icon badge */}
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center p-[2px] shadow-sm">
                    <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
                      <path d="M9.5 18a2.5 2.5 0 110-5h2.5v5H9.5z M14.5 13a2.5 2.5 0 012.5 2.5v7.5a2.5 2.5 0 11-5 0v-7.5a2.5 2.5 0 012.5-2.5z" fill="#e01e5a" />
                      <path d="M18 9.5a2.5 2.5 0 115 0v2.5h-5V9.5z M23 14.5a2.5 2.5 0 01-2.5 2.5h-7.5a2.5 2.5 0 110-5h7.5a2.5 2.5 0 012.5 2.5z" fill="#36c5f0" />
                      <path d="M26.5 18a2.5 2.5 0 110 5h-2.5v-5H26.5z M21.5 23a2.5 2.5 0 01-2.5-2.5v-7.5a2.5 2.5 0 115 0v7.5a2.5 2.5 0 01-2.5 2.5z" fill="#2eb67d" />
                      <path d="M18 26.5a2.5 2.5 0 11-5 0v-2.5h5v2.5z M13 21.5a2.5 2.5 0 012.5-2.5h7.5a2.5 2.5 0 110 5h-7.5a2.5 2.5 0 01-2.5-2.5z" fill="#ecb22e" />
                    </svg>
                  </div>
                </div>
                {/* Toast Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-900 font-mono tracking-tight truncate">walrus://blob/0x38bf</span>
                    <span className="text-[9px] text-zinc-400 font-medium tracking-wider">now</span>
                  </div>
                  <p className="text-[10px] text-zinc-550 mt-1.5 leading-relaxed font-medium">
                    What's changed this week:<br />
                    • Redundant Fountain coding<br />
                    • Decentralized files split<br />
                    • Zero central outage risk
                  </p>
                </div>
              </div>
            </div>

            {/* Centered Button at Bottom */}
            <div className="relative z-10 flex justify-center">
              <Link 
                href="/about" 
                className="border border-zinc-200 hover:border-zinc-400 bg-transparent hover:bg-zinc-50 text-zinc-800 text-[10px] font-medium tracking-wider px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-sans"
              >
                Learn More
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          {/* Card 2 - Sui */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-stretch min-h-[460px] shadow-sm relative overflow-hidden transition-all hover:border-zinc-350 hover:bg-zinc-50/40">
            {/* Ambient Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_65%)] pointer-events-none z-0"></div>

            <div className="space-y-6 relative z-10">
              {/* Badge Tag */}
              <div>
                <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200/80 rounded-[2px] text-[10px] font-medium tracking-wide">
                  Consensus layer
                </span>
              </div>
              {/* Card Title */}
              <h3 className="text-2xl font-medium tracking-tight text-zinc-950 leading-tight">
                The consensus anchor<br />
                no admin can alter
              </h3>
            </div>

            {/* Centered Floating Notification Toast */}
            <div className="my-8 relative z-10 flex justify-center">
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-md w-full max-w-[280px] flex items-start gap-3.5 text-left transition-transform hover:-translate-y-0.5 duration-200">
                {/* Mesh Box */}
                <div className="w-10 h-10 bg-zinc-950 rounded-lg relative flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M4 4h16v16H4z M4 12h16 M12 4v16" />
                    <path d="M2 2l20 20 M2 22L22 2" strokeOpacity="0.25" />
                  </svg>
                  {/* Slack mini icon badge */}
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center p-[2px] shadow-sm">
                    <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
                      <path d="M9.5 18a2.5 2.5 0 110-5h2.5v5H9.5z M14.5 13a2.5 2.5 0 012.5 2.5v7.5a2.5 2.5 0 11-5 0v-7.5a2.5 2.5 0 012.5-2.5z" fill="#e01e5a" />
                      <path d="M18 9.5a2.5 2.5 0 115 0v2.5h-5V9.5z M23 14.5a2.5 2.5 0 01-2.5 2.5h-7.5a2.5 2.5 0 110-5h7.5a2.5 2.5 0 012.5 2.5z" fill="#36c5f0" />
                      <path d="M26.5 18a2.5 2.5 0 110 5h-2.5v-5H26.5z M21.5 23a2.5 2.5 0 01-2.5-2.5v-7.5a2.5 2.5 0 115 0v7.5a2.5 2.5 0 01-2.5 2.5z" fill="#2eb67d" />
                      <path d="M18 26.5a2.5 2.5 0 11-5 0v-2.5h5v2.5z M13 21.5a2.5 2.5 0 012.5-2.5h7.5a2.5 2.5 0 110 5h-7.5a2.5 2.5 0 01-2.5-2.5z" fill="#ecb22e" />
                    </svg>
                  </div>
                </div>
                {/* Toast Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-900 font-mono tracking-tight truncate">sui::attestation</span>
                    <span className="text-[9px] text-zinc-400 font-medium tracking-wider">anchored</span>
                  </div>
                  <p className="text-[10px] text-zinc-550 mt-1.5 leading-relaxed font-medium">
                    Verification checkpoint:<br />
                    • Move smart contract settle<br />
                    • CFO and Auditor signatures<br />
                    • Irreversible consensus anchor
                  </p>
                </div>
              </div>
            </div>

            {/* Centered Button at Bottom */}
            <div className="relative z-10 flex justify-center">
              <Link 
                href="/about" 
                className="border border-zinc-200 hover:border-zinc-400 bg-transparent hover:bg-zinc-50 text-zinc-800 text-[10px] font-medium tracking-wider px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-sans"
              >
                Learn More
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          {/* Card 3 - Tatum */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-stretch min-h-[460px] shadow-sm relative overflow-hidden transition-all hover:border-zinc-350 hover:bg-zinc-50/40">
            {/* Ambient Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.04),transparent_65%)] pointer-events-none z-0"></div>

            <div className="space-y-6 relative z-10">
              {/* Badge Tag */}
              <div>
                <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200/80 rounded-[2px] text-[10px] font-medium tracking-wide font-sans">
                  Gateway layer
                </span>
              </div>
              {/* Card Title */}
              <h3 className="text-2xl font-medium tracking-tight text-zinc-950 leading-tight font-sans">
                The query engine<br />
                delivering sub-100ms proof
              </h3>
            </div>

            {/* Centered Floating Notification Toast */}
            <div className="my-8 relative z-10 flex justify-center font-sans">
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-md w-full max-w-[280px] flex items-start gap-3.5 text-left transition-transform hover:-translate-y-0.5 duration-200">
                {/* Mesh Box */}
                <div className="w-10 h-10 bg-zinc-950 rounded-lg relative flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M4 4h16v16H4z M4 12h16 M12 4v16" />
                    <path d="M2 2l20 20 M2 22L22 2" strokeOpacity="0.25" />
                  </svg>
                  {/* Slack mini icon badge */}
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center p-[2px] shadow-sm">
                    <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
                      <path d="M9.5 18a2.5 2.5 0 110-5h2.5v5H9.5z M14.5 13a2.5 2.5 0 012.5 2.5v7.5a2.5 2.5 0 11-5 0v-7.5a2.5 2.5 0 012.5-2.5z" fill="#e01e5a" />
                      <path d="M18 9.5a2.5 2.5 0 115 0v2.5h-5V9.5z M23 14.5a2.5 2.5 0 01-2.5 2.5h-7.5a2.5 2.5 0 110-5h7.5a2.5 2.5 0 012.5 2.5z" fill="#36c5f0" />
                      <path d="M26.5 18a2.5 2.5 0 110 5h-2.5v-5H26.5z M21.5 23a2.5 2.5 0 01-2.5-2.5v-7.5a2.5 2.5 0 115 0v7.5a2.5 2.5 0 01-2.5 2.5z" fill="#2eb67d" />
                      <path d="M18 26.5a2.5 2.5 0 11-5 0v-2.5h5v2.5z M13 21.5a2.5 2.5 0 012.5-2.5h7.5a2.5 2.5 0 110 5h-7.5a2.5 2.5 0 01-2.5-2.5z" fill="#ecb22e" />
                    </svg>
                  </div>
                </div>
                {/* Toast Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-900 font-mono tracking-tight truncate">tatum-rpc-gateway</span>
                    <span className="text-[9px] text-[#3f6212] font-medium tracking-wider font-mono">92ms</span>
                  </div>
                  <p className="text-[10px] text-zinc-550 mt-1.5 leading-relaxed font-medium">
                    Live system indexes:<br />
                    • Tatum indexing feeds<br />
                    • Sub-100ms auditor syncs<br />
                    • 99.9% uptime SLA queries
                  </p>
                </div>
              </div>
            </div>

            {/* Centered Button at Bottom */}
            <div className="relative z-10 flex justify-center">
              <Link 
                href="/about" 
                className="border border-zinc-200 hover:border-zinc-400 bg-transparent hover:bg-zinc-50 text-zinc-800 text-[10px] font-medium tracking-wider px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-sans"
              >
                Learn More
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Containerized Cylinder Diagram Lifecycle Section */}
      <section className="bg-black text-white py-24 border-y border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 md:mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-none font-sans">
                A Pipeline.<br />
                Built to Trust.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left Column - Graphic (Hidden on mobile) */}
            <div className="hidden md:block md:col-span-5 relative items-center justify-center overflow-hidden h-[480px] bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
              {/* Background Image Container */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-luminosity brightness-[0.25] contrast-[1.05]" 
                style={{ backgroundImage: "url('/hero_bg.png')" }}
              ></div>
              
              {/* Schematic overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 500" fill="none">
                <g stroke="white" strokeWidth="0.75" strokeOpacity="0.25">
                  {/* Cylinder Side Vertical Lines */}
                  <line x1="140" y1="90" x2="140" y2="440" />
                  <line x1="260" y1="90" x2="260" y2="440" strokeDasharray="4 4" />
                  
                  {/* Stacked Ellipses */}
                  <ellipse cx="200" cy="90" rx="60" ry="16" strokeDasharray="3 3" />
                  <ellipse cx="200" cy="180" rx="60" ry="16" strokeDasharray="3 3" />
                  <ellipse cx="200" cy="270" rx="60" ry="16" strokeDasharray="3 3" />
                  <ellipse cx="200" cy="360" rx="60" ry="16" strokeDasharray="3 3" />
                  <ellipse cx="200" cy="440" rx="60" ry="16" />

                  {/* Solid Proof Circle */}
                  <circle cx="200" cy="440" r="32" fill="white" />

                  {/* Horizontal pointer lines going to the right edge */}
                  <line x1="200" y1="90" x2="400" y2="90" strokeOpacity="0.15" />
                  <line x1="200" y1="180" x2="400" y2="180" strokeOpacity="0.15" />
                  <line x1="200" y1="270" x2="400" y2="270" strokeOpacity="0.15" />
                  <line x1="200" y1="360" x2="400" y2="360" strokeOpacity="0.15" />
                </g>
              </svg>
              
              {/* Figure Labels */}
              <div className="absolute top-6 right-6 text-[10px] tracking-[0.2em] font-mono text-zinc-650 [writing-mode:vertical-lr] select-none">
                Fig. B
              </div>
              <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.2em] font-mono text-zinc-650 [writing-mode:vertical-lr] select-none">
                Integrity Pipeline
              </div>
            </div>

            {/* Right Column - Text Details */}
            <div className="md:col-span-7 space-y-8 flex flex-col justify-between text-white">
              {/* Numbered Steps */}
              <div className="relative pl-10 space-y-6">
                <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-zinc-800"></div>

                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-mono text-xs flex items-center justify-center font-medium shrink-0 z-10">
                    01
                  </div>
                  <div className="pt-1">
                    <h4 className="font-medium text-white text-xs">Client-Side Intake</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                      Privacy-preserving local SHA-256 hash extraction. Plaintext files never leave the CFO's browser.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-mono text-xs flex items-center justify-center font-medium shrink-0 z-10">
                    02
                  </div>
                  <div className="pt-1">
                    <h4 className="font-medium text-white text-xs">Walrus Redundancy</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                      Decentralized storage partitioning using Fountain codes. Statements are split, encoded, and scattered globally.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-mono text-xs flex items-center justify-center font-medium shrink-0 z-10">
                    03
                  </div>
                  <div className="pt-1">
                    <h4 className="font-medium text-white text-xs">Sui Consensus Anchor</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                      L1 smart contract anchor settlement. Attic objects permanently log signatures, timestamps, and hashes.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-mono text-xs flex items-center justify-center font-medium shrink-0 z-10">
                    04
                  </div>
                  <div className="pt-1">
                    <h4 className="font-medium text-white text-xs">Tatum Gateways</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                      Low-latency indexed RPC gateways feed live status to auditors, ensuring sub-100ms verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900 flex justify-start">
                <Link href="/app?tab=cfo" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-zinc-800 text-white text-[11px] font-medium tracking-wider hover:bg-white hover:text-black hover:border-white transition-all">
                  Get Started
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left Column - Editorial Header */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-955 mt-1 leading-none">
                Common<br />inquiries.
              </h2>
              <p className="text-zinc-550 text-sm mt-3 leading-relaxed">
                Everything you need to know about the TreasuryVault cryptographic validation and attestation architecture.
              </p>
            </div>
          </div>

          {/* Right Column - Premium Clean Accordion List */}
          <div className="lg:col-span-8 border-t border-zinc-200">
            {faqData.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-zinc-200 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left py-6 font-medium text-zinc-950 flex items-center justify-between gap-4 transition-colors group cursor-pointer text-sm"
                  >
                    <span className="group-hover:text-zinc-650 transition-colors">{item.question}</span>
                    <div className={`w-6 h-6 rounded-full border border-zinc-250 flex items-center justify-center shrink-0 transition-all ${ isOpen ? "bg-black border-black text-white" : "bg-transparent text-zinc-400 group-hover:border-zinc-400 group-hover:text-zinc-700" }`}>
                      {isOpen ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      )}
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${ isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0" } overflow-hidden`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-zinc-550 leading-relaxed pr-8">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Premium Dark CTA Conversion Section */}
      <section className="bg-black text-white py-24 px-6 md:px-16 relative overflow-hidden border-t border-zinc-900">
        <div className="max-w-3xl mx-auto relative z-10 text-center space-y-6 px-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-none">
            Verify instantly.<br />settle irreversibly.
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            Integrate TreasuryVault with your corporate accounts. Secure statement fragments globally on Walrus and log tamper-proof attestation hashes directly on SUI Move contract settle layers.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link 
              href="/app?tab=cfo" 
              className="bg-white hover:bg-zinc-100 text-black text-[11px] font-medium tracking-wider px-6 py-3 rounded-full transition-all flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={12} />
            </Link>
            <Link 
              href="/about" 
              className="border border-zinc-850 hover:border-zinc-700 bg-transparent text-white text-[11px] font-medium tracking-wider px-6 py-3 rounded-full transition-all"
            >
              Read Specs
            </Link>
          </div>
        </div>
      </section>

      {/* Redesigned Premium Dark Footer */}
      <footer className="bg-black text-white border-t border-zinc-900 font-sans">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col justify-between min-h-[400px]">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Top Left: Sunburst/Geometric Icon */}
            <div>
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            {/* Top Right: Pill-outlined Links Cluster */}
            <div className="flex flex-col items-end gap-6 max-w-xl">
              {/* Links Row 1 */}
              <div className="flex flex-wrap justify-end gap-2">
                <Link href="/about" className="border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full text-[10px] tracking-wider font-medium transition-all">
                  How It Works
                </Link>
                <Link href="/app?tab=cfo" className="border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full text-[10px] tracking-wider font-medium transition-all">
                  CFO Workspace
                </Link>
                <Link href="/app?tab=auditor" className="border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full text-[10px] tracking-wider font-medium transition-all">
                  Auditor Desk
                </Link>
                <Link href="/app?tab=registry" className="border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full text-[10px] tracking-wider font-medium transition-all">
                  Global Registry
                </Link>
              </div>

              {/* Links Row 2: Login & Info Links */}
              <div className="flex items-center gap-6">
                <Link href="/app" className="border border-white/10 hover:bg-white hover:text-black hover:border-white px-4 py-2 rounded-full text-[10px] tracking-wider font-medium transition-all flex items-center gap-1.5">
                  Launch App
                  <ArrowRight size={10} />
                </Link>
                <a href="#" className="text-zinc-400 hover:text-white text-[10px] tracking-wider font-medium transition-all">
                  Source Code
                </a>
                <a href="#" className="text-zinc-400 hover:text-white text-[10px] tracking-wider font-medium transition-all">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-12 border-t border-zinc-800/40">
            {/* Bottom Left: Large Title */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white select-none">
                TreasuryVault
              </h2>
            </div>

            {/* Bottom Right: Copyright & Credits */}
            <div className="text-left md:text-right font-mono text-[10px] text-zinc-500">
              <p className="font-sans">© 2026 TreasuryVault, Inc. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
