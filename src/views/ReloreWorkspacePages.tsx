import { useState, type FormEvent, type ReactNode } from "react";
import { formatPrice, type Product } from "@/lib/relore-market-data";
import type { ApiUser } from "@/core/api";
import type { MarketplaceListing, ProductCategory, ProductPassport } from "@/types";
import { connectWallet } from "@/core/mst/wallet";
import { MSTAnchorService } from "@/core/mst/anchorService";

type WorkspaceProps = {
  user: ApiUser | null;
  busy: boolean;
  message: string;
  onConnect: () => void;
  onPublish: (draft: ListingDraft) => Promise<void>;
  onSaveName: (name: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  passports: ProductPassport[];
  listings: MarketplaceListing[];
  previewItems: Product[];
};
export type ListingDraft = {
  category: ProductCategory;
  brand: string;
  model: string;
  releaseYear: number;
  identifier: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  location: string;
};

export function ReloreWorkspacePage({ route, ...props }: WorkspaceProps & { route: "my-products" | "sell" | "account" }) {
  return (
    <main className="relore-workspace mx-auto min-h-[70vh] max-w-[1600px] px-5 pt-12 sm:px-8">
      {route === "sell" ? <SellPage {...props} /> : route === "my-products" ? <MyProductsPage {...props} /> : <AccountPage {...props} />}
    </main>
  );
}

function SellPage({ user, busy, message, onConnect, onPublish }: WorkspaceProps) {
  const [category, setCategory] = useState<ProductCategory>("LAPTOP");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [identifier, setIdentifier] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [walletReady, setWalletReady] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connectingWallet, setConnectingWallet] = useState(false);
  const connectBridgeKey = async () => {
    if (!user) return;
    setConnectingWallet(true); setError("");
    try {
      const wallet = await connectWallet();
      if (!wallet.address || !wallet.signer || wallet.chainId !== 91562037) throw new Error("Connect BridgeKey to MST Testnet to continue.");
      if (wallet.address.toLowerCase() !== user.walletAddress.toLowerCase()) throw new Error(`BridgeKey account ${wallet.address} does not match your signed-in account ${user.walletAddress}. Sign in with the connected account.`);
      setWalletAddress(wallet.address);
      setWalletReady(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not connect BridgeKey to MST Testnet."); }
    finally { setConnectingWallet(false); }
  };
  const submitListing = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (!identifier.trim()) { setError("Enter the device serial number or IMEI."); return; }
    try { await onPublish({ category, brand, model, releaseYear, identifier, imageUrl, title: title || (brand + " " + model), description, price, location }); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not submit this listing."); }
  };

  return (
    <section className="mx-auto max-w-3xl pb-24">
      <div className="meta">RELORE · SELLER WORKSPACE</div>
      <h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Sell an object.</h1>
      <p className="meta mt-5 max-w-xl leading-relaxed">Connect BridgeKey to MST Testnet before creating an on-chain passport. Your wallet will ask you to approve each transaction.</p>
      {!user ? <ConnectCard onConnect={onConnect} /> : (
        <form onSubmit={submitListing} className="mt-12 space-y-7 border-t border-border pt-8">
          <h2 className="meta text-foreground">Product details · Seller access is automatic</h2>
          <div className="border border-border bg-surface/50 p-5">
            <p className="meta text-foreground">Step 1 · Connect BridgeKey to MST Testnet</p>
            <p className="meta mt-2 normal-case tracking-normal">The product passport is created only after the correct wallet is connected and confirms the MST transactions.</p>
            <button type="button" disabled={connectingWallet || busy} onClick={() => void connectBridgeKey()} className="meta mt-4 border border-primary px-5 py-3 text-primary disabled:opacity-60">{connectingWallet ? "Connecting…" : walletReady ? `Connected · ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)} · MST Testnet` : "Connect BridgeKey"}</button>
          </div>
          <Field label="Product type"><select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}><option value="LAPTOP">Laptop</option><option value="SMARTPHONE">Phone</option><option value="CAMERA">Camera</option><option value="FURNITURE">Furniture</option><option value="OTHER">Other object</option></select></Field>
          <div className="grid gap-6 sm:grid-cols-2"><Field label="Brand"><input required value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={80} /></Field><Field label="Release year"><input type="number" min="1970" max={new Date().getFullYear() + 1} value={releaseYear} onChange={(e) => setReleaseYear(Number(e.target.value))} required /></Field></div>
          <Field label="Model"><input required value={model} onChange={(e) => setModel(e.target.value)} maxLength={140} /></Field>
          <Field label="Serial number or IMEI"><input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} maxLength={140} /><span className="meta mt-2 block normal-case tracking-normal">The raw identifier is hashed in your browser and only the hash is sent to the API.</span></Field>
          <Field label="Product photo URL"><input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></Field>
          <h2 className="meta border-t border-border pt-8 text-foreground">Listing</h2>
          <Field label="Listing title"><input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder={brand && model ? brand + " " + model : "Product name"} /></Field>
          <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={4000} /></Field>
          <div className="grid gap-6 sm:grid-cols-2"><Field label="Price"><input required type="number" min="0.000001" max="1000000" step="0.000001" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} /></Field><Field label="Location"><input required value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} /></Field></div>
          {error && <p role="alert" className="meta text-unverified">{error}</p>}
          <button disabled={busy || !walletReady} className="meta w-full bg-primary py-5 text-primary-foreground disabled:opacity-60">{busy ? "Publishing…" : !walletReady ? "Connect BridgeKey to continue" : "Create product passport & publish listing"}</button>
        </form>
      )}
      {message && <p role="status" className="meta mt-6">{message}</p>}
      {error && user && <p role="alert" className="meta mt-6 text-unverified">{error}</p>}
    </section>
  );
}

function MyProductsPage({ user, passports, listings, previewItems, onConnect }: WorkspaceProps) {
  if (!user) return <section className="mx-auto max-w-3xl pb-24"><div className="meta">RELORE · YOUR OBJECTS</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">My objects.</h1><ConnectCard onConnect={onConnect} /></section>;
  const passportsById = new Map(passports.map((p) => [p.passportId, p]));
  return (
    <section className="pb-24">
      <div className="meta">RELORE · YOUR OBJECTS</div>
      <h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">My objects.</h1>
      <p className="meta mt-5">Objects and listings linked to {user.walletAddress.slice(0, 6) + "…" + user.walletAddress.slice(-4)}</p>
      {passports.length === 0 && listings.length === 0 ? <div className="mt-12 border-t border-border py-12"><p className="meta">No product passports yet.</p><a href="/sell" className="meta mt-5 inline-block border border-primary px-5 py-3 text-primary">Register an object</a></div> :
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {passports.map((passport) => {
            const listing = listings.find((entry) => entry.passportId === passport.passportId);
            const product = listing ? previewItems.find((p) => p.id === listing.id) : undefined;
            const transactions = [passport.passportTxHash, passport.ownershipTxHash, passport.attestationTxHash, listing?.mstTxHash, listing?.paymentTxHash].filter((hash): hash is string => Boolean(hash));
            return <article key={passport.passportId} className="border-t border-border py-5"><div className="meta">{passport.passportId}</div><h2 className="mt-3 font-display text-xl">{listing?.title || (passport.brand + " " + passport.model)}</h2><p className="meta mt-2">{listing ? listing.status.replace(/_/g, " ") + " · " + formatPrice(listing.price, listing.currency) : "Passport only"}</p>{listing?.buyerWallet && <p className="meta mt-3 break-all">Paid by buyer · {listing.buyerWallet}</p>}<a href={product ? "/product/" + encodeURIComponent(product.id) : "/passport/" + encodeURIComponent(passport.passportId)} className="meta mt-5 inline-block text-primary underline">{product ? "View listing" : "View passport"}</a>{transactions.length ? <div className="mt-5 border-t border-border pt-4"><p className="meta text-foreground">MST Testnet · {transactions.length} confirmed transaction{transactions.length === 1 ? "" : "s"}</p><ul className="mt-3 space-y-2">{transactions.map((hash, index) => <li key={hash}><a className="meta text-primary underline" href={`https://testnet.mstscan.com/tx/${hash}`} target="_blank" rel="noreferrer">Transaction {index + 1} · {hash.slice(0, 10)}…{hash.slice(-6)}</a></li>)}</ul></div> : null}<OwnershipTransferStart passportId={passport.passportId} sellerWallet={user.walletAddress} initialBuyer={listing?.buyerWallet} /></article>;
          })}
        </div>}
    </section>
  );
}

function OwnershipTransferStart({ passportId, sellerWallet, initialBuyer = "" }: { passportId: string; sellerWallet: string; initialBuyer?: string }) {
  const [buyer, setBuyer] = useState(initialBuyer);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const start = async () => {
    setBusy(true); setMessage("");
    try {
      const wallet = await connectWallet();
      if (wallet.address?.toLowerCase() !== sellerWallet.toLowerCase()) throw new Error("Connect the seller wallet that owns this passport.");
      const anchor = await MSTAnchorService.initiateOwnershipTransfer(passportId, buyer.trim());
      setMessage(`Transfer started. Buyer must confirm. ${anchor.transactionHash}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not start transfer."); }
    finally { setBusy(false); }
  };
  return <div className="mt-6 border-t border-border pt-4"><p className="meta text-foreground">Transfer ownership on MST</p><p className="meta mt-2">Enter the buyer’s wallet. They must connect and confirm the transfer on the passport page.</p><input value={buyer} onChange={(event) => setBuyer(event.target.value)} placeholder="Buyer wallet address" className="mt-3 w-full border border-border bg-background px-3 py-3 font-mono text-xs text-foreground"/><button type="button" disabled={busy || !buyer.trim()} onClick={() => void start()} className="meta mt-3 bg-primary px-4 py-3 text-primary-foreground disabled:opacity-50">{busy ? "Waiting for wallet…" : "Start MST transfer"}</button>{message ? <p role="status" className="meta mt-3 break-all">{message}</p> : null}</div>;
}

function AccountPage({ user, onConnect, onSaveName, onSignOut, busy, message }: WorkspaceProps) {
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  if (!user) return <section className="mx-auto max-w-3xl pb-24"><div className="meta">RELORE · ACCOUNT</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Your account.</h1><ConnectCard onConnect={onConnect} /></section>;
  const save = async (event: FormEvent) => { event.preventDefault(); await onSaveName(name); setSaved(true); };
  return <section className="mx-auto max-w-3xl pb-24"><div className="meta">RELORE · ACCOUNT</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Your account.</h1><div className="mt-10 border-t border-border pt-8"><div className="meta">Connected wallet</div><div className="mt-3 break-all font-mono text-sm">{user.walletAddress}</div><div className="meta mt-5">Account status · {user.role} · {user.sellerStatus.replace(/_/g, " ")}</div><form onSubmit={save} className="mt-10 space-y-5"><Field label="Display name"><input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required /></Field><button disabled={busy} className="meta border border-border px-5 py-3 text-foreground disabled:opacity-60">{busy ? "Saving…" : "Save profile"}</button></form>{saved && <p role="status" className="meta mt-4">Profile saved.</p>}{message && <p className="meta mt-4">{message}</p>}<button type="button" onClick={() => void onSignOut()} className="meta mt-10 text-unverified">Sign out</button></div></section>;
}

function ConnectCard({ onConnect }: { onConnect: () => void }) {
  return <div className="mt-12 border-t border-border pt-8"><p className="meta max-w-lg leading-relaxed">Connect BridgeKey on MST Testnet to sign in. You’ll approve the passport transactions in your wallet before the product is created.</p><button type="button" onClick={onConnect} className="meta mt-6 bg-primary px-6 py-4 text-primary-foreground">Connect BridgeKey · MST Testnet</button></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="meta mb-2 block text-foreground">{label}</span>{children}</label>;
}
