"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import {
  SUIVISION_URL,
  WALRUS_URL,
  readStoredAttestations,
  type AttestationRecord,
} from "@/lib/attestations";
import { useState } from "react";

export default function VerifyPage() {
  const params = useParams<{ attestationId: string }>();
  const [records] = useState<AttestationRecord[]>(() => readStoredAttestations());
  const record = records.find((item) => item.publicId === params.attestationId) || null;

  if (!record) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="text-zinc-400" size={28} />
            <div>
              <p className="text-sm font-medium text-zinc-600">Verification Record Not Found</p>
              <h1 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">/{params.attestationId}</h1>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            This browser does not have a submitted attestation with that public ID. Submit and co-sign a record first, then open its public verification URL.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-6">
          <CheckCircle2 className={record.status === "verified" ? "text-emerald-500" : "text-zinc-400"} size={28} />
          <div>
            <p className={`text-sm font-medium ${record.status === "verified" ? "text-emerald-600" : "text-zinc-600"}`}>Verification Status: {record.status}</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">{record.title}</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">/{record.publicId}</p>
          </div>
        </div>

        <div className="grid gap-3 py-6 text-sm">
          {[
            ["Institution", record.institution],
            ["Blob ID", record.blobId],
            ["Hash", record.expectedHash],
            ["Auditor signature", record.auditorSigner || "Awaiting auditor"],
            ["Verification status", record.status],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
              <div className="mt-2 break-all font-mono text-xs text-zinc-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={`${WALRUS_URL}/blob/${record.blobId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800">
            Retrieve from Walrus <ExternalLink size={13} />
          </a>
          <a href={`${SUIVISION_URL}/object/${record.objectId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
            View on SuiVision <ExternalLink size={13} />
          </a>
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
