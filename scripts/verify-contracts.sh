#!/usr/bin/env bash
# ==============================================================================
# Smart Contracts Verification Script
# Runs all 10 unit tests for IdentityRegistry and SelectiveDisclosure contracts
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
CONTRACTS_DIR="${ROOT_DIR}/smart-contracts"

echo "======================================================================"
echo "  Stellar Soroban Smart Contracts Test Suite"
echo "======================================================================"

cd "${CONTRACTS_DIR}"

echo "Step 1: Checking Cargo workspace..."
cargo check

echo "Step 2: Running all unit tests..."
cargo test -- --nocapture

echo "Step 3: Checking WebAssembly release build..."
if command -v stellar &> /dev/null; then
    stellar contract build
elif rustup target list | grep -q 'wasm32v1-none (installed)'; then
    cargo build --target wasm32v1-none --release
else
    cargo build --target wasm32-unknown-unknown --release
fi

echo "======================================================================"
echo "  All contract tests and builds verified successfully!"
echo "======================================================================"
