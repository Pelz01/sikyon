import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";

const records = [
  {
    title: "Q1 Treasury Reserve Audit",
    institution: "Fidelity Digital Assets",
    verifiedBy: "0xAUD...9F1",
    blobId: "wal_0x8f7c9e0d1a2938afbc9e",
    objectId: "0x9d1b7f4a8c2e6b019af5c31d8e72a449",
    sha256: "91b7f8c0d4c1e2a53f6a7d1b0c9e8f37452aa7016cfbd8e9f0a142b3c4d5e6f71",
  },
  {
    title: "April Cash Equivalent Yield Report",
    institution: "Anchorage Digital",
    verifiedBy: "0xAUD...9F1",
    blobId: "wal_0x2c4e9f8a6b4d3e5f2a1b",
    objectId: "0x3a81e9f2c57b660e6d018f4a9cb73d21",
    sha256: "c2e4f6a8190b73dd45f9a2c18e7b61f0d3a55c9e48217a0bb6f33d2e1c984af5",
  },
  {
    title: "Q2 Corporate Cash Reserve Statement",
    institution: "Coinbase Prime",
    verifiedBy: "0xAUD...4A2",
    blobId: "wal_0x0df2c9ba9c289f81a7d3",
    objectId: "0x7f2d916a4b8e0c39a5d1f442be93c670",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
];

export function generateStaticParams() {
  return records.map((record) => ({ blobId: record.blobId }));
}

export default async function VerifyPage({ params }: { params: Promise<{ blobId: string }> }) {
  const { blobId } = await params;
  const record = records.find((item) => item.blobId === blobId);

  if (!record) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-20 pt-28 text-zinc-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-6">
          <CheckCircle2 className="text-emerald-500" size={28} />
          <div>
            <p className="text-sm font-medium text-emerald-600">Attestation Valid</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-zinc-950">{record.title}</h1>
          </div>
        </div>

        <div className="grid gap-3 py-6 text-sm">
          <div className="flex justify-between gap-4 border-b border-zinc-100 py-3">
            <span className="text-zinc-500">Institution</span>
            <span className="font-medium text-zinc-900">{record.institution}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-zinc-100 py-3">
            <span className="text-zinc-500">Verified by</span>
            <span className="font-mono text-xs text-zinc-900">{record.verifiedBy}</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            ["Walrus Blob ID", record.blobId],
            ["Sui Object ID", record.objectId],
            ["SHA-256", record.sha256],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
              <div className="mt-2 break-all font-mono text-xs text-zinc-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a href={`https://walruscan.com/blob/${record.blobId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800">
            Retrieve from Walrus <ExternalLink size={13} />
          </a>
          <a href={`https://suivision.xyz/object/${record.objectId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50">
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
