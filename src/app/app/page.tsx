"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Building2, 
  ShieldCheck, 
  Database,
  Menu,
  ChevronRight,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Activity,
  Search,
  Check,
  Shield,
  CircleDashed,
  ExternalLink,
  X
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
interface TreasuryItem {
  id: string;
  title: string;
  institution: string;
  balance: string;
  blobId: string;
  txHash: string;
  publicId?: string;
  objectId?: string;
  date: string;
  verifiedDate?: string;
  status: "verified" | "pending" | "draft";
  period?: string;
  cfoSigner?: string;
  auditorSigner?: string;
  fileSize?: string;
  expectedHash?: string;
  uploader?: string;
}

type TabKey = "cfo" | "auditor" | "registry";

function getTabFromParams(searchParams: URLSearchParams): TabKey {
  const tabParam = searchParams.get("tab");
  return tabParam === "auditor" || tabParam === "registry" ? tabParam : "cfo";
}

/* ───────────────────── Seed Data ──────────────────── */
const SEED_HISTORY: TreasuryItem[] = [
  {
    id: "att_01",
    title: "Q1 Treasury Reserve Audit",
    institution: "Fidelity Digital Assets",
    balance: "$225,320,000.00 USD",
    blobId: "wal_0x8f7c9e0d1a2938afbc9e",
    txHash: "sui_0x9cfb829ed8203f198e3b",
    publicId: "attestation-001",
    objectId: "0x9d1b7f4a8c2e6b019af5c31d8e72a449",
    date: "2026-04-01",
    verifiedDate: "2026-04-03",
    status: "verified",
    period: "Q1 2026",
    cfoSigner: "0xCFO...4A2",
    auditorSigner: "0xAUD...9F1",
    expectedHash: "91b7f8c0d4c1e2a53f6a7d1b0c9e8f37452aa7016cfbd8e9f0a142b3c4d5e6f71",
    uploader: "0xCFO...4A2",
  },
  {
    id: "att_02",
    title: "April Cash Equivalent Yield Report",
    institution: "Anchorage Digital",
    balance: "$150,000,000.00 USD",
    blobId: "wal_0x2c4e9f8a6b4d3e5f2a1b",
    txHash: "sui_0x5c4d8e7b9a2d3e1f8c9b",
    publicId: "attestation-002",
    objectId: "0x3a81e9f2c57b660e6d018f4a9cb73d21",
    date: "2026-05-02",
    verifiedDate: "2026-05-04",
    status: "verified",
    period: "April 2026",
    cfoSigner: "0xCFO...4A2",
    auditorSigner: "0xAUD...9F1",
    expectedHash: "c2e4f6a8190b73dd45f9a2c18e7b61f0d3a55c9e48217a0bb6f33d2e1c984af5",
    uploader: "0xCFO...4A2",
  },
  {
    id: "att_03",
    title: "Q2 Corporate Cash Reserve Statement",
    institution: "Coinbase Prime",
    balance: "$45,210,000.00 USD",
    blobId: "wal_0x0df2c9ba9c289f81a7d3",
    txHash: "sui_0x3ab8f498c4d2e1a90cbf",
    publicId: "attestation-003",
    objectId: "0x7f2d916a4b8e0c39a5d1f442be93c670",
    date: "2026-05-30",
    status: "pending",
    period: "Q2 2026",
    cfoSigner: "0xCFO...4A2",
    auditorSigner: "Awaiting Co-signature",
    fileSize: "2.4 MB",
    expectedHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    uploader: "0xCFO...4A2",
  },
];

const SUIVISION_URL = "https://suivision.xyz";
const WALRUS_URL = "https://walruscan.com";

/* ══════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
   ══════════════════════════════════════════════════════════════ */
function AppDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>(() => getTabFromParams(searchParams));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  const TABS = [
    { key: "cfo" as TabKey, label: "CFO Intake", icon: <Building2 size={16} /> },
    { key: "auditor" as TabKey, label: "Auditor Verification", icon: <ShieldCheck size={16} /> },
    { key: "registry" as TabKey, label: "Verified Treasury Records", icon: <Database size={16} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-50 text-zinc-900 font-sans">
      {/* Mobile Top Navigation Tabs (Hidden on Desktop) */}
      <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-2.5 flex justify-between items-center shrink-0">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none w-full justify-around">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium tracking-tight transition-all ${isActive ? "bg-black text-white" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"}`}
              >
                {tab.icon}
                <span>{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside
        className={`hidden md:flex ${ sidebarOpen ? "w-60" : "w-[68px]" } shrink-0 transition-all duration-200 ease-in-out flex-col border-r border-zinc-200 bg-white z-10`}
      >
        <div className="h-14 flex items-center px-4 border-b border-zinc-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <Menu size={16} />
          </button>
          {sidebarOpen && (
            <span className="ml-3 text-xs font-medium text-zinc-500 tracking-wide truncate">
              Menu
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`w-full flex items-center gap-3 rounded-md transition-colors duration-150 group relative ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"} ${isActive ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"}`}
              >
                <span className={`shrink-0 ${isActive ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-700"}`}>
                  {tab.icon}
                </span>
                {sidebarOpen && (
                  <span className="text-sm tracking-tight truncate">{tab.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {sidebarOpen && (
              <button className="group relative text-left text-xs font-medium text-zinc-500 truncate">
                Tatum Node: Connected
                <span className="pointer-events-none absolute bottom-6 left-0 z-20 w-max max-w-[220px] rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[10px] text-zinc-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                  sui-mainnet.gateway.tatum.io
                </span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─────────── MAIN CONTENT AREA ─────────── */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {activeTab === "cfo" && <CFOPanel />}
        {activeTab === "auditor" && <AuditorPanel />}
        {activeTab === "registry" && <RegistryPanel />}
      </main>
    </div>
  );
}

export default function AppDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-50">
        <div className="text-zinc-500 font-medium text-xs flex items-center gap-2">
          <CircleDashed className="animate-spin text-zinc-400" size={16} />
          Loading workspace...
        </div>
      </div>
    }>
      <AppDashboardContent />
    </Suspense>
  );
}

/* ══════════════════════════════════════════════════════════════
   CFO INTAKE PANEL
   ══════════════════════════════════════════════════════════════ */
function CFOPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [declaredBalance, setDeclaredBalance] = useState("");
  const [institution, setInstitution] = useState("Coinbase Prime");
  const [period, setPeriod] = useState("Q2 2026");
  const [submittedId, setSubmittedId] = useState("");
  const [submittedProof, setSubmittedProof] = useState<TreasuryItem | null>(null);
  const [history, setHistory] = useState<TreasuryItem[]>(SEED_HISTORY.filter(h => h.status === "verified" || h.status === "pending"));
  const activeStep = success ? 4 : isUploading ? Math.min(3, Math.max(2, Math.ceil(uploadProgress / 40))) : file ? 1 : 0;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !reportTitle || !declaredBalance) return;
    setIsUploading(true);
    setUploadProgress(10);
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsUploading(false);
            setSuccess(true);
            const attestationId = `att_${Date.now()}`;
            setSubmittedId(attestationId);
            const blobId = `0x${Math.random().toString(16).slice(2, 14)}${Math.random().toString(16).slice(2, 8)}`;
            const objectId = `0x${Math.random().toString(16).slice(2, 14)}${Math.random().toString(16).slice(2, 8)}`;
            const newItem: TreasuryItem = {
              id: attestationId,
              title: reportTitle,
              institution,
              balance: `$${Number(declaredBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
              blobId,
              objectId,
              txHash: `0x${Math.random().toString(16).slice(2, 14)}${Math.random().toString(16).slice(2, 8)}`,
              publicId: "attestation-draft",
              date: new Date().toISOString().split("T")[0],
              status: "pending",
              period,
              cfoSigner: "0xCFO...4A2",
              auditorSigner: "Awaiting Co-signature",
              uploader: "0xCFO...4A2",
              expectedHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            };
            setSubmittedProof(newItem);
            setHistory((prev) => [newItem, ...prev]);
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8 animate-fade-in-up">
      <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Building2 className="text-zinc-400" size={24} />
            CFO Intake Portal
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">Submit reserve statements and request auditor multi-sig.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {[
            "Upload",
            "Store on Walrus",
            "Record on Sui",
            "Pending Audit",
          ].map((label, index) => {
            const step = index + 1;
            const isActive = activeStep === step;
            const isDone = activeStep > step;
            return (
              <div key={label} className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${isActive ? "border-zinc-900 bg-zinc-950 text-white shadow-sm" : isDone ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-white text-zinc-500"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${isActive ? "border-white/40 bg-white text-black" : isDone ? "border-emerald-300 bg-white text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
                  {isDone ? <Check size={13} /> : step}
                </span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
            <h2 className="text-sm font-medium text-zinc-900 mb-6 flex items-center gap-2">
              <FileText size={16} className="text-zinc-400" />
              New Attestation Payload
            </h2>

            {!success ? (
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600">Title</label>
                    <input type="text" placeholder="Q2 Reserve" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} required className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600">Institution</label>
                    <select value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors">
                      <option>Coinbase Prime</option>
                      <option>Fidelity Digital</option>
                      <option>Anchorage</option>
                      <option>BNY Mellon</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600">Declared Balance</label>
                    <input type="number" placeholder="45000000" value={declaredBalance} onChange={(e) => setDeclaredBalance(e.target.value)} required className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600">Fiscal Period</label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors">
                      <option>Q2 2026</option>
                      <option>Q1 2026</option>
                      <option>Q4 2025</option>
                    </select>
                  </div>
                </div>

                <div className="border border-zinc-300 border-dashed rounded-lg p-6 text-center hover:bg-zinc-50 transition-colors bg-white">
                  <input type="file" id="file-upload" className="hidden" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-500 border border-zinc-200">
                      <UploadCloud size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 block">Select document</span>
                      <span className="text-xs text-zinc-500 mt-1 block">PDF, CSV (max 50MB)</span>
                    </div>
                    {file && (
                      <div className="inline-block mt-3 px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-xs text-zinc-700 font-mono">
                        {file.name}
                      </div>
                    )}
                  </label>
                </div>

                {isUploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Encrypting to Walrus...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-black h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button type="submit" disabled={!file || !reportTitle || !declaredBalance} className="w-full py-2.5 bg-black text-white font-medium text-sm rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-black flex items-center justify-center gap-2">
                    Commit to Network
                    <ChevronRight size={16} />
                  </button>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={18} />
                    Stored on Walrus
                  </div>
                  <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 font-mono text-xs text-zinc-700">
                    <span className="block text-zinc-500">Blob ID</span>
                    <span className="mt-1 block break-all text-zinc-950">{submittedProof?.blobId}</span>
                  </div>
                  <a href={`${WALRUS_URL}/blob/${submittedProof?.blobId}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900">
                    Retrieve <ExternalLink size={12} />
                  </a>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                    <CheckCircle2 size={18} />
                    Recorded on Sui
                  </div>
                  <div className="mt-3 rounded-md border border-sky-200 bg-white p-3 font-mono text-xs text-zinc-700">
                    <span className="block text-zinc-500">Object ID</span>
                    <span className="mt-1 block break-all text-zinc-950">{submittedProof?.objectId}</span>
                  </div>
                  <a href={`${SUIVISION_URL}/object/${submittedProof?.objectId}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-900">
                    View on SuiVision <ExternalLink size={12} />
                  </a>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="text-xs text-zinc-500">Attestation ID</div>
                  <div className="mt-1 font-mono text-xs text-zinc-900">{submittedId}</div>
                  <p className="mt-3 text-xs text-zinc-500">Status: Pending auditor co-signature.</p>
                </div>

                <button onClick={() => { setFile(null); setReportTitle(""); setDeclaredBalance(""); setSubmittedId(""); setSubmittedProof(null); setSuccess(false); setUploadProgress(0); }} className="w-full px-4 py-2 bg-white border border-zinc-300 text-zinc-900 text-xs font-medium rounded-md hover:bg-zinc-50 transition-colors">Submit Another</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <Clock size={16} className="text-zinc-400" />
              Recent Submissions
            </h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 space-y-3 hover:border-zinc-300 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-zinc-900 text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.institution}</p>
                    </div>
                    {item.status === "verified" ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">VERIFIED</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0">PENDING</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                    <span className="text-zinc-700 font-mono text-xs">{item.balance}</span>
                    <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUDITOR PANEL
   ══════════════════════════════════════════════════════════════ */
function AuditorPanel() {
  const pendingItems = SEED_HISTORY.filter((h) => h.status === "pending");
  const [selectedAudit, setSelectedAudit] = useState<TreasuryItem | null>(pendingItems[0] || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const startVerification = () => {
    setIsVerified(false);
    setIsApproved(false);
    setIsVerifying(true);
    setVerificationStep(1);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8 animate-fade-in-up">
      <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="text-zinc-400" size={24} />
            Auditor Desk
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">Review, verify cryptographic hashes, and co-sign attestations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <Activity size={16} className="text-zinc-400" />
              Queue
            </h3>
            {pendingItems.length > 0 ? (
              <div className="space-y-2">
                {pendingItems.map((audit) => (
                  <button
                    key={audit.id}
                    onClick={() => { setSelectedAudit(audit); setIsVerified(false); setIsApproved(false); setVerificationStep(0); }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${ selectedAudit?.id === audit.id ? "bg-zinc-50 border-zinc-300 shadow-sm" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300" }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-3">
                        <h4 className="font-medium text-sm truncate text-zinc-900">{audit.title}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{audit.institution}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-700">{audit.balance}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-300 rounded-lg text-xs font-medium bg-zinc-50">
                No items in queue.
              </div>
            )}
          </div>
        </div>

        {/* Verification */}
        <div className="lg:col-span-7">
          {selectedAudit ? (
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-6">
              <div className="border-b border-zinc-200 pb-5">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 mb-3">REVIEW MODE</span>
                <h3 className="text-xl font-medium text-zinc-900">{selectedAudit.title}</h3>
                <p className="text-xs text-zinc-500 mt-1.5 font-mono">Uploader: {selectedAudit.uploader} • Date: {selectedAudit.date}</p>
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 font-mono text-xs space-y-3 shadow-inner">
                <div>
                  <span className="text-zinc-500 block mb-1">Walrus Blob Hash</span>
                  <span className="text-zinc-800 block truncate">{selectedAudit.blobId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">Expected SHA-256</span>
                  <span className="text-zinc-800 block truncate">{selectedAudit.expectedHash}</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { step: 1, label: "Fetch from Walrus" },
                  { step: 2, label: "Compute SHA-256" },
                  { step: 3, label: "Verify with Sui" }
                ].map((s) => (
                  <div key={s.step} className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${verificationStep === s.step ? "border-zinc-900 bg-zinc-950 shadow-sm" : verificationStep > s.step || (s.step === 3 && isVerified) ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-white"}`}>
                    <div className={`flex items-center gap-3 text-sm transition-colors ${verificationStep === s.step ? "text-white" : verificationStep > s.step || (s.step === 3 && isVerified) ? "text-emerald-700" : "text-zinc-700"}`}>
                      {verificationStep > s.step || (s.step === 3 && isVerified) ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : verificationStep === s.step ? (
                        <CircleDashed size={16} className="text-white animate-spin" />
                      ) : (
                        <CircleDashed size={16} className="text-zinc-200" />
                      )}
                      <span>{s.label}</span>
                    </div>
                    {verificationStep === s.step && (
                      <span className="font-mono text-[10px] text-white/60">running</span>
                    )}
                    {(verificationStep > s.step || (s.step === 3 && isVerified)) && (
                      <span className="font-mono text-[10px] text-emerald-600">passed</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                {!isVerified ? (
                  <button onClick={startVerification} disabled={isVerifying} className="w-full py-2.5 bg-black text-white font-medium text-sm rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-black flex items-center justify-center gap-2">
                    {isVerifying ? "Verifying..." : "Run Integrity Check"}
                    {!isVerifying && <Shield size={16} />}
                  </button>
                ) : !isApproved ? (
                  <button onClick={() => setIsApproved(true)} className="w-full py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-md hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                    Approve & Co-Sign
                    <Check size={16} />
                  </button>
                ) : (
                  <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-center rounded-md font-medium text-sm shadow-sm">
                    Verified and Anchored
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 border border-zinc-200 text-center text-zinc-500 text-sm font-medium shadow-sm">
              Select an item from the queue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REGISTRY PANEL
   ══════════════════════════════════════════════════════════════ */
function RegistryPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [selectedRecord, setSelectedRecord] = useState<TreasuryItem | null>(null);

  const filteredLedger = SEED_HISTORY.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.institution.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && item.status === activeFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 animate-fade-in-up">
      <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Database className="text-zinc-400" size={24} />
            Verified Treasury Records
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">Read-only cryptographic log of all attestations.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
        <div className="flex gap-1">
          {(["all", "verified", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${ activeFilter === f ? "bg-zinc-100 text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 border border-transparent" }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={14} className="text-zinc-400 absolute left-3 top-2.5" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-zinc-300 rounded-md pl-9 pr-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors shadow-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 text-xs font-medium text-zinc-500 hidden md:grid bg-zinc-50">
          <div className="col-span-5">Statement</div>
          <div className="col-span-3">Proof</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-1 text-center"></div>
        </div>

        <div className="divide-y divide-zinc-200">
          {filteredLedger.map((item) => (
            <div key={item.id} className="hover:bg-zinc-50/50 transition-colors">
              <button onClick={() => setSelectedRecord(item)} className="grid w-full grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center text-left text-sm cursor-pointer select-none">
                <div className="col-span-5 min-w-0 pr-4">
                  <p className="font-medium text-zinc-900 truncate">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.institution}</p>
                </div>
                <div className="col-span-3 font-mono text-xs text-zinc-700">
                  <span className="block truncate">{item.blobId}</span>
                  <span className="mt-1 block truncate text-zinc-400">{item.objectId}</span>
                </div>
                <div className="col-span-3">
                  {item.status === "verified" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-200">VERIFIED</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-medium border border-zinc-200">PENDING</span>
                  )}
                </div>
                <div className="col-span-1 flex justify-center text-zinc-400">
                  <ChevronRight size={16} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <ProofDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}

function ProofDrawer({ record, onClose }: { record: TreasuryItem | null; onClose: () => void }) {
  const proofRows = record ? [
    ["Walrus Blob ID", record.blobId],
    ["SHA-256 Hash", record.expectedHash || "Pending digest"],
    ["Sui Object ID", record.objectId || "Pending object"],
    ["Transaction ID", record.txHash],
    ["Uploader address", record.uploader || record.cfoSigner || "0xCFO...4A2"],
    ["Auditor address", record.auditorSigner || "Awaiting auditor"],
    ["Created date", record.date],
    ["Verified date", record.verifiedDate || "Pending audit"],
  ] : [];

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${record ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />
      <aside className={`fixed right-0 top-16 z-50 h-[calc(100vh-64px)] w-full max-w-md border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ${record ? "translate-x-0" : "translate-x-full"}`}>
        {record && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b border-zinc-200 p-5">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">Proof Drawer</span>
                <h2 className="mt-2 text-lg font-medium tracking-tight text-zinc-950">{record.title}</h2>
                <p className="mt-1 text-xs text-zinc-500">{record.institution}</p>
              </div>
              <button onClick={onClose} className="rounded-md border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {proofRows.map(([label, value]) => (
                <div key={label} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
                  <div className="mt-1 break-all font-mono text-xs text-zinc-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 border-t border-zinc-200 p-5">
              <a href={`${SUIVISION_URL}/object/${record.objectId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800">
                View on SuiVision <ExternalLink size={13} />
              </a>
              <a href={`${WALRUS_URL}/blob/${record.blobId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
                Retrieve from Walrus <ExternalLink size={13} />
              </a>
              <a href={`/verify/${record.publicId || record.id}`} className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
                Public verification URL <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
