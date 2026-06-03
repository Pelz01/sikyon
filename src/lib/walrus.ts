type WalrusPublisherResponse = {
  newlyCreated?: {
    blobObject?: {
      blobId?: string;
      id?: string;
    };
  };
  alreadyCertified?: {
    blobId?: string;
  };
  blobId?: string;
  id?: string;
};

export function getBlobIdFromWalrusResponse(response: WalrusPublisherResponse) {
  return (
    response.newlyCreated?.blobObject?.blobId ||
    response.newlyCreated?.blobObject?.id ||
    response.alreadyCertified?.blobId ||
    response.blobId ||
    response.id ||
    ""
  );
}

export async function publishBlobToWalrus(file: File) {
  const response = await fetch("/api/upload-walrus", {
    method: "POST",
    body: file,
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-file-name": encodeURIComponent(file.name),
    },
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null) as { error?: string; detail?: string } | null;
    throw new Error(errorPayload?.detail || errorPayload?.error || `Walrus upload returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as {
    blobId?: string;
    jobId?: string;
    provider?: "tatum" | "publisher";
    status?: string;
    walrus?: WalrusPublisherResponse;
    tatum?: unknown;
  };
  const blobId = payload.blobId || (payload.walrus ? getBlobIdFromWalrusResponse(payload.walrus) : "");

  if (!blobId) {
    throw new Error("Walrus upload route did not return a blob ID.");
  }

  return {
    blobId,
    jobId: payload.jobId || "",
    provider: payload.provider || "publisher",
    status: payload.status || "",
    payload: payload.walrus || payload,
  };
}
