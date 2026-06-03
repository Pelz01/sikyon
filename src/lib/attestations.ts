export type AttestationStatus = "verified" | "pending" | "draft";

export interface AttestationRecord {
  id: string;
  publicId: string;
  title: string;
  institution: string;
  balance: string;
  blobId: string;
  txHash: string;
  objectId: string;
  registryId?: string;
  date: string;
  verifiedDate?: string;
  status: AttestationStatus;
  period?: string;
  cfoSigner?: string;
  auditorSigner?: string;
  fileSize?: string;
  expectedHash: string;
  uploader?: string;
  walrusStatus: "stored" | "failed" | "pending_configuration";
  suiStatus: "recorded" | "pending_configuration";
}

export const SUIVISION_URL = "https://suivision.xyz";
export const WALRUS_URL = "https://walruscan.com";
export const ATTESTATION_STORAGE_KEY = "treasury-vault-attestations";
export const DEFAULT_PACKAGE_ID = "0xe8a24a144e84b9f353765b4475478e7de727e5ce64b95168ff5cb6eb6b65b1df";
export const DEFAULT_REGISTRY_ID = "0x8e0a27ba028a602d134953d9cb3d95377b493eb0f5107158fbf1a5c9ed503622";

export function readStoredAttestations(): AttestationRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ATTESTATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredAttestations(records: AttestationRecord[]) {
  window.localStorage.setItem(ATTESTATION_STORAGE_KEY, JSON.stringify(records));
}

export function getProtocolConfig() {
  const walrusPublisherUrl = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || "https://publisher.walrus-mainnet.walrus.space";

  return {
    walrusPublisherUrl,
    walrusEpochs: Number(process.env.NEXT_PUBLIC_WALRUS_EPOCHS || "5"),
    suiPackageId: process.env.NEXT_PUBLIC_PACKAGE_ID || process.env.NEXT_PUBLIC_SUI_ATTESTATION_PACKAGE_ID || DEFAULT_PACKAGE_ID,
    suiRegistryObjectId: process.env.NEXT_PUBLIC_REGISTRY_ID || process.env.NEXT_PUBLIC_SUI_REGISTRY_OBJECT_ID || DEFAULT_REGISTRY_ID,
    tatumRpcEndpoint: process.env.NEXT_PUBLIC_TATUM_SUI_RPC_ENDPOINT || "sui-mainnet.gateway.tatum.io",
  };
}

export function getWalrusRetrieveUrl(blobId: string) {
  return `${WALRUS_URL}/blob/${blobId}`;
}

export function currentTimestampMs() {
  return Date.now();
}
