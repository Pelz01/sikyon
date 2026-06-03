module treasury_vault::attestation {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;
    use std::option::{Self, Option};
    use std::vector;

    /// The Attestation object owned by the CFO
    public struct Attestation has key, store {
        id: UID,
        document_name: String,
        blob_id: String,
        file_hash: String,
        uploader: address,
        upload_timestamp: u64,
        status: u8, // 0 = Pending, 1 = Audited
        auditor: Option<address>,
        audit_timestamp: Option<u64>,
    }

    /// Shared object to keep track of all attestations
    public struct AttestationRegistry has key {
        id: UID,
        attestations: vector<ID>,
    }

    /// Errors
    const ENotPending: u64 = 0;

    /// Initialize the shared registry
    fun init(ctx: &mut TxContext) {
        let registry = AttestationRegistry {
            id: object::new(ctx),
            attestations: vector::empty(),
        };
        transfer::share_object(registry);
    }

    /// Create a new Attestation
    public entry fun create_attestation(
        registry: &mut AttestationRegistry,
        document_name: String,
        blob_id: String,
        file_hash: String,
        upload_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let attestation = Attestation {
            id: object::new(ctx),
            document_name,
            blob_id,
            file_hash,
            uploader: tx_context::sender(ctx),
            upload_timestamp,
            status: 0,
            auditor: option::none(),
            audit_timestamp: option::none(),
        };
        
        // Add to registry
        let attestation_id = object::id(&attestation);
        vector::push_back(&mut registry.attestations, attestation_id);
        
        // Share so auditors can approve from a separate wallet.
        transfer::share_object(attestation);
    }

    /// Approve an Attestation (Auditor only)
    public entry fun approve_attestation(
        attestation: &mut Attestation,
        audit_timestamp: u64,
        ctx: &mut TxContext
    ) {
        assert!(attestation.status == 0, ENotPending);
        
        let sender = tx_context::sender(ctx);
        attestation.status = 1;
        attestation.auditor = option::some(sender);
        attestation.audit_timestamp = option::some(audit_timestamp);
    }
}
