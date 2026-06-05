# Sikyon — Verifiable Treasury Records

> Create immutable treasury attestations, verify approvals, 
> and maintain a permanent audit trail using Walrus and Sui.

Built for the Tatum x Build on Sui with Walrus Hackathon.

Live: https://sikyon.vercel.app
Public Verification: https://sikyon.vercel.app/verify/[attestationId]

---

## The Problem

Investors, auditors, and board members routinely approve 
treasury reports backed by documents stored in systems 
one person controls. A file in Google Drive can be replaced 
silently. The document you approved yesterday is not 
provably the same document that exists today.

## The Solution

Sikyon creates a verifiable chain of custody around 
treasury records:

- Document stored on Walrus — decentralized, permanent, 
  content-addressed
- Hash anchored on Sui — tamper-proof, timestamped, 
  permanently on-chain
- Auditor attestation signed on-chain — who approved, 
  when, cryptographically
- Public verification page — anyone can verify with 
  just the attestation ID

## Why Not Google Drive + Hash?

Sikyon doesn't just store documents. It creates a 
verifiable chain of custody through identity, storage, 
attestation, and independent verification. No single 
party controls any part of that chain.

## Live Stats

$89,800,000 in treasury reserves verified on Sui mainnet

## Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Frontend       | Next.js 14, TypeScript        |
| Smart Contract | Sui Move                      |
| Storage        | Walrus decentralized storage  |
| RPC            | Tatum enterprise Sui nodes    |
| Wallet         | @mysten/dapp-kit              |

## Deployed Contracts

Network:     Sui Mainnet
Package ID:  0xe8a24a144e84b9f353765b4475478e7de727e5ce64b95168ff5cb6eb6b65b1df
Registry:    0x8e0a27ba028a602d134953d9cb3d95377b493eb0f5107158fbf1a5c9ed503622

## Walrus Integration

Documents are stored as blobs via the Walrus publisher 
endpoint. The Blob ID is stored on Sui. The Auditor 
fetches directly from the Walrus aggregator endpoint 
and recomputes the SHA-256 hash independently to verify 
authenticity. The public verification page retrieves 
blob metadata without login.

Walrus Publisher: https://publisher.walrus-mainnet.walrus.space
Walrus Aggregator: https://aggregator.walrus-mainnet.walrus.space

## Tatum Integration

All Sui RPC calls route through Tatum enterprise nodes:
https://sui-mainnet.gateway.tatum.io

Tatum also powers Walrus blob storage via the 
Tatum Storage API — visible as "Walrus Provider: 
Tatum Storage API" in the proof drawer.

## How It Works

1. CFO connects wallet and uploads treasury PDF
2. Document stored on Walrus — Blob ID returned
3. SHA-256 hash computed client-side
4. Sui transaction records Blob ID + hash + metadata
5. Auditor connects wallet, fetches blob from Walrus
6. Auditor verifies SHA-256 matches on-chain record
7. Auditor signs approval — status updates to Verified
8. Anyone can verify at /verify/[attestationId]

## Setup

1. Clone the repo
2. npm install
3. Copy .env.local.example to .env.local and fill values
4. npm run dev

## Environment Variables

TATUM_API_KEY=
NEXT_PUBLIC_TATUM_API_KEY=
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0xe8a24a...
NEXT_PUBLIC_REGISTRY_ID=0x8e0a27...
WALRUS_PUBLISHER_URL=https://publisher.walrus-mainnet.walrus.space
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-mainnet.walrus.space

## License

MIT
