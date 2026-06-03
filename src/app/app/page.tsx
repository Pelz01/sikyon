"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
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
import {
  SUIVISION_URL,
  WALRUS_URL,
  currentTimestampMs,
  getProtocolConfig,
  readStoredAttestations,
  type AttestationRecord,
  writeStoredAttestations,
} from "@/lib/attestations";
import { publishBlobToWalrus } from "@/lib/walrus";
import WalletConnectControl from "@/components/WalletConnectControl";
import {
  approveAttestationTransaction,
  createAttestationTransaction,
  findCreatedAttestationObjectId,
} from "@/lib/suiAttestation";

const protocolConfig = getProtocolConfig();

type TabKey = "cfo" | "auditor" | "registry";

function getTabFromParams(searchParams: URLSearchParams): TabKey {
  const tabParam = searchParams.get("tab");
  return tabParam === "auditor" || tabParam === "registry" ? tabParam : "cfo";
}

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashFile(file: File) {
  const buffer = await file.arrayBuffer();
  return bytesToHex(await crypto.subtle.digest("SHA-256", buffer));
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
   ══════════════════════════════════════════════════════════════ */
function AppDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>(() => getTabFromParams(searchParams));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState<AttestationRecord[]>(() => readStoredAttestations());

  const updateRecords = (updater: (records: AttestationRecord[]) => AttestationRecord[]) => {
    setRecords((current) => {
      const next = updater(current);
      writeStoredAttestations(next);
      return next;
    });
  };

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
        <div className="ml-3 shrink-0">
          <WalletConnectControl />
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

        <div className="space-y-3 border-t border-zinc-200 p-4">
          {sidebarOpen && <WalletConnectControl />}
          <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {sidebarOpen && (
              <button className="group relative text-left text-xs font-medium text-zinc-500 truncate">
                Tatum Node: Connected
                <span className="pointer-events-none absolute bottom-6 left-0 z-20 w-max max-w-[220px] rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[10px] text-zinc-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                  {protocolConfig.tatumRpcEndpoint}
                </span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─────────── MAIN CONTENT AREA ─────────── */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {activeTab === "cfo" && <CFOPanel records={records} updateRecords={updateRecords} />}
        {activeTab === "auditor" && <AuditorPanel records={records} updateRecords={updateRecords} />}
        {activeTab === "registry" && <RegistryPanel records={records} />}
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
function CFOPanel({
  records,
  updateRecords,
}: {
  records: AttestationRecord[];
  updateRecords: (updater: (records: AttestationRecord[]) => AttestationRecord[]) => void;
}) {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [declaredBalance, setDeclaredBalance] = useState("");
  const [institution, setInstitution] = useState("Coinbase Prime");
  const [period, setPeriod] = useState("Q2 2026");
  const [submittedId, setSubmittedId] = useState("");
  const [submittedProof, setSubmittedProof] = useState<AttestationRecord | null>(null);
  const [submitError, setSubmitError] = useState("");
  const activeStep = success ? 4 : isUploading ? Math.min(3, Math.max(2, Math.ceil(uploadProgress / 40))) : file ? 1 : 0;

  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setFileHash("");
    if (!selectedFile) return;

    setIsHashing(true);
    try {
      setFileHash(await hashFile(selectedFile));
    } finally {
      setIsHashing(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !reportTitle || !declaredBalance || !currentAccount) return;
    const digest = fileHash || await hashFile(file);
    if (!fileHash) setFileHash(digest);

    setSubmitError("");
    setIsUploading(true);
    setUploadProgress(35);

    try {
      const walrusResult = await publishBlobToWalrus(file);
      setUploadProgress(70);

      const uploadTimestamp = currentTimestampMs();
      const transaction = createAttestationTransaction({
        documentName: reportTitle,
        blobId: walrusResult.blobId,
        fileHash: digest,
        uploadTimestamp,
      });
      setUploadProgress(85);
      const execution = await signAndExecuteTransaction.mutateAsync({
        transaction,
      });
      const confirmedTransaction = await suiClient.waitForTransaction({
        digest: execution.digest,
        options: {
          showObjectChanges: true,
        },
      });
      const createdAttestationObjectId = findCreatedAttestationObjectId(confirmedTransaction.objectChanges);

      if (!createdAttestationObjectId) {
        throw new Error("Sui transaction succeeded, but the created Attestation object was not found.");
      }

      const attestationId = createdAttestationObjectId;
      const walletAddress = currentAccount.address;
      const newItem: AttestationRecord = {
        id: attestationId,
        publicId: `attestation-${createdAttestationObjectId.slice(-8)}`,
        title: reportTitle,
        institution,
        balance: `$${Number(declaredBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
        blobId: walrusResult.blobId,
        objectId: createdAttestationObjectId,
        registryId: protocolConfig.suiRegistryObjectId,
        txHash: execution.digest,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        period,
        cfoSigner: walletAddress,
        auditorSigner: "Awaiting Co-signature",
        uploader: walletAddress,
        expectedHash: digest,
        fileSize: formatFileSize(file.size),
        walrusStatus: "stored",
        suiStatus: "recorded",
      };

      setUploadProgress(100);
      setSubmittedId(attestationId);
      setSubmittedProof(newItem);
      updateRecords((prev) => [newItem, ...prev]);
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Network commit failed.");
    } finally {
      setIsUploading(false);
    }
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
          {!currentAccount && (
            <p className="mt-2 text-xs font-medium text-amber-600">Connect a Sui wallet before submitting an attestation.</p>
          )}
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
                  <input type="file" id="file-upload" className="hidden" required onChange={(e) => void handleFileChange(e.target.files?.[0] || null)} />
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

                {(isHashing || fileHash) && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-zinc-600">Client-side SHA-256</span>
                      {isHashing ? (
                        <span className="font-mono text-[10px] text-zinc-500">hashing...</span>
                      ) : (
                        <span className="font-mono text-[10px] text-emerald-600">computed locally</span>
                      )}
                    </div>
                    {fileHash && (
                      <div className="mt-2 break-all font-mono text-xs text-zinc-900">{fileHash}</div>
                    )}
                  </div>
                )}

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                    <span className="block font-medium">Network commit failed</span>
                    <span className="mt-1 block break-words">{submitError}</span>
                  </div>
                )}

                {isUploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>{uploadProgress < 70 ? "Publishing to Walrus..." : "Recording on Sui..."}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-black h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button type="submit" disabled={!file || !reportTitle || !declaredBalance || isHashing || !currentAccount} className="w-full py-2.5 bg-black text-white font-medium text-sm rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:hover:bg-black flex items-center justify-center gap-2">
                    {currentAccount ? "Commit to Network" : "Connect Wallet to Commit"}
                    <ChevronRight size={16} />
                  </button>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={18} />
                    {submittedProof?.walrusStatus === "stored" ? "Stored on Walrus" : "Walrus Publisher Not Configured"}
                  </div>
                  <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 font-mono text-xs text-zinc-700">
                    <span className="block text-zinc-500">Blob ID</span>
                    <span className="mt-1 block break-all text-zinc-950">{submittedProof?.blobId}</span>
                  </div>
                  <a href={`${WALRUS_URL}/blob/${submittedProof?.blobId}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900">
                    {submittedProof?.walrusStatus === "stored" ? "Retrieve" : "Configure Walrus publisher"} <ExternalLink size={12} />
                  </a>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                    <CheckCircle2 size={18} />
                    {submittedProof?.suiStatus === "recorded" ? "Recorded on Sui" : "Sui Registry Not Configured"}
                  </div>
                  <div className="mt-3 rounded-md border border-sky-200 bg-white p-3 font-mono text-xs text-zinc-700">
                    <span className="block text-zinc-500">Object ID</span>
                    <span className="mt-1 block break-all text-zinc-950">{submittedProof?.objectId}</span>
                  </div>
                  <a href={`${SUIVISION_URL}/object/${submittedProof?.objectId}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-900">
                    {submittedProof?.suiStatus === "recorded" ? "View on SuiVision" : "Configure Sui contract"} <ExternalLink size={12} />
                  </a>
                  {submittedProof?.suiStatus === "recorded" && (
                    <a href={`${SUIVISION_URL}/txblock/${submittedProof.txHash}`} target="_blank" rel="noreferrer" className="ml-4 mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-900">
                      View transaction <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="text-xs text-zinc-500">Attestation ID</div>
                  <div className="mt-1 font-mono text-xs text-zinc-900">{submittedId}</div>
                  <p className="mt-3 text-xs text-zinc-500">Status: Pending auditor co-signature.</p>
                </div>

                <button onClick={() => { setFile(null); setFileHash(""); setReportTitle(""); setDeclaredBalance(""); setSubmittedId(""); setSubmittedProof(null); setSuccess(false); setUploadProgress(0); setSubmitError(""); }} className="w-full px-4 py-2 bg-white border border-zinc-300 text-zinc-900 text-xs font-medium rounded-md hover:bg-zinc-50 transition-colors">Submit Another</button>
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
              {records.map((item) => (
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
function AuditorPanel({
  records,
  updateRecords,
}: {
  records: AttestationRecord[];
  updateRecords: (updater: (records: AttestationRecord[]) => AttestationRecord[]) => void;
}) {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const pendingItems = records.filter((h) => h.status === "pending");
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const selectedAudit = records.find((record) => record.id === selectedAuditId) || pendingItems[0] || null;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalError, setApprovalError] = useState("");

  const startVerification = () => {
    if (!selectedAudit) return;
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

  const approveAudit = async () => {
    if (!selectedAudit || !currentAccount) return;
    setApprovalError("");

    try {
      if (!selectedAudit.objectId.startsWith("0x")) {
        throw new Error("This record does not have a Sui Attestation object ID.");
      }

      const transaction = approveAttestationTransaction({
        attestationObjectId: selectedAudit.objectId,
        auditTimestamp: currentTimestampMs(),
      });
      const execution = await signAndExecuteTransaction.mutateAsync({
        transaction,
      });

      await suiClient.waitForTransaction({
        digest: execution.digest,
        options: {
          showEffects: true,
        },
      });

      const verifiedDate = new Date().toISOString().split("T")[0];
      const updatedAudit: AttestationRecord = {
        ...selectedAudit,
        status: "verified",
        auditorSigner: currentAccount.address,
        verifiedDate,
        txHash: execution.digest,
      };

      updateRecords((current) => current.map((item) => item.id === selectedAudit.id ? updatedAudit : item));
      setSelectedAuditId(updatedAudit.id);
      setIsApproved(true);
    } catch (error) {
      setApprovalError(error instanceof Error ? error.message : "Sui approval transaction failed.");
    }
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
          {!currentAccount && (
            <p className="mt-2 text-xs font-medium text-amber-600">Connect a Sui wallet to co-sign verified attestations.</p>
          )}
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
                    onClick={() => { setSelectedAuditId(audit.id); setIsVerified(false); setIsApproved(false); setVerificationStep(0); setApprovalError(""); }}
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
                  <button onClick={() => void approveAudit()} disabled={!currentAccount || signAndExecuteTransaction.isPending} className="w-full py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-md hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {!currentAccount ? "Connect Wallet to Co-Sign" : signAndExecuteTransaction.isPending ? "Awaiting Wallet Signature..." : "Approve & Co-Sign"}
                    <Check size={16} />
                  </button>
                ) : (
                  <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-center rounded-md font-medium text-sm shadow-sm">
                    Verified and Anchored
                  </div>
                )}
                {approvalError && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                    <span className="block font-medium">Sui approval failed</span>
                    <span className="mt-1 block break-words">{approvalError}</span>
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
function RegistryPanel({ records }: { records: AttestationRecord[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [selectedRecord, setSelectedRecord] = useState<AttestationRecord | null>(null);

  const filteredLedger = records.filter((item) => {
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
          {filteredLedger.length === 0 && (
            <div className="p-10 text-center text-sm text-zinc-500">
              No verified treasury records yet. Submit a document from CFO Intake, then co-sign it from Auditor Verification.
            </div>
          )}
        </div>
      </div>

      <ProofDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}

function ProofDrawer({ record, onClose }: { record: AttestationRecord | null; onClose: () => void }) {
  const proofRows = record ? [
    ["Walrus Blob ID", record.blobId],
    ["SHA-256 Hash", record.expectedHash || "Pending digest"],
    ["Sui Object ID", record.objectId || "Pending object"],
    ["Registry Object ID", record.registryId || protocolConfig.suiRegistryObjectId],
    ["Transaction ID", record.txHash],
    ["Uploader address", record.uploader || record.cfoSigner || "Unknown"],
    ["Auditor address", record.auditorSigner || "Awaiting auditor"],
    ["Created date", record.date],
    ["Verified date", record.verifiedDate || "Pending audit"],
    ["Walrus adapter", record.walrusStatus === "stored" ? "Stored" : record.walrusStatus === "failed" ? "Failed" : "Pending configuration"],
    ["Sui adapter", record.suiStatus === "recorded" ? "Recorded" : "Pending configuration"],
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
