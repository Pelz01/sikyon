import { NextRequest, NextResponse } from "next/server";
import { getBlobIdFromWalrusResponse } from "@/lib/walrus";

export const runtime = "nodejs";
export const maxDuration = 60;

function getWalrusPublisherUrl() {
  return (process.env.WALRUS_PUBLISHER_URL || "").replace(/\/$/, "");
}

type TatumUploadPayload = {
  blobId?: string;
  jobId?: string;
  id?: string;
  status?: string;
  errorMessage?: string;
  downloadUrlByQuiltId?: string;
  downloadUrlByQuiltPatchId?: string;
};

async function readJsonResponse(response: Response) {
  const responseText = await response.text();

  try {
    return {
      text: responseText,
      json: responseText ? JSON.parse(responseText) as unknown : null,
    };
  } catch {
    return {
      text: responseText,
      json: null,
    };
  }
}

function getTatumJobId(payload: TatumUploadPayload) {
  return payload.jobId || payload.id || "";
}

async function uploadWithTatum({
  body,
  contentType,
  fileName,
}: {
  body: ArrayBuffer;
  contentType: string;
  fileName: string;
}) {
  const apiKey = process.env.TATUM_API_KEY;

  if (!apiKey) return null;

  const formData = new FormData();
  formData.append("file", new Blob([body], { type: contentType }), fileName);

  const uploadResponse = await fetch("https://api.tatum.io/v4/data/storage/upload", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
    },
    body: formData,
  });

  const uploadPayload = await readJsonResponse(uploadResponse);

  if (!uploadResponse.ok) {
    return NextResponse.json(
      {
        error: `Tatum Walrus upload returned HTTP ${uploadResponse.status}`,
        detail: uploadPayload.text || uploadResponse.statusText,
        provider: "tatum",
      },
      { status: uploadResponse.status },
    );
  }

  const initial = (uploadPayload.json || {}) as TatumUploadPayload;
  const jobId = getTatumJobId(initial);
  let statusPayload = initial;

  if (jobId) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const statusResponse = await fetch(`https://api.tatum.io/v4/data/storage/upload/${jobId}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      const statusResult = await readJsonResponse(statusResponse);

      if (statusResponse.ok && statusResult.json) {
        statusPayload = statusResult.json as TatumUploadPayload;
      }

      if (statusPayload.status === "CERTIFIED" || statusPayload.status === "FAILED") break;
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }

  const blobId = statusPayload.blobId || initial.blobId;

  if (!blobId) {
    return NextResponse.json(
      {
        error: "Tatum Walrus upload did not return a blob ID.",
        tatum: statusPayload,
        provider: "tatum",
      },
      { status: 502 },
    );
  }

  if (statusPayload.status === "FAILED") {
    return NextResponse.json(
      {
        error: "Tatum Walrus upload failed.",
        detail: statusPayload.errorMessage || "The upload job failed during certification.",
        blobId,
        jobId,
        tatum: statusPayload,
        provider: "tatum",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    blobId,
    jobId,
    provider: "tatum",
    status: statusPayload.status || initial.status || "PENDING",
    downloadUrlByQuiltId: statusPayload.downloadUrlByQuiltId,
    downloadUrlByQuiltPatchId: statusPayload.downloadUrlByQuiltPatchId,
    tatum: statusPayload,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.arrayBuffer();

  if (!body.byteLength) {
    return NextResponse.json({ error: "No file body received." }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") || "application/octet-stream";
  const fileName = decodeURIComponent(request.headers.get("x-file-name") || "treasury-attestation.bin");
  const tatumResponse = await uploadWithTatum({ body, contentType, fileName });

  if (tatumResponse) {
    return tatumResponse;
  }

  if (!getWalrusPublisherUrl()) {
    return NextResponse.json(
      {
        error: "Missing TATUM_API_KEY.",
        detail: "Mainnet Walrus has no open public publisher. Add TATUM_API_KEY to use Tatum Walrus Storage, or set WALRUS_PUBLISHER_URL to a custom authenticated publisher.",
        provider: "tatum",
      },
      { status: 500 },
    );
  }

  const epochs = process.env.WALRUS_EPOCHS || process.env.NEXT_PUBLIC_WALRUS_EPOCHS || "5";
  const publisherUrl = new URL("/v1/blobs", getWalrusPublisherUrl());
  publisherUrl.searchParams.set("epochs", epochs);

  try {
    const walrusResponse = await fetch(publisherUrl.toString(), {
      method: "PUT",
      body,
      headers: {
        "content-type": contentType,
      },
    });

    const walrusResult = await readJsonResponse(walrusResponse);
    const walrusPayload = walrusResult.json || { raw: walrusResult.text };

    if (!walrusResponse.ok) {
      return NextResponse.json(
        {
          error: `Walrus publisher returned HTTP ${walrusResponse.status}`,
          detail: walrusResult.text || walrusResponse.statusText,
          publisherUrl: publisherUrl.origin,
          provider: "publisher",
        },
        { status: walrusResponse.status },
      );
    }

    const blobId = getBlobIdFromWalrusResponse(walrusPayload || {});

    if (!blobId) {
      return NextResponse.json(
        {
          error: "Walrus publisher did not return a blob ID.",
          walrus: walrusPayload,
          provider: "publisher",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      blobId,
      provider: "publisher",
      walrus: walrusPayload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to reach Walrus publisher from the server.",
        detail: error instanceof Error ? error.message : "Unknown network error",
        publisherUrl: publisherUrl.origin,
        provider: "publisher",
      },
      { status: 502 },
    );
  }
}
