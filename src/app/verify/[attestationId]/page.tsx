import Link from "next/link";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";

type PublicAttestation = {
  objectId: string;
  version?: string;
  digest?: string;
  previousTransaction?: string;
  title: string;
  blobId: string;
  fileHash: string;
  uploader: string;
  auditor: string;
  status: "verified" | "pending";
  createdAt: string;
  verifiedAt: string;
  links: {
    suiObject: string;
    suiTransaction: string;
    walrusBlob: string;
  };
};

async function fetchAttestation(objectId: string) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/verify/${objectId}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;
  return await response.json() as PublicAttestation;
}

function shortenAddress(address: string) {
  if (!address) return "Awaiting auditor";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
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
            This public page expects a Sui Attestation object ID from TreasuryVault.
          </p>
        </section>
      </main>
    );
  }

  const proofRows = [
    ["Institution", "Coinbase Prime"],
    ["Walrus Blob ID", record.blobId],
    ["SHA-256 Hash", record.fileHash],
    ["Sui Object ID", record.objectId],
    ["Uploader address", record.uploader],
    ["Auditor signature", record.auditor || "Awaiting auditor"],
    ["Created date", record.createdAt],
    ["Verified date", record.verifiedAt || "Pending audit"],
    ["Sui transaction", record.previousTransaction || "Pending"],
  ];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-3 border-b border-zinc-200 pb-6">
          <CheckCircle2 className={record.status === "verified" ? "mt-1 text-emerald-500" : "mt-1 text-zinc-400"} size={28} />
          <div>
            <p className={`text-sm font-medium ${record.status === "verified" ? "text-emerald-600" : "text-zinc-600"}`}>
              Attestation {record.status === "verified" ? "Valid" : "Pending Audit"}
            </p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">{record.title}</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">{shortenAddress(record.objectId)}</p>
          </div>
        </div>

        <div className="grid gap-3 py-6 text-sm">
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
