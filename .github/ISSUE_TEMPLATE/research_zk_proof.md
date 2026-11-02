---
name: Zero-Knowledge Research RFC
about: Scoped research proposal for integrating true zero-knowledge proofs (zk-SNARKs / Bulletproofs)
title: '[RESEARCH] Real ZK Proof Integration on Soroban: '
labels: ['research', 'cryptography', 'smart-contracts']
assignees: ''
---

## Background & Motivation
The current selective disclosure mechanism implements **SHA-256 Merkle tree commitments and inclusion proofs**. While this allows selective disclosure of attributes without disclosing unrelated claims, it is **cryptographic commitment verification**, not a true Zero-Knowledge (ZK) proof system.

To enable true Zero-Knowledge credentials (e.g., proving `age >= 21` or `credit_score > 700` without revealing the exact attribute value or Merkle leaf preimage), a dedicated ZK proof scheme is required.

## Proposed Research Scope
1. **ZK Proof Scheme Evaluation**:
   - [ ] Groth16 / Plonk (requires trusted setup or universal SRS, compact verification)
   - [ ] Bulletproofs / Halo2 (transparent setup, range proofs for numeric claims)
   - [ ] STARKs (transparent, post-quantum, larger proof sizes)
2. **Soroban WASM Execution & Host Functions**:
   - Evaluate CPU instruction and memory budget within Soroban limits.
   - Investigate precompiles or cryptographic host functions on Stellar Protocol (e.g., elliptic curve pairings, `bn254` / `bls12-381`).
3. **Verification Architecture**:
   - Client-side prover (browser WASM / WebAssembly + Web Workers).
   - On-chain Soroban contract verifier module (`contracts/zk_verifier`).

## Deliverables & Milestones
- [ ] Benchmarking report on Soroban WASM compute cost for verifier.
- [ ] Proof-of-Concept range-proof verifier contract on Stellar testnet.
- [ ] Integration specification with W3C Verifiable Credentials.
