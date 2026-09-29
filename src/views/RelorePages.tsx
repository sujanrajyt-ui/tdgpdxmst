import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { formatPrice, type Product, type TrustLevel } from "@/lib/relore-market-data";
import { PassportBadge, Reveal, StateBadge, Spec, TrustTag } from "@/components/relore/Bits";

export function ReloreProductPage({ product, related }: { product: Product; related: Product[] }) {
  const [offset, setOffset] = useState(0);
  const [checkoutNote, setCheckoutNote] = useState("");

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
          <div className="meta">{product.objectId}</div>
          <h1 className="editorial mt-3 text-5xl text-foreground sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3"><PassportBadge status={product.passport} /><StateBadge state={product.state} /></div>
          <Spec label="Condition" value={product.condition} />
          <Spec label="Price" value={formatPrice(product.price)} />
          <Spec label="Seller" value={product.seller + " · seller since " + product.sellerSince} />
          <Spec label="Delivery / Pickup" value={<span className="text-sm font-normal leading-relaxed text-muted-foreground">{product.delivery}<br />{product.pickup}</span>} />
          <button type="button" disabled={product.state !== "Live"} onClick={() => setCheckoutNote("Checkout and payment are not enabled yet.")} className="meta mt-8 w-full bg-primary py-5 text-primary-foreground cine transition-all duration-500 hover:brightness-110 disabled:opacity-50">
            {product.state !== "Live" ? "Unavailable · " + product.state : "Buy now"}
          </button>
          <a href={"/passport/" + encodeURIComponent(product.passportId || product.objectId)} className="meta group mt-3 flex w-full items-center justify-center gap-2 border border-border py-5 text-foreground cine transition-colors duration-500 hover:border-primary hover:text-primary">
            View product passport
            <ArrowRight className="size-3.5 cine transition-transform duration-500 group-hover:translate-x-1.5" />
          </a>
          <p role="status" className="meta mt-6 leading-relaxed">{checkoutNote || "Payment is arranged directly with the seller. RELORE records the passport transfer."}</p>
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
          {related.map((item) => <a key={item.id} href={"/product/" + encodeURIComponent(item.id)} className="group block"><div className="overflow-hidden bg-surface"><img src={item.image} alt={item.name} loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover cine transition-transform duration-[900ms] group-hover:scale-[1.04]" /></div><div className="mt-4 flex items-baseline justify-between gap-3"><span className="font-display tracking-tight">{item.name}</span><span className="meta">{formatPrice(item.price)}</span></div></a>)}
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
      <p className="meta mt-6 max-w-xl leading-relaxed">RELORE marks a record as verified only when it was checked against a document or transfer recorded on the platform. Everything else is labelled seller-provided or not verified.</p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="meta border-b border-border pb-4 text-foreground">{title}</h2><div className="mt-5 text-sm leading-relaxed text-muted-foreground">{children}</div></section>;
}
