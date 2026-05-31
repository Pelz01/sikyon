## TreasuryVault — Mechanism, Flow & Framing

---

### The Mechanism

TreasuryVault is a three-layer trust system.

Each layer does one job and one job only.

Layer 1 — Walrus (Storage)
The actual document lives here. When a CFO uploads a PDF, Walrus stores the raw bytes as a blob and returns a unique Blob ID. Nobody can alter what's stored. Nobody controls the storage. The document just *exists*, permanently and verifiably.

Layer 2 — Sui (Proof)
The smart contract doesn't store the document. It stores *proof of the document* — the Blob ID, the SHA-256 hash, who uploaded it, when, and what its current attestation status is. This is the trust anchor. Even if Walrus were queried independently, the hash on Sui proves the file hasn't been tampered with.

Layer 3 — Tatum (Infrastructure)
Every interaction with Sui — submitting transactions, reading attestation records, querying wallet permissions — routes through Tatum's enterprise-grade RPC nodes. This is what makes it production-credible rather than hobbyist.

The three layers together answer a question no single layer can answer alone:

> *"Can I trust this treasury document without trusting the person who gave it to me?"*

---

### The Flow

Four steps. Three actors. One question answered.

---

Step 1 — CFO Uploads

CFO connects their Sui wallet to the dashboard.

Selects Q2-Treasury-Attestation.pdf.

Two things happen simultaneously:
- The PDF is pushed to Walrus via the publisher endpoint. Walrus returns a Blob ID.
- The app computes a SHA-256 hash of the file client-side.

CFO clicks Create Attestation.

A Sui transaction is signed by the CFO's wallet and submitted via Tatum RPC. The Move contract creates an Attestation object on-chain containing:
document_name:     "Q2 Treasury Attestation Report"
blob_id:           "0xabc123..."
file_hash:         "sha256:e3b0c4..."
uploader:          0xCFO_ADDRESS
upload_timestamp:  1748649600
status:            0 (Pending)

The document now exists. The proof now exists. Neither can be altered.

---

Step 2 — Attestation Record Created

The Attestation object is owned by the CFO's address but readable by anyone.

The AttestationRegistry — a shared Sui object — adds this attestation's ID to its list.

Any wallet that queries the registry can now see this document exists and is pending audit. No login required. No API key required. No permission required. It's on-chain.

---

Step 3 — Auditor Reviews

Auditor connects their Sui wallet to the auditor dashboard.

They see all attestations with status: Pending.

They click Download from Walrus — the app fetches the blob directly from the Walrus aggregator endpoint using the Blob ID stored on-chain.

They click Verify Hash — the app recomputes the SHA-256 of the downloaded file and compares it to the hash recorded in the Sui contract. If they match, green checkmark. If they don't, red warning. Tamper detection, automatic and cryptographic.

Auditor reviews the document. Satisfied. Clicks Approve Attestation.

Sui transaction signed. Contract updates:
status:             1 (Audited)
auditor:            0xAUDITOR_ADDRESS
audit_timestamp:    1748736000

The auditor's approval is now permanently on-chain. It cannot be removed. It cannot be backdated.

---

Step 4 — Board Member Verifies

Board member connects their wallet to the board dashboard.

They see the full attestation registry — every document, every status, every actor.

For the Q2 report they see:
Document:      Q2 Treasury Attestation Report
Uploaded by:   0xCFO_ADDRESS
Upload date:   July 1, 2025
Audited by:    0xAUDITOR_ADDRESS  
Audit date:    July 2, 2025
Blob ID:       0xabc123...
Status:        Audited ✓

They don't need to trust the CFO's email.
They don't need to call the auditor.
They don't need to open a shared Google Drive folder.

They verify directly. The chain is the source of truth.

---

### The Framing

One line:
*Verifiable treasury attestations on Sui and Walrus — because trust shouldn't depend on who sends the email.*

---

The problem in one sentence:
Investors, auditors, and board members routinely approve treasury reports backed by documents stored in systems one person controls.

Why that's dangerous:
A file in Google Drive can be replaced silently. An email attachment can be swapped. A PDF on AWS has no cryptographic history. The document you approved yesterday is not provably the same document that exists today.

Why blockchain is the obvious answer here — not the forced one:
This is a multi-party verification problem. Three different actors — CFO, Auditor, Board — need to agree on the same document without trusting each other or a central administrator. That is precisely the problem distributed ledgers exist to solve. Blockchain isn't being used here because it's trendy. It's being used because it's the only architecture where no single party controls the record.

Why Walrus specifically:
Sui's on-chain storage is not built for large blobs. Walrus is. It stores the actual document in a decentralised, cost-efficient way and returns a content-addressed Blob ID. That Blob ID is what gets anchored to Sui. Walrus and Sui are complementary by design — this isn't a forced integration, it's the intended architecture.

Why Tatum specifically:
Enterprise treasury tooling cannot depend on public RPC nodes with no SLA. Tatum provides the reliability layer — the same reason a real finance team uses Bloomberg terminals instead of free data feeds.

---

The "Why Not AWS" Answer — fully formed:

> AWS stores files. TreasuryVault stores something different.
>
> It stores the file on Walrus — decentralized, permanent, content-addressed.
> It stores proof of the file on Sui — hash, timestamp, uploader identity.
> It stores auditor attestation on-chain — who approved, when, cryptographically signed.
> It stores a verifiable history of every state change — from upload to audit to board review.
>
> The value is not storage.
> The value is that three parties who don't fully trust each other can independently verify the same record — and none of them can alter what the others saw.
