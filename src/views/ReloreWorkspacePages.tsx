import { useState, type FormEvent, type ReactNode } from "react";
import { formatPrice, type Product } from "@/lib/relore-market-data";
import type { ApiUser } from "@/core/api";
import type { MarketplaceListing, ProductCategory, ProductPassport } from "@/types";

type WorkspaceProps = {
  user: ApiUser | null;
  busy: boolean;
  message: string;
  onConnect: () => void;
  onApply: (businessName: string) => Promise<void>;
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

function SellPage({ user, busy, message, onConnect, onApply, onPublish }: WorkspaceProps) {
  const [businessName, setBusinessName] = useState("");
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
  const submitApply = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    try { await onApply(businessName.trim() || "Individual seller"); } catch (e) { setError(e instanceof Error ? e.message : "Could not submit seller application."); }
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
      <p className="meta mt-5 max-w-xl leading-relaxed">Give its next owner the details and history they need to decide with confidence.</p>
      {!user ? <ConnectCard onConnect={onConnect} /> : user.sellerStatus !== "APPROVED" && user.role !== "ADMIN" ? (
        <form onSubmit={submitApply} className="mt-12 space-y-6 border-t border-border pt-8">
          <h2 className="meta text-foreground">Seller application</h2>
          <Field label="Business or seller name"><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Individual seller" maxLength={120} /></Field>
          {user.sellerStatus === "PENDING" ? <p className="meta">Your seller application is waiting for review.</p> : user.sellerStatus === "REJECTED" ? <p className="meta">Your last application was declined. You can submit an updated application.</p> : null}
          {user.sellerStatus !== "PENDING" && <button disabled={busy} className="meta bg-primary px-6 py-4 text-primary-foreground disabled:opacity-60">{busy ? "Submitting…" : "Apply to sell"}</button>}
        </form>
      ) : (
        <form onSubmit={submitListing} className="mt-12 space-y-7 border-t border-border pt-8">
          <h2 className="meta text-foreground">Product details</h2>
          <Field label="Product type"><select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}><option value="LAPTOP">Laptop</option><option value="SMARTPHONE">Phone</option><option value="CAMERA">Camera</option><option value="FURNITURE">Furniture</option><option value="OTHER">Other object</option></select></Field>
          <div className="grid gap-6 sm:grid-cols-2"><Field label="Brand"><input required value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={80} /></Field><Field label="Release year"><input type="number" min="1970" max={new Date().getFullYear() + 1} value={releaseYear} onChange={(e) => setReleaseYear(Number(e.target.value))} required /></Field></div>
          <Field label="Model"><input required value={model} onChange={(e) => setModel(e.target.value)} maxLength={140} /></Field>
          <Field label="Serial number or IMEI"><input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} maxLength={140} /><span className="meta mt-2 block normal-case tracking-normal">The raw identifier is hashed in your browser and only the hash is sent to the API.</span></Field>
          <Field label="Product photo URL"><input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></Field>
          <h2 className="meta border-t border-border pt-8 text-foreground">Listing</h2>
          <Field label="Listing title"><input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder={brand && model ? brand + " " + model : "Product name"} /></Field>
          <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={4000} /></Field>
          <div className="grid gap-6 sm:grid-cols-2"><Field label="Price · INR"><input required type="number" min="1" step="1" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} /></Field><Field label="Location"><input required value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} /></Field></div>
          {error && <p role="alert" className="meta text-unverified">{error}</p>}
          <button disabled={busy} className="meta w-full bg-primary py-5 text-primary-foreground disabled:opacity-60">{busy ? "Submitting for review…" : "Create product passport & submit listing"}</button>
        </form>
      )}
      {message && <p role="status" className="meta mt-6">{message}</p>}
      {error && user && user.sellerStatus !== "APPROVED" && <p role="alert" className="meta mt-6 text-unverified">{error}</p>}
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
            return <article key={passport.passportId} className="border-t border-border py-5"><div className="meta">{passport.passportId}</div><h2 className="mt-3 font-display text-xl">{listing?.title || (passport.brand + " " + passport.model)}</h2><p className="meta mt-2">{listing ? listing.status.replace(/_/g, " ") + " · " + formatPrice(listing.price) : "Passport only"}</p><a href={product ? "/product/" + encodeURIComponent(product.id) : "/passport/" + encodeURIComponent(passport.passportId)} className="meta mt-5 inline-block text-primary underline">{product ? "View listing" : "View passport"}</a></article>;
          })}
        </div>}
    </section>
  );
}

function AccountPage({ user, onConnect, onSaveName, onSignOut, busy, message }: WorkspaceProps) {
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  if (!user) return <section className="mx-auto max-w-3xl pb-24"><div className="meta">RELORE · ACCOUNT</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Your account.</h1><ConnectCard onConnect={onConnect} /></section>;
  const save = async (event: FormEvent) => { event.preventDefault(); await onSaveName(name); setSaved(true); };
  return <section className="mx-auto max-w-3xl pb-24"><div className="meta">RELORE · ACCOUNT</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Your account.</h1><div className="mt-10 border-t border-border pt-8"><div className="meta">Connected wallet</div><div className="mt-3 break-all font-mono text-sm">{user.walletAddress}</div><div className="meta mt-5">Account status · {user.role} · {user.sellerStatus.replace(/_/g, " ")}</div><form onSubmit={save} className="mt-10 space-y-5"><Field label="Display name"><input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required /></Field><button disabled={busy} className="meta border border-border px-5 py-3 text-foreground disabled:opacity-60">{busy ? "Saving…" : "Save profile"}</button></form>{saved && <p role="status" className="meta mt-4">Profile saved.</p>}{message && <p className="meta mt-4">{message}</p>}<button type="button" onClick={() => void onSignOut()} className="meta mt-10 text-unverified">Sign out</button></div></section>;
}

function ConnectCard({ onConnect }: { onConnect: () => void }) {
  return <div className="mt-12 border-t border-border pt-8"><p className="meta max-w-lg leading-relaxed">Connect your MST wallet to manage your seller account. Signing in uses a message signature and does not send a blockchain transaction.</p><button type="button" onClick={onConnect} className="meta mt-6 bg-primary px-6 py-4 text-primary-foreground">Connect wallet</button></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="meta mb-2 block text-foreground">{label}</span>{children}</label>;
}
