# Contributing to Decentralized Identity with Passkey Integration

Thank you for your interest in contributing to the **Decentralized Identity with Passkey Integration** project! We welcome contributions to our Soroban smart contracts, backend API gateway, frontend application, and documentation.

---

## Code of Conduct

We expect all contributors to adhere to courteous, respectful, and inclusive communication. Treat all community members with professional respect.

---

## Development Prerequisites

Before getting started, make sure your development environment has the required tools installed:

1. **Node.js & Package Manager**:
   - Node.js v18.0.0 or higher
   - npm v9.0.0 or higher
2. **Rust & WebAssembly Targets**:
   - Rust toolchain 1.74+ (Rust 1.84+ recommended for modern Stellar CLI support)
   - WebAssembly target:
     ```bash
     # For modern Soroban SDK & Stellar CLI v22+:
     rustup target add wasm32v1-none

     # For legacy Soroban compilation:
     rustup target add wasm32-unknown-unknown
     ```
3. **Stellar CLI**:
   - Install via Cargo or your OS package manager:
     ```bash
     cargo install --locked stellar-cli --features opt
     ```
4. **MongoDB**:
   - Local MongoDB instance or MongoDB Atlas cluster for backend session storage.

---

## Getting Started

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/Matrixlabz/-Decentralized-Identity-with-Passkey-Integration.git
   cd -Decentralized-Identity-with-Passkey-Integration
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Files**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Run Development Servers**:
   ```bash
   npm run dev
   ```

---

## Testing Guidelines

### Smart Contract Tests (Soroban)
All smart contracts must pass unit tests before submitting a PR:
```bash
cd smart-contracts
cargo test -- --nocapture
```

To build the WASM contract binaries:
```bash
stellar contract build
# Or directly with Cargo:
cargo build --target wasm32-unknown-unknown --release
```

### Backend & Frontend Builds
Verify all workspaces compile cleanly:
```bash
npm run build
```

---

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new user-facing or protocol feature
- `fix:` A bug fix
- `docs:` Documentation improvements or corrections
- `refactor:` Code restructuring without functional modifications
- `test:` Adding or updating tests
- `ci:` Continuous integration workflow changes
- `chore:` Maintenance, dependency bumps, or tooling adjustments

---

## Pull Request Process

1. Create a descriptive feature branch from `main` (e.g. `feature/zk-bulletproofs` or `fix/toolchain-target-docs`).
2. Ensure smart contract tests (`cargo test`) and typechecks pass locally.
3. Update documentation (README, API docs, architecture specs) if your changes alter interfaces or cryptographic assumptions.
4. Open a Pull Request referencing relevant issues using the provided PR template.
