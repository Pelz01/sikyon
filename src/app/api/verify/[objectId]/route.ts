import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PACKAGE_ID, SUIVISION_URL, WALRUS_URL } from "@/lib/attestations";

export const runtime = "nodejs";

type SuiMoveObjectFields = {
  audit_timestamp?: string;
  auditor?: string;
  blob_id?: string;
  document_name?: string;
  file_hash?: string;
  id?: { id?: string };
  status?: number | string;
  upload_timestamp?: string;
  uploader?: string;
};

type SuiObjectRpcResponse = {
  result?: {
    data?: {
      objectId?: string;
      version?: string;
      digest?: string;
      owner?: unknown;
      previousTransaction?: string;
      content?: {
        type?: string;
        fields?: SuiMoveObjectFields;
      };
    };
  };
  error?: {
    message?: string;
  };
};

function getTatumRpcUrl() {
  return process.env.TATUM_SUI_RPC_URL || "https://sui-mainnet.gateway.tatum.io";
}

function isObjectId(value: string) {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function formatTimestamp(value?: string) {
  if (!value) return "";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return new Date(numeric).toISOString();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ objectId: string }> },
) {
  const { objectId } = await params;

  if (!isObjectId(objectId)) {
    return NextResponse.json({ error: "Verification URL must use a Sui object ID." }, { status: 400 });
  }

  const response = await fetch(getTatumRpcUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.TATUM_API_KEY ? { "x-api-key": process.env.TATUM_API_KEY } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sui_getObject",
      params: [
        objectId,
        {
          showContent: true,
          showOwner: true,
          showPreviousTransaction: true,
        },
      ],
    }),
  });

  const payload = await response.json() as SuiObjectRpcResponse;

  if (!response.ok || payload.error || !payload.result?.data) {
    return NextResponse.json(
      {
        error: payload.error?.message || `Tatum Sui RPC returned HTTP ${response.status}`,
      },
      { status: response.ok ? 404 : response.status },
    );
  }

  const data = payload.result.data;
  const fields = data.content?.fields;
  const expectedType = `${process.env.NEXT_PUBLIC_PACKAGE_ID || DEFAULT_PACKAGE_ID}::attestation::Attestation`;

  if (!fields || data.content?.type !== expectedType) {
    return NextResponse.json(
      {
        error: "Object is not a TreasuryVault attestation.",
        objectType: data.content?.type,
      },
      { status: 404 },
    );
  }

  const isVerified = String(fields.status) === "1";

  return NextResponse.json({
    objectId: data.objectId || objectId,
    version: data.version,
    digest: data.digest,
    objectType: data.content?.type,
    previousTransaction: data.previousTransaction,
    title: fields.document_name || "Treasury attestation",
    blobId: fields.blob_id || "",
    fileHash: fields.file_hash || "",
    uploader: fields.uploader || "",
    auditor: fields.auditor || "",
    status: isVerified ? "verified" : "pending",
    statusCode: fields.status,
    createdAt: formatTimestamp(fields.upload_timestamp),
    verifiedAt: formatTimestamp(fields.audit_timestamp),
    links: {
      suiObject: `${SUIVISION_URL}/object/${data.objectId || objectId}`,
      suiTransaction: data.previousTransaction ? `${SUIVISION_URL}/txblock/${data.previousTransaction}` : "",
      walrusBlob: fields.blob_id ? `${WALRUS_URL}/blob/${fields.blob_id}` : "",
    },
  });
}
