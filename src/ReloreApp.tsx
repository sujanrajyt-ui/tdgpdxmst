import { useCallback, useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/relore/Hero";
import { Marketplace } from "@/components/relore/Marketplace";
import { Nav } from "@/components/relore/Nav";
import { Footer } from "@/components/relore/Bits";
import { ReloreProductPage, RelorePassportPage } from "@/views/RelorePages";
import { ReloreWorkspacePage, type ListingDraft } from "@/views/ReloreWorkspacePages";
import { formatPrice, products as previewProducts, type Product } from "@/lib/relore-market-data";
import { toReloreProducts } from "@/core/relore-mapping";
import { applyToSell, createListingRecord, createPassportRecord, getAdminReviewQueue, getMyMarketplace, getPublicMarketplace, getWalletSession, reviewListing, reviewSeller, signInWithWallet, signOutFromApi, updateProfile, type AdminReviewQueue, type ApiUser } from "@/core/api";
import type { MarketplaceListing, ProductPassport } from "@/types";
import { connectWallet } from "@/core/mst/wallet";

type Page = { kind: "home" } | { kind: "product" | "passport"; id: string } | { kind: "workspace"; section: "my-products" | "sell" | "account" } | { kind: "admin" } | { kind: "not-found" };

function parsePage(): Page {
  const parts = window.location.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return { kind: "home" };
  if (parts[0] === "product" && parts[1]) return { kind: "product", id: parts[1] };
  if (parts[0] === "passport" && parts[1]) return { kind: "passport", id: parts[1] };
  if (["my-products", "sell", "account"].includes(parts[0])) return { kind: "workspace", section: parts[0] as "my-products" | "sell" | "account" };
  if (parts[0] === "admin") return { kind: "admin" };
  return { kind: "not-found" };
}

const previewCatalog = (): Product[] => previewProducts.map((product) => ({ ...product, passportId: product.passportId || product.objectId, isPreview: true }));

export function ReloreApp() {
  const [page, setPage] = useState<Page>(() => parsePage());
  const [items, setItems] = useState<Product[]>(import.meta.env.DEV ? previewCatalog() : []);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [myPassports, setMyPassports] = useState<ProductPassport[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [queue, setQueue] = useState<AdminReviewQueue | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const refreshCatalog = useCallback(async () => {
    try {
      const result = await getPublicMarketplace();
      const liveItems = toReloreProducts(result);
      setItems([...liveItems, ...previewCatalog()]);
      setLoadError("");
    } catch (error) {
      setItems(previewCatalog());
      setLoadError(error instanceof Error ? error.message : "Marketplace could not load.");
    }
  }, []);

  const refreshPrivate = useCallback(async (activeUser: ApiUser | null) => {
    if (!activeUser) return;
    try {
      const result = await getMyMarketplace();
      setMyPassports(result.passports);
      setMyListings(result.listings);
    } catch {
      setMyPassports([]);
      setMyListings([]);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => setPage(parsePage());
    window.addEventListener("popstate", onPopState);
    void refreshCatalog();
    getWalletSession().then((account) => {
      setUser(account);
      if (account) void refreshPrivate(account);
    });
    return () => window.removeEventListener("popstate", onPopState);
  }, [refreshCatalog, refreshPrivate]);

  const itemsByPassport = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of items) if (product.passportId) map.set(product.passportId, product);
    return map;
  }, [items]);

  const pageProduct = page.kind === "product"
    ? items.find((product) => product.id === page.id || product.passportId === page.id)
    : page.kind === "passport"
      ? itemsByPassport.get(page.id) || items.find((product) => product.id === page.id)
      : undefined;

  const connect = async () => {
    setBusy(true); setActionMessage("");
    try {
      const wallet = await connectWallet();
      if (!wallet.address || !wallet.signer) throw new Error("The connected wallet did not provide a signing account.");
      const account = await signInWithWallet(wallet.address, wallet.signer);
      setUser(account);
      await refreshPrivate(account);
      setActionMessage("Wallet connected. This sign-in did not send a blockchain transaction.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitApplication = async (businessName: string) => {
    setBusy(true); setActionMessage("");
    try {
      await applyToSell(businessName);
      const account = await getWalletSession();
      setUser(account);
      setActionMessage("Application submitted for admin review.");
    } finally { setBusy(false); }
  };

  const publish = async (draft: ListingDraft) => {
    if (!user) throw new Error("Connect and sign in with your MST wallet first.");
    setBusy(true); setActionMessage("");
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(draft.identifier.trim().toUpperCase()));
      const identifierHash = "0x" + Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      const passport = await createPassportRecord({
        passportId: "",
        category: draft.category,
        brand: draft.brand,
        model: draft.model,
        releaseYear: draft.releaseYear,
        imageUrl: draft.imageUrl,
        identifierHash,
      });
      const listing = await createListingRecord({
        passportId: passport.passportId,
        title: draft.title,
        description: draft.description,
        price: draft.price,
        location: draft.location,
      });
      setActionMessage("Passport " + passport.passportId + " saved. Listing sent for admin review.");
      await refreshCatalog();
      await refreshPrivate(user);
      setMyPassports((current) => [passport, ...current]);
      setMyListings((current) => [listing, ...current]);
    } finally { setBusy(false); }
  };

  const saveName = async (name: string) => {
    const updated = await updateProfile(name.trim());
    setUser(updated);
  };

  const signOut = async () => {
    await signOutFromApi();
    setUser(null); setMyPassports([]); setMyListings([]);
  };

  useEffect(() => {
    if (page.kind !== "admin" || user?.role !== "ADMIN") return;
    getAdminReviewQueue().then(setQueue).catch((error) => setActionMessage(error instanceof Error ? error.message : "Admin queue unavailable."));
  }, [page, user]);

  const onReviewSeller = async (wallet: string, decision: "APPROVE" | "REJECT") => {
    await reviewSeller(wallet, decision);
    setQueue(await getAdminReviewQueue());
  };
  const onReviewListing = async (id: string, decision: "APPROVE" | "REJECT") => {
    await reviewListing(id, decision);
    setQueue(await getAdminReviewQueue());
    await refreshCatalog();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      {page.kind === "home" ? <main><Hero product={items[0]} />{loadError && import.meta.env.PROD && <p role="status" className="meta mx-auto max-w-[1600px] px-5 pt-5 sm:px-8">Marketplace data is temporarily unavailable.</p>}<Marketplace products={items} /></main>
        : page.kind === "product" && pageProduct ? <ReloreProductPage product={pageProduct} related={items.filter((product) => product.id !== pageProduct.id).slice(0, 3)} />
        : page.kind === "passport" && pageProduct ? <RelorePassportPage product={pageProduct} />
        : page.kind === "workspace" ? <ReloreWorkspacePage route={page.section} user={user} busy={busy} message={actionMessage} onConnect={connect} onApply={submitApplication} onPublish={publish} onSaveName={saveName} onSignOut={signOut} passports={myPassports} listings={myListings} previewItems={items} />
        : page.kind === "admin" ? <AdminPage user={user} queue={queue} onReviewSeller={onReviewSeller} onReviewListing={onReviewListing} onConnect={connect} />
        : <NotFoundPage />}
      <Footer />
    </div>
  );
}

function AdminPage({ user, queue, onReviewSeller, onReviewListing, onConnect }: { user: ApiUser | null; queue: AdminReviewQueue | null; onReviewSeller: (wallet: string, decision: "APPROVE" | "REJECT") => Promise<void>; onReviewListing: (id: string, decision: "APPROVE" | "REJECT") => Promise<void>; onConnect: () => void }) {
  if (!user || user.role !== "ADMIN") return <main className="mx-auto min-h-[70vh] max-w-[1600px] px-5 pt-12 sm:px-8"><div className="meta">RELORE · ADMIN</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Review queue.</h1><p className="meta mt-5">Sign in with an authorized admin wallet to review seller applications and listings.</p><button onClick={onConnect} className="meta mt-6 bg-primary px-6 py-4 text-primary-foreground">Connect admin wallet</button></main>;
  return <main className="mx-auto min-h-[70vh] max-w-[1600px] px-5 pt-12 sm:px-8"><div className="meta">RELORE · ADMIN</div><h1 className="editorial mt-4 text-5xl text-foreground sm:text-7xl">Review queue.</h1><section className="mt-12"><h2 className="meta border-b border-border pb-4 text-foreground">Seller applications</h2>{queue?.sellerApplications.length ? queue.sellerApplications.map((seller) => <div key={seller.wallet_address} className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5"><div><div className="font-display">{seller.business_name}</div><div className="meta mt-2 break-all">{seller.wallet_address}</div></div><div className="flex gap-3"><button onClick={() => void onReviewSeller(seller.wallet_address, "APPROVE")} className="meta text-primary">Approve</button><button onClick={() => void onReviewSeller(seller.wallet_address, "REJECT")} className="meta text-unverified">Reject</button></div></div>) : <p className="meta py-6">No pending seller applications.</p>}</section><section className="mt-12"><h2 className="meta border-b border-border pb-4 text-foreground">Listings</h2>{queue?.listings.length ? queue.listings.map((listing) => <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5"><div><div className="font-display">{listing.title}</div><div className="meta mt-2">{listing.passportId} · {formatPrice(listing.price)} · {listing.location}</div></div><div className="flex gap-3"><button onClick={() => void onReviewListing(listing.id, "APPROVE")} className="meta text-primary">Approve</button><button onClick={() => void onReviewListing(listing.id, "REJECT")} className="meta text-unverified">Reject</button></div></div>) : <p className="meta py-6">No pending listings.</p>}</section></main>;
}

function NotFoundPage() {
  return <main className="mx-auto flex min-h-[70vh] max-w-[1600px] items-center justify-center px-5 text-center"><div><h1 className="editorial text-5xl text-foreground">Object not found.</h1><a href="/" className="meta mt-6 inline-block text-primary underline">Back to marketplace</a></div></main>;
}
