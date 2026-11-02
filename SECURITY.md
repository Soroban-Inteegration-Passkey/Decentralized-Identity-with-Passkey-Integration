# Security Policy

The Decentralized Identity with Passkey Integration team takes the security of our decentralized identity protocol, smart contracts, cryptographic primitives, and user data with paramount importance.

## Supported Versions

We release security patches and stability updates for the following versions:

| Component | Version | Supported |
| :--- | :--- | :--- |
| Soroban Smart Contracts | `0.1.x` | :white_check_mark: |
| Backend API Gateway | `0.1.x` | :white_check_mark: |
| React Frontend | `0.1.x` | :white_check_mark: |
| Shared Cryptographic Core | `0.1.x` | :white_check_mark: |

## Reporting Security Vulnerabilities

**Please do not file public GitHub issues for security vulnerabilities.**

If you discover a security vulnerability, potential private key leak, smart contract exploit, or replay attack vector, report it confidentially using one of the following methods:

1. **GitHub Private Vulnerability Reporting**: Open a draft security advisory via [GitHub Security Advisories](https://github.com/Matrixlabz/-Decentralized-Identity-with-Passkey-Integration/security/advisories/new).
2. **Security Contact Email**: Send detailed findings to `security@matrixlabz.io` (or maintainers via GitHub security inbox).

### What to Include in Your Report

To help us triage and resolve vulnerabilities promptly, please include:
- A clear summary of the issue (e.g., authentication bypass, cryptographic replay, contract state corruption).
- Step-by-step reproduction instructions or a minimal proof-of-concept (PoC) script.
- Affected components: Smart Contracts (`IdentityRegistry`, `SelectiveDisclosure`), Backend API, Frontend, or Shared utilities.
- An assessment of potential impact (e.g., identity impersonation, unauthorized disclosure of attributes).
- Any proposed remediation or patches if available.

### Vulnerability Response SLA

- **Initial Acknowledgment**: Within 48 hours.
- **Triage & Severity Assessment**: Within 5 business days.
- **Resolution & Coordinated Disclosure**: Typically within 30 to 90 days depending on complexity and on-chain deployment status.

---

## Cryptographic & Architectural Security Invariants

1. **Hardware-Isolated Private Keys**:
   - Secp256r1 WebAuthn passkey private keys are generated and stored exclusively within client hardware Secure Enclaves (e.g., Touch ID, Face ID, Windows Hello, YubiKey).
   - Raw private keys are cryptographically non-extractable and are never transmitted over the network or saved in server databases.

2. **Replay Attack Mitigation**:
   - WebAuthn authentication assertions require high-entropy, 32-byte cryptographic challenges issued by the backend with a strict 5-minute Time-To-Live (TTL).
   - Challenges are single-use and invalidated immediately upon validation.

3. **Selective Disclosure & Merkle Commitments**:
   - On-chain identity verification uses SHA-256 Merkle tree commitments and inclusion proofs rather than revealing cleartext claims.
   - Smart contracts store only commitment roots and attribute hashes, ensuring minimal on-chain footprint and privacy preservation.

4. **Emergency Pause Controls**:
   - Smart contracts implement pause guards operable by verified administrators in the event of an anomalous contract state.
