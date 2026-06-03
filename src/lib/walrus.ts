import { getProtocolConfig } from "./attestations";

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

function getBlobIdFromResponse(response: WalrusPublisherResponse) {
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
  const config = getProtocolConfig();
  const url = new URL("/v1/blobs", config.walrusPublisherUrl);
  url.searchParams.set("epochs", String(config.walrusEpochs));

  const response = await fetch(url.toString(), {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Walrus publisher returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as WalrusPublisherResponse;
  const blobId = getBlobIdFromResponse(payload);

  if (!blobId) {
    throw new Error("Walrus publisher did not return a blob ID.");
  }

  return {
    blobId,
    payload,
  };
}
