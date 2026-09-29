# Product Passport Marketplace

Marketplace UI for buying and selling second-hand products with product passports, ownership history, and service records.

## Run locally

Use Node.js 24 or newer for the built-in SQLite backend. Install dependencies once, then run the API and UI in separate terminals:

```bash
npm install
```

```bash
npm run api
```

```bash
npm run dev
```

## Deploy: Vercel full stack

The Vite frontend and Node.js API functions deploy from one Vercel project. `api/[...path].mjs` serves `/api/*`; `vercel.json` rewrites app routes to `index.html`. Production data uses Postgres through Neon, connected from the Vercel Marketplace. Do not use the local SQLite file for deployed data.

1. Import this GitHub repository as a Vercel project and keep the root directory at the repository root.
2. Add the Neon Postgres integration from Vercel Marketplace. It supplies `DATABASE_URL` to the project.
3. Set `ADMIN_WALLETS` to comma-separated public wallet addresses allowed to administer the marketplace. Keep private keys out of `VITE_*` variables.
4. Deploy or redeploy. The API creates its tables on first request. Check `/api/health` for `database: postgres`.

Production calls `/api` on the same origin; no `VITE_API_BASE_URL` is needed. For local development, Vite proxies `/api` to the SQLite API (`npm run api`). Wallet sign-in uses a one-time server nonce and an EVM signature; it does not send a transaction. Evidence uploads are stored in Postgres and limited to 1.5 MB per file on this deployment path.

The imported marketplace catalog, product pages, passport verification, seller listing flow, My Products, account, and admin review screen use the shared API. Clearly labelled demo previews appear alongside API listings so the marketplace is not empty; they are fictional frontend-only samples, cannot be bought, and are never saved as real marketplace records. Checkout and payment are intentionally not enabled.

### Backend API

- `GET /api/health`, `POST /api/auth/nonce`, `POST /api/auth/verify`, `POST /api/auth/logout`, `GET /api/me`, and `PATCH /api/me`
- `GET /api/passports`, `GET /api/passports/:id`, and authenticated `POST /api/passports`
- `GET /api/listings` and seller-authenticated `POST /api/listings` (new listings enter admin review)
- `POST /api/seller-applications`, admin-only `GET /api/admin/review-queue`, `PATCH /api/admin/listings/:id`, and `PATCH /api/admin/sellers/:wallet`
- Authenticated private evidence upload/download and admin audit-log endpoints

The local SQLite database is suitable for development on one machine. The Vercel API uses managed Postgres; configure backups and monitoring before a public launch.

## MST Testnet contracts

The five registry contracts are already deployed on MST Testnet and their addresses are configured as public frontend defaults. New product registration asks the connected wallet to submit passport, initial ownership, and seller-reported attestation transactions. Listing submission also logs a lifecycle event. Confirmed transaction hashes are saved with the passport/listing and linked to MSTScan. tMSTC pays only testnet gas; checkout payments remain disabled.

To redeploy the included contracts in a new environment:

1. Copy `.env.example` to `.env` and set `PRIVATE_KEY` to a testnet-only deployment key. Keep it secret and never add it to a `VITE_*` variable.
2. Fund that account with test MSTC from the MST Testnet faucet.
3. Run `npx hardhat compile` and `npx hardhat run scripts/deploy.ts --network testnet`.
4. After deployment, copy the printed registry addresses into `.env.local` using the `VITE_MST_*` variable names in `.env.example`, then restart Vite.

On-chain writes require a BridgeKey or other EVM wallet connected to MST Testnet with enough tMSTC for gas. Listing publication remains subject to the admin review queue.

## Before a public launch

- Add production monitoring, a user-facing support/contact path, and final browser checks against the deployed Vercel domain.
- Configure a real payment provider adapter, signed webhooks, settlements, refunds, cancellations, chargebacks, and disputes. Checkout is intentionally disabled until an adapter is implemented.
- Add an on-chain event indexer and reconciliation worker after deploying and configuring the registry contracts.
- Complete and review the two-party on-chain ownership transfer workflow. The current UI's one-step transfer is local demo behavior and is blocked from claiming an on-chain ownership transfer.
- Replace local SQLite/files with managed PostgreSQL and private object storage; configure backups, monitoring, rate limits, abuse reporting, and data-retention procedures.
- Review and secure the contracts before mainnet use. Some on-chain registry write methods still lack issuer/admin access controls.
- Complete the buyer-confirmed ownership transfer screen and validate contract addresses and source on MSTScan; define admin-key rotation, incident response, and recovery procedures.

This repository includes the imported marketplace UI and an API foundation. Checkout, event indexing, and deployed contracts are not yet production-ready.
