import Link from "next/link";
import { CheckCircle2, Clock3, ExternalLink, XCircle } from "lucide-react";

type PublicAttestation = {
  objectId: string;
  version?: string;
  digest?: string;
  previousTransaction?: string;
  title: string;
  institution: string;
  fiscalPeriod: string;
  blobId: string;
  fileHash: string;
  uploader: string;
  auditor: string;
  status: "verified" | "pending" | "rejected";
  createdAt: string;
  verifiedAt: string;
  links: {
    suiObject: string;
    suiTransaction: string;
    walrusBlob: string;
  };
};

async function fetchAttestation(objectId: string) {
  const baseUrl = (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
    || process.env.NEXT_PUBLIC_APP_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
    || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/verify/${objectId}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;
  return await response.json() as PublicAttestation;
}

function shortenAddress(address: string) {
  if (!address) return "Awaiting auditor";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ attestationId: string }>;
}) {
  const { attestationId } = await params;
  const record = await fetchAttestation(attestationId);

  if (!record) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="text-zinc-400" size={28} />
            <div>
              <p className="text-sm font-medium text-zinc-600">Verification Record Not Found</p>
              <h1 className="mt-1 break-all text-2xl font-medium tracking-tight text-zinc-950">/{attestationId}</h1>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            This public page expects a Sui Attestation object ID from Sikyon.
          </p>
        </section>
      </main>
    );
  }

  const proofRows = [
    ["Organization", record.institution],
    ["Reporting Period", record.fiscalPeriod],
    ["Walrus Blob ID", record.blobId],
    ["Sui Object ID", record.objectId],
    ["Submitted By", shortenAddress(record.uploader)],
    ["Auditor", shortenAddress(record.auditor)],
    ["Created date", record.createdAt],
    ["Verified date", record.verifiedAt || "Pending audit"],
    ["Sui transaction", record.previousTransaction || "Pending"],
  ];
  const statusStyles = {
    verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
  } as const;
  const statusLabel = record.status.charAt(0).toUpperCase() + record.status.slice(1);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-3 border-b border-zinc-200 pb-6">
          {record.status === "verified" ? (
            <CheckCircle2 className="mt-1 text-emerald-500" size={28} />
          ) : record.status === "rejected" ? (
            <XCircle className="mt-1 text-red-500" size={28} />
          ) : (
            <Clock3 className="mt-1 text-amber-500" size={28} />
          )}
          <div>
            <span className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${statusStyles[record.status]}`}>
              Verification Status: {statusLabel}
            </span>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">{record.title}</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">{shortenAddress(record.objectId)}</p>
          </div>
        </div>

        <div className="grid gap-3 py-6 text-sm">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">SHA-256 Hash</div>
            <div className="mt-2 break-all font-mono text-xs text-zinc-950">{record.fileHash}</div>
            <p className="mt-3 text-xs leading-relaxed text-black/45">
              This hash was computed from the original document before upload and permanently recorded on Sui mainnet. When you download this document from Walrus, the same hash is recomputed from the downloaded bytes. A matching hash proves the document has not been altered in any way since it was attested.
            </p>
          </div>
          {proofRows.map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
              <div className="mt-2 break-all font-mono text-xs text-zinc-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={record.links.walrusBlob} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800">
            Retrieve from Walrus <ExternalLink size={13} />
          </a>
          <a href={record.links.suiObject} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
            View on SuiVision <ExternalLink size={13} />
          </a>
          {record.links.suiTransaction && (
            <a href={record.links.suiTransaction} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
              View transaction <ExternalLink size={13} />
            </a>
          )}
        </div>
      </section>

      <div className="mx-auto mt-6 max-w-3xl text-center">
        <Link href="/app?tab=registry" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
          Back to verified treasury records
        </Link>
      </div>
    </main>
  );
}
