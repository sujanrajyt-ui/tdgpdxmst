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

## Deploy: Vercel frontend + Railway API

Keep the Vercel and Railway deployments separate. The Vercel app is a static Vite SPA; `vercel.json` rewrites app routes to `index.html`. The API stays in `server/index.mjs` and listens on Railway's `PORT`.

**Vercel environment variables** (set for Production, then redeploy):

- `VITE_API_BASE_URL=https://<your-railway-service-domain>`

**Railway service:** use the repository root, install with `npm ci`, start with `npm run api`, and set the health check path to `/api/health`. Add a persistent volume mounted at `/data`, then set:

- `NODE_ENV=production`
- `API_HOST=0.0.0.0`
- `DATA_DIR=/data`
- `APP_ORIGINS=https://<your-vercel-domain>` (comma-separate any other exact allowed origins)
- `COOKIE_SAME_SITE=none` when using separate `vercel.app` and `railway.app` domains
- `ADMIN_WALLETS=<comma-separated-public-admin-wallets>`

The API uses an HttpOnly session cookie and credentialed CORS; do not use `*` for `APP_ORIGINS`. Browser privacy protections can block cross-site cookies on the default Vercel/Railway domains. For the most reliable wallet session, attach frontend and API custom domains under the same parent domain (for example `shop.example.com` and `api.example.com`), allow the frontend origin, and set `COOKIE_SAME_SITE=lax`. SQLite on a Railway volume is suitable for a single API instance; migrate to managed PostgreSQL before scaling horizontally.

The API stores accounts, passports, listings, seller applications, evidence metadata/files, sessions, and admin audit events in `.data/marketplace.sqlite` and `.data/evidence/`. The Vite dev server proxies `/api` to the API. Wallet sign-in uses a one-time server nonce and an EVM signature; signatures do not send transactions. Add public admin wallet addresses to `ADMIN_WALLETS` in the ignored local `.env` file.

The imported marketplace catalog, product pages, passport verification, seller listing flow, My Products, account, and admin review screen use the shared API. During local development only, sample catalog cards appear if the API is unavailable or has no public listings; production does not show those samples. Checkout and payment are intentionally not enabled.

### Backend API

- `GET /api/health`, `POST /api/auth/nonce`, `POST /api/auth/verify`, `POST /api/auth/logout`, `GET /api/me`, and `PATCH /api/me`
- `GET /api/passports`, `GET /api/passports/:id`, and authenticated `POST /api/passports`
- `GET /api/listings` and seller-authenticated `POST /api/listings` (new listings enter admin review)
- `POST /api/seller-applications`, admin-only `GET /api/admin/review-queue`, `PATCH /api/admin/listings/:id`, and `PATCH /api/admin/sellers/:wallet`
- Authenticated private evidence upload/download and admin audit-log endpoints

The local SQLite database is suitable for development on one machine. Before a public launch, move it to a managed PostgreSQL database and private object storage, add migrations and backups, and deploy the API behind HTTPS.

## MST Testnet contracts

The Solidity contracts are included in this repository, but they have **not been deployed**. No marketplace passport, service event, or ownership transfer is currently written to MST. The marketplace saves passport and listing records to the Railway API after wallet sign-in. A wallet connection alone is only sign-in; it does not create an on-chain record.

To deploy the included contracts:

1. Copy `.env.example` to `.env` and set `PRIVATE_KEY` to a testnet-only deployment key. Keep it secret and never add it to a `VITE_*` variable.
2. Fund that account with test MSTC from the MST Testnet faucet.
3. Run `npx hardhat compile` and `npx hardhat run scripts/deploy.ts --network testnet`.
4. After deployment, copy the printed registry addresses into `.env.local` using the `VITE_MST_*` variable names in `.env.example`, then restart Vite.

Until contracts are deployed and their addresses are configured, blockchain actions are unavailable. Listing publication remains subject to the admin review queue.

## Before a public launch

- Add production monitoring, a user-facing support/contact path, and final browser checks against the deployed Vercel and Railway domains.
- Configure a real payment provider adapter, signed webhooks, settlements, refunds, cancellations, chargebacks, and disputes. Checkout is intentionally disabled until an adapter is implemented.
- Add an on-chain event indexer and reconciliation worker after deploying and configuring the registry contracts.
- Complete and review the two-party on-chain ownership transfer workflow. The current UI's one-step transfer is local demo behavior and is blocked from claiming an on-chain ownership transfer.
- Replace local SQLite/files with managed PostgreSQL and private object storage; configure backups, monitoring, rate limits, abuse reporting, and data-retention procedures.
- Review and secure the contracts before mainnet use. Some on-chain registry write methods still lack issuer/admin access controls.
- Validate deployed contract addresses and source code on the explorer; define admin-key rotation, incident response, and recovery procedures.

This repository includes the imported marketplace UI and an API foundation. Checkout, event indexing, and deployed contracts are not yet production-ready.
