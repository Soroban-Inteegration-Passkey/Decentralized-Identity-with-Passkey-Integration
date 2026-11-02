# Data Encryption & Boundary Model

This document outlines the cryptographic boundaries, storage locations, and data access policies across the **Decentralized Identity with Passkey Integration** platform. It provides a formal audit review of what each architectural tier can and cannot read.

---

## Tier-by-Tier Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / USER DEVICE                            │
│  ┌───────────────────────┐                 ┌────────────────────────┐  │
│  │   Hardware Passkey    │                 │   React 18 Frontend    │  │
│  │ (Secure Enclave/TPM)  │<--- WebAuthn ---│   (Web Crypto API)     │  │
│  │  • Secp256r1 PrivKey  │                 │   • Client AES-256-GCM │  │
│  │  • Biometric Auth     │                 │   • PBKDF2 Vault Export│  │
│  └───────────────────────┘                 └───────────┬────────────┘  │
└────────────────────────────────────────────────────────┼───────────────┘
                                                         │ HTTPS / TLS 1.3
┌────────────────────────────────────────────────────────▼───────────────┐
│                           BACKEND GATEWAY                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Express + TypeScript API Server                                  │  │
│  │ • Passkey Challenge Replay Protection (5-min strict TTL)         │  │
│  │ • W3C DID Document Resolver (did:passkey:...)                    │  │
│  │ • Selective Disclosure Merkle Commitment Verifier                │  │
│  │ • Stellar Friendbot Auto-Funding Proxy                           │  │
│  └──────────────────┬───────────────────────────┬───────────────────┘  │
│                     │                           │                      │
│             MongoDB Document Store       Stellar Horizon / RPC         │
└─────────────────────┼───────────────────────────┼──────────────────────┘
                      │                           │
┌─────────────────────▼───────────────────────────▼──────────────────────┐
│                    STELLAR SOROBAN SMART CONTRACTS                     │
│  ┌─────────────────────────────────┐   ┌────────────────────────────┐  │
│  │     IdentityRegistry (WASM)     │   │ SelectiveDisclosure (WASM) │  │
│  │ • Register DID & Attributes Hash│   │ • Create Disclosure Query  │  │
│  │ • Third-Party Verifications     │   │ • Submit Merkle Proof Root │  │
│  │ • Admin Pause Circuit Breakers  │   │ • Query Active Responses   │  │
│  └─────────────────────────────────┘   └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Data Access Audit Matrix: What Each Entity Can and Cannot Read

| Data Element | Client Device | Backend API Gateway | Database (MongoDB) | Stellar Blockchain (Soroban) |
| :--- | :--- | :--- | :--- | :--- |
| **Passkey Private Key** | :white_check_mark: Hardware Enclave Only | :x: Cannot Read | :x: Cannot Read | :x: Cannot Read |
| **Raw Biometrics (Face/Fingerprint)** | :white_check_mark: Device Sensor Only | :x: Cannot Read | :x: Cannot Read | :x: Cannot Read |
| **Passkey Public Key (Secp256r1)** | :white_check_mark: | :white_check_mark: Reads for Auth | :white_check_mark: Stored for Auth | :white_check_mark: Emitted / Registered |
| **Client Vault Backup Passphrase** | :white_check_mark: Memory only | :x: Cannot Read | :x: Cannot Read | :x: Cannot Read |
| **Exported Vault Backup File** | :white_check_mark: Encrypted with PBKDF2 | :x: Never Transmitted | :x: Never Transmitted | :x: Never Transmitted |
| **Identity Attributes (Cleartext)** | :white_check_mark: | :white_check_mark: Reads via API | :white_check_mark: Stored in DB | :x: Never stored cleartext |
| **Identity Attribute Hashes (SHA-256)**| :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: Stored on-chain |
| **Selective Disclosure Merkle Roots** | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: Stored on-chain |
| **WebAuthn Challenge Nonce** | :white_check_mark: In-flight | :white_check_mark: Issued (5m TTL)| :white_check_mark: Ephemeral Cache | :x: Cannot Read |

---

## Detailed Component Analysis

### 1. Hardware Secure Enclave (Client)
- **What it holds**: Secp256r1 private key material, biometric biometric templates.
- **Security guarantees**: WebAuthn standards dictate that raw biometric data never leaves device hardware sensors. Private keys cannot be exported via software APIs.

### 2. Client-Side Vault Encryption (Web Crypto API)
- **Where encryption happens**: In the browser using `shared/src/utils/index.ts` (`EncryptionUtils`).
- **Algorithm**: AES-256-GCM with PBKDF2 key derivation (100,000 iterations of SHA-256) and a cryptographically secure random 12-byte IV.
- **Use case**: Local vault export for offline identity backups. The resulting encrypted JSON payload is downloaded directly to user disk and is never sent to the backend.

### 3. Backend Gateway & Storage (Server)
- **Clarification on Previous Documentation**: Previous iterations of the README architecture diagram incorrectly listed *"AES-256 Encryption & PBKDF2 Vault Storage"* under the Backend Gateway. The backend does not run a server-side PBKDF2 vault; rather, it stores identity profile records in MongoDB and validates WebAuthn assertion signatures.
- **Server Visibility**: The backend server receives user-submitted profile attributes (e.g., name, email, credentials) over HTTPS. Therefore, the backend operator/database has visibility into attributes transmitted in plaintext unless encrypted by the client prior to dispatch.

### 4. Smart Contracts on Stellar Soroban (Blockchain)
- **Zero Cleartext Policy**: The `IdentityRegistry` and `SelectiveDisclosure` WASM contracts only ever accept 32-byte cryptographic digests (`BytesN<32>`) representing attribute hashes and Merkle tree roots.
- **Public Visibility**: Anyone can inspect on-chain state to verify whether an attribute hash exists or whether a Merkle inclusion proof matches a registered root, but the underlying attribute preimages remain confidential.

---

## Recommendations & Roadmap for Full End-to-End Encryption (E2EE)

To achieve zero server knowledge for attributes:
1. Client generates a local symmetric key or derives a key from passkey PRF extension (`hmac-secret`).
2. Attributes are encrypted via `EncryptionUtils.encryptData()` before calling `POST /api/identity/:id/attributes`.
3. Backend stores exclusively `{ cipherText, iv, salt, tag }` with zero plaintext attribute storage.
