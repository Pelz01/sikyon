import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_WALRUS_AGGREGATOR_URL } from "@/lib/attestations";

export const runtime = "nodejs";
export const maxDuration = 60;

type TatumUploadStatus = {
  downloadUrlByQuiltId?: string;
  downloadUrlByQuiltPatchId?: string;
};

function isValidBlobId(value: string) {
  return /^[A-Za-z0-9_-]{20,200}$/.test(value);
}

function isValidJobId(value: string) {
  return /^[A-Za-z0-9_-]{8,100}$/.test(value);
}

function isSafeRetrievalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

async function getTatumRetrievalUrl(jobId: string) {
  const apiKey = process.env.TATUM_API_KEY;
  if (!apiKey) return "";

  const response = await fetch(`https://api.tatum.io/v4/data/storage/upload/${jobId}`, {
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) return "";
  const payload = await response.json() as TatumUploadStatus;
  return payload.downloadUrlByQuiltPatchId || payload.downloadUrlByQuiltId || "";
}

export async function GET(request: NextRequest) {
  const blobId = request.nextUrl.searchParams.get("blobId") || "";
  const provider = request.nextUrl.searchParams.get("provider") || "publisher";
  const jobId = request.nextUrl.searchParams.get("jobId") || "";

  if (!isValidBlobId(blobId)) {
    return NextResponse.json({ error: "Invalid Walrus blob ID." }, { status: 400 });
  }

  let retrievalUrl = "";

  if (provider === "tatum") {
    if (jobId && isValidJobId(jobId)) {
      retrievalUrl = await getTatumRetrievalUrl(jobId);
    }

    if (!retrievalUrl) {
      return NextResponse.json(
        { error: "Tatum file-level Walrus retrieval metadata is unavailable." },
        { status: 503 },
      );
    }
  }

  if (!retrievalUrl) {
    const aggregatorUrl = (process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || DEFAULT_WALRUS_AGGREGATOR_URL).replace(/\/$/, "");
    retrievalUrl = `${aggregatorUrl}/v1/blobs/${blobId}`;
  }

  if (!isSafeRetrievalUrl(retrievalUrl)) {
    return NextResponse.json({ error: "Walrus retrieval URL is invalid." }, { status: 502 });
  }

  const response = await fetch(retrievalUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Walrus retrieval returned HTTP ${response.status}.` },
      { status: response.status },
    );
  }

  const bytes = await response.arrayBuffer();

  return new NextResponse(bytes, {
    headers: {
      "cache-control": "private, no-store",
      "content-length": String(bytes.byteLength),
      "content-type": response.headers.get("content-type") || "application/octet-stream",
    },
  });
}
