import { Transaction } from "@mysten/sui/transactions";
import { getProtocolConfig } from "./attestations";

export function createAttestationTransaction({
  documentName,
  blobId,
  fileHash,
  uploadTimestamp,
}: {
  documentName: string;
  blobId: string;
  fileHash: string;
  uploadTimestamp: number;
}) {
  const config = getProtocolConfig();

  if (!config.suiPackageId || !config.suiRegistryObjectId) {
    throw new Error("Missing NEXT_PUBLIC_PACKAGE_ID or NEXT_PUBLIC_REGISTRY_ID.");
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${config.suiPackageId}::attestation::create_attestation`,
    arguments: [
      tx.object(config.suiRegistryObjectId),
      tx.pure.string(documentName),
      tx.pure.string(blobId),
      tx.pure.string(fileHash),
      tx.pure.u64(uploadTimestamp),
    ],
  });

  return tx;
}

export function approveAttestationTransaction({
  attestationObjectId,
  auditTimestamp,
}: {
  attestationObjectId: string;
  auditTimestamp: number;
}) {
  const config = getProtocolConfig();

  if (!config.suiPackageId) {
    throw new Error("Missing NEXT_PUBLIC_PACKAGE_ID.");
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${config.suiPackageId}::attestation::approve_attestation`,
    arguments: [
      tx.object(attestationObjectId),
      tx.pure.u64(auditTimestamp),
    ],
  });

  return tx;
}

type SuiObjectChange = {
  type?: string;
  objectType?: string;
  objectId?: string;
};

export function findCreatedAttestationObjectId(objectChanges: unknown) {
  if (!Array.isArray(objectChanges)) return "";

  const config = getProtocolConfig();
  const attestationType = `${config.suiPackageId}::attestation::Attestation`;

  const createdAttestation = objectChanges.find((change: SuiObjectChange) => (
    change.type === "created" &&
    change.objectType === attestationType &&
    typeof change.objectId === "string"
  )) as SuiObjectChange | undefined;

  return createdAttestation?.objectId || "";
}
