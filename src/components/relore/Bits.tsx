import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ListingState, PassportStatus, TrustLevel } from "@/lib/relore-market-data";

export function PassportBadge({ status }: { status: PassportStatus }) {
  const tone =
    status === "Verified"
      ? "text-verified border-verified/40"
      : status === "Seller-provided"
        ? "text-pending border-pending/40"
        : "text-unverified border-unverified/40";
  return (
    <span className={`meta inline-flex items-center gap-1.5 border px-2 py-1 ${tone}`}>
      {status === "Verified" ? "Passport · Verified ✓" : `Passport · ${status}`}
    </span>
  );
}

export function TrustTag({ level }: { level: TrustLevel }) {
  const map = {
    verified: { label: "Verified information", cls: "text-verified border-verified/40" },
    seller: { label: "Seller-provided", cls: "text-pending border-pending/40" },
    unverified: { label: "Not verified", cls: "text-unverified border-unverified/40" },
  } as const;
  const m = map[level];
  return <span className={`meta inline-block border px-2 py-0.5 ${m.cls}`}>{m.label}</span>;
}

export function StateBadge({ state }: { state: ListingState }) {
  const tone: Record<ListingState, string> = {
    Draft: "text-muted-foreground border-border",
    "Pending review": "text-pending border-pending/40",
    Live: "text-verified border-verified/40",
    Reserved: "text-pending border-pending/40",
    Sold: "text-muted-foreground border-border line-through",
  };
  return <span className={`meta inline-block border px-2 py-1 ${tone[state]}`}>{state}</span>;
}

export function Spec({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-border py-4">
      <div className="meta">{label}</div>
      <div className="mt-1.5 font-display text-lg tracking-tight text-foreground">{value}</div>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`cine transition-[opacity,transform] duration-[900ms] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8">
        <div className="editorial text-[13vw] leading-[0.8] text-foreground sm:text-[9vw]">
          Relore
        </div>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
          <a href="/" className="meta hover:text-foreground">
            Marketplace
          </a>
          <a href="/sell" className="meta hover:text-foreground">
            Sell
          </a>
          <a href="/my-products" className="meta hover:text-foreground">
            My Products
          </a>
          <a href="/account" className="meta hover:text-foreground">
            Account
          </a>
          <span className="meta ml-auto">Buy the object · Know its story</span>
        </div>
      </div>
    </footer>
  );
}
