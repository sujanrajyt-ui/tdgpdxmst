import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { parseEther } from "ethers";
import { formatPrice, type Product, type TrustLevel } from "@/lib/relore-market-data";
import { PassportBadge, Reveal, StateBadge, Spec, TrustTag } from "@/components/relore/Bits";
import { beginTmstcOrder, cancelTmstcOrder, confirmTmstcOrder, signInWithWallet } from "@/core/api";
import { connectWallet } from "@/core/mst/wallet";

export function ReloreProductPage({ product, related }: { product: Product; related: Product[] }) {
  const [offset, setOffset] = useState(0);
  const [checkoutNote, setCheckoutNote] = useState("");
  const [paymentTxHash, setPaymentTxHash] = useState("");
  const [paying, setPaying] = useState(false);

  const buyWithTmstc = async () => {
    let orderId = "";
    let txHash = "";
    setPaying(true);
    setCheckoutNote("");
    try {
      if (!product.sellerWallet) throw new Error("Seller wallet is missing from this listing.");
      if (product.currency !== "TMSTC") throw new Error("This listing is not priced in tMSTC.");
      const wallet = await connectWallet();
      if (!wallet.address || !wallet.signer) throw new Error("Connect your MST Testnet wallet to continue.");
      if (wallet.address.toLowerCase() === product.sellerWallet.toLowerCase()) throw new Error("You cannot buy your own listing.");
      await signInWithWallet(wallet.address, wallet.signer);
      const order = await beginTmstcOrder(product.id);
      orderId = order.id;
      if (order.sellerWallet.toLowerCase() !== product.sellerWallet.toLowerCase()) throw new Error("The listing seller changed. Refresh the page and try again.");
      const tx = await wallet.signer.sendTransaction({ to: order.sellerWallet, value: parseEther(String(order.price)) });
      txHash = tx.hash;
      setPaymentTxHash(tx.hash);
      setCheckoutNote("Payment submitted. Waiting for MST Testnet confirmation…");
      const receipt = await tx.wait();
      if (!receipt || receipt.status !== 1) throw new Error("The payment did not confirm on MST Testnet.");
      await confirmTmstcOrder(order.id, receipt.hash);
      setCheckoutNote("Payment confirmed. The seller must now transfer the product passport to your wallet.");
    } catch (error) {
      if (orderId && !txHash) await cancelTmstcOrder(orderId).catch(() => undefined);
      const message = error instanceof Error ? error.message : "Could not complete the tMSTC payment.";
      setCheckoutNote(txHash
        ? `Transaction submitted (${txHash}), but the app could not finish recording the order. Do not pay again; contact the seller or admin.`
        : message);
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; setOffset(Math.min(80, window.scrollY * 0.06)); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <main className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8">
      <a href="/" className="meta hover:text-foreground">← Object library</a>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div className="overflow-hidden bg-surface">
          <img src={product.image} alt={product.name} width={1024} height={1280} className="w-full object-cover" style={{ transform: "translateY(-" + (offset * 0.25) + "px) scale(1.04)" }} />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="meta">{product.objectId}{product.isPreview ? " · PREVIEW ONLY" : ""}</div>
          <h1 className="editorial mt-3 text-5xl text-foreground sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3"><PassportBadge status={product.passport} /><StateBadge state={product.state} /></div>
          <Spec label="Condition" value={product.condition} />
          <Spec label="Price" value={formatPrice(product.price, product.currency)} />
          <Spec label="Seller" value={product.seller + " · seller since " + product.sellerSince} />
          <Spec label="Delivery / Pickup" value={<span className="text-sm font-normal leading-relaxed text-muted-foreground">{product.delivery}<br />{product.pickup}</span>} />
          {product.state === "Live" && !product.isPreview && <p className="meta mt-8 leading-relaxed">Direct tMSTC payment goes straight to the seller. It has no escrow or on-chain refund protection; transaction gas is separate.</p>}
          <button type="button" disabled={product.state !== "Live" || Boolean(product.isPreview) || paying} onClick={() => void buyWithTmstc()} className="meta mt-4 w-full bg-primary py-5 text-primary-foreground cine transition-all duration-500 hover:brightness-110 disabled:opacity-50">
            {product.isPreview ? "Demo preview · not for sale" : product.state !== "Live" ? "Unavailable · " + product.state : paying ? "Waiting for wallet…" : "Pay " + formatPrice(product.price, product.currency)}
          </button>
          <a href={"/passport/" + encodeURIComponent(product.passportId || product.objectId)} className="meta group mt-3 flex w-full items-center justify-center gap-2 border border-border py-5 text-foreground cine transition-colors duration-500 hover:border-primary hover:text-primary">
            View product passport
            <ArrowRight className="size-3.5 cine transition-transform duration-500 group-hover:translate-x-1.5" />
          </a>
          <p role="status" className="meta mt-6 break-words leading-relaxed">{checkoutNote || (product.isPreview ? "Fictional sample product shown to preview the marketplace. No real device or passport is available." : "Pay directly to the seller using tMSTC on MST Testnet.")}</p>
          {paymentTxHash && <a className="meta mt-3 inline-block text-primary underline" href={`https://testnet.mstscan.com/tx/${paymentTxHash}`} target="_blank" rel="noreferrer">View payment on MSTScan</a>}
        </div>
      </div>
      <div className="mt-28 grid gap-x-16 gap-y-14 md:grid-cols-2">
        <Reveal><Section title="Description"><p>{product.description}</p></Section></Reveal>
        <Reveal delay={80}><Section title="Condition details"><ul className="space-y-2">{product.conditionDetails.map((item) => <li key={item} className="border-b border-border pb-2">{item}</li>)}</ul></Section></Reveal>
        <Reveal><Section title="What's included"><ul className="space-y-2">{(product.included.length ? product.included : ["Not listed"]).map((item) => <li key={item} className="border-b border-border pb-2">{item}</li>)}</ul></Section></Reveal>
        <Reveal delay={80}><Section title="Seller"><p>{product.seller} · seller since {product.sellerSince}</p><p className="mt-2">{product.sellerResponse}</p><p className="mt-2">{product.sellerTransfers} passport transfer{product.sellerTransfers === 1 ? "" : "s"} recorded.</p><p className="meta mt-4">No ratings are shown — RELORE does not collect reviews.</p></Section></Reveal>
        <Reveal><Section title="Delivery / Pickup"><p>{product.delivery}</p><p className="mt-2">{product.pickup}</p></Section></Reveal>
        <Reveal delay={80}><Section title="Passport"><p>Registered {product.firstRegistered} · {product.owners} owners · {product.serviceEvents} service events.</p><a href={"/passport/" + encodeURIComponent(product.passportId || product.objectId)} className="meta mt-4 inline-block text-primary underline">Open the full passport</a></Section></Reveal>
      </div>
      <div className="mt-28">
        <h2 className="editorial text-3xl text-foreground">Other objects</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-3">
          {related.map((item) => <a key={item.id} href={"/product/" + encodeURIComponent(item.id)} className="group block"><div className="overflow-hidden bg-surface"><img src={item.image} alt={item.name} loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover cine transition-transform duration-[900ms] group-hover:scale-[1.04]" /></div><div className="mt-4 flex items-baseline justify-between gap-3"><span className="font-display tracking-tight">{item.name}</span><span className="meta">{formatPrice(item.price, item.currency)}</span></div></a>)}
        </div>
      </div>
    </main>
  );
}

export function RelorePassportPage({ product }: { product: Product }) {
  const rows: Array<[string, string, TrustLevel]> = [
    ["Object ID", product.objectId, "verified" as const],
    ["First registered", product.firstRegistered, "seller" as const],
    ["Current condition", product.condition, "seller" as const],
    ["Owners", String(product.owners).padStart(2, "0"), "verified" as const],
    ["Service events", String(product.serviceEvents).padStart(2, "0"), "seller" as const],
    ["Authenticity", product.passport === "Verified" ? "Verified" : "Not independently verified", product.passport === "Verified" ? "verified" as const : "unverified" as const],
  ];
  return (
    <main className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8">
      <a href={"/product/" + encodeURIComponent(product.id)} className="meta hover:text-foreground">← {product.name}</a>
      <h1 className="editorial mt-8 text-[13vw] leading-[0.88] text-foreground sm:text-[6vw]">Product passport</h1>
      <div className="mt-12 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value, trust], i) => <Reveal key={label} delay={i * 60}><div className="border-t border-border py-6"><div className="meta">{label}</div><div className="mt-2 font-display text-2xl tracking-tight text-foreground">{value}</div><div className="mt-3"><TrustTag level={trust} /></div></div></Reveal>)}
      </div>
      <h2 className="meta mt-24 border-b border-border pb-4 text-foreground">History</h2>
      <ol className="relative mt-10 border-l border-border pl-8">
        {product.timeline.map((event, i) => <Reveal key={event.year + event.label} delay={i * 90}><li className="relative pb-14"><span className="absolute -left-[33px] top-2 size-1.5 rounded-full bg-primary" /><div className="meta">{event.year}</div><div className="mt-1 font-display text-2xl tracking-tight text-foreground">{event.label}</div><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{event.detail}</p><div className="mt-3"><TrustTag level={event.trust} /></div></li></Reveal>)}
      </ol>
      {product.chainTransactions?.length ? <section className="mt-16 border-t border-border pt-8">
        <h2 className="meta text-foreground">MST Testnet transactions</h2>
        <ul className="mt-5 space-y-4">{product.chainTransactions.map((tx) => <li key={tx.hash} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <span className="meta">{tx.label} · confirmed</span>
          <a className="meta text-primary underline" href={`https://testnet.mstscan.com/tx/${tx.hash}`} target="_blank" rel="noreferrer">{tx.hash.slice(0, 12)}…{tx.hash.slice(-8)} · View transaction</a>
        </li>)}</ul>
      </section> : null}
      <p className="meta mt-6 max-w-xl leading-relaxed">RELORE marks a record as verified only when it was checked against a document or transfer recorded on the platform. Everything else is labelled seller-provided or not verified.</p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="meta border-b border-border pb-4 text-foreground">{title}</h2><div className="mt-5 text-sm leading-relaxed text-muted-foreground">{children}</div></section>;
}
