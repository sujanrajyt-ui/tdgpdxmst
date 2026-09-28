# Product Passport 🛡️

### MST-Native Product Identity Network + Trusted Second-Hand Marketplace

> **"Every product has a history. Verify it."**

Product Passport is a persistent physical product identity network built on MST. Today, second-hand commerce primarily trusts the seller. Product Passport changes the trust model: **Trust the product's verifiable history, not just the seller's description.**

---

## 🚀 Key Architectural Principles

1. **Persistent Product Identity**: Every valuable physical product receives a permanent Product Passport ID (`PP-82941`) that survives seller changes, marketplace transfers, resales, refurbishments, and repairs.
2. **MST First Integration**:
   - **ProductPassportRegistry**: Anchor root digital identity and status.
   - **OwnershipRegistry**: Manage cryptographic owner transitions with dual-confirmation escrow.
   - **AttestationRegistry**: Store evidence hashes and verification claims (`IDENTITY_VERIFIED`, `OWNERSHIP_VERIFIED`, `PROFESSIONALLY_INSPECTED`, `MANUFACTURER_VERIFIED`).
   - **ServiceRegistry**: Authorized service centers record verified repairs (battery/screen replacements) directly onto the passport.
   - **LifecycleRegistry**: Immutable historical record of all lifecycle events.
3. **No NFC Requirement**: Physical authentication uses category-specific identifiers (IMEI, Serial Number, Service Tag) + evidence + cryptographically anchored attestations. QR codes serve strictly for navigation convenience (`/passport/PP-XXXXX`).
4. **SARAL Simplified Onboarding**: Seamless Web2-to-Web3 authentication deriving MST DIDs without forcing crypto knowledge, gas fees, or raw keys onto everyday consumers.
5. **WASMify Heavy Verification Bridge**: Off-chain document/signature cryptographic proofs verified inside WebAssembly execution environments and anchored on-chain.
6. **AI Fraud & Risk Engine**: AI assists with listing auto-extraction, visual condition scanning, and fraud anomaly detection (`LOW_RISK`, `REVIEW_REQUIRED`, `HIGH_RISK`). AI never unilaterally certifies authenticity.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / Store**: Node.js / TypeScript simulation engine, async MST transaction anchor queue with auto-retry
- **Blockchain Abstraction**: EVM/MST Smart Contract simulation (`0x8f3A...`), SARAL DID provider, WASMify proof engine
- **Portals**:
  - Landing Page & Identity Explorer
  - User Dashboard (Passports, Listings, Pending Escrow Transfers)
  - Create Passport & AI Listing Assistant
  - Layered Claims Verification Console
  - Public Passport View (`/passport/:id`) with Timeline & Verification Audit
  - Marketplace & Protected Purchase Escrow Flow
  - Authorized Service Center Portal
  - Admin Verification & Stolen Dispute Console
  - MST Block & Anchor Explorer

---

## 🎬 Killer Demo Sequence (Step-by-Step)

1. **Create Passport (`PP-82941`)**: Register a MacBook Air M3 with serial `C02G1928M3XX` and upload invoice evidence.
2. **Ownership Verification**: System executes WASMify proof and anchors identity + ownership attestation on MST `ProductPassportRegistry` and `AttestationRegistry`.
3. **Service Attestation**: Switch to the **Service Center Portal** (`iCare Service Center`) and record a verified OEM battery replacement for `PP-82941`. Anchor on `ServiceRegistry`.
4. **Marketplace Listing**: List the MacBook Air M3 on the marketplace for ₹62,000. Status updates to `FOR_SALE`.
5. **Buyer Discovery**: Switch perspective to Buyer (`Priya Verma`). Inspect the verified Passport history, TechCert 9.8/10 inspection score, and zero stolen flags.
6. **Protected Escrow Purchase**: Initiate purchase. Status changes to `TRANSFER_PENDING` with dual handover verification codes generated.
7. **Dual Handover Confirmation**: Seller and Buyer input handover codes. Executing `OwnershipRegistry.completeTransfer` submits an MST blockchain transaction.
8. **Passport Identity Persistence**: Refresh Passport `PP-82941`. The owner updates from **Arjun Mehta** to **Priya Verma**, while the Passport ID `PP-82941` and complete multi-year service/inspection history remain intact!

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 Final Product Principle

> *The marketplace can change. The seller can change. The owner can change. The product's verified identity and history should not.*
