import { ArrowRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/relore-market-data";
import { PassportBadge } from "./Bits";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group relative block cine transition-colors duration-500 hover:bg-surface/60 focus-visible:bg-surface/60"
    >
      <div className="relative overflow-hidden bg-surface">
        {product.isPreview && <span className="meta absolute left-3 top-3 z-10 bg-background/90 px-3 py-2 text-foreground">Demo · not for sale</span>}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1280}
          className="aspect-[4/5] w-full object-cover cine transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>

      <div className="px-1 pt-5 pb-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-base font-medium tracking-tight text-foreground cine transition-transform duration-500 group-hover:-translate-y-[3px] sm:text-lg">
            {product.name}
          </h3>
          <div className="font-display text-base tracking-tight text-foreground sm:text-lg">
            {formatPrice(product.price, product.currency)}
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="meta">{product.condition}</span>
          <span className="meta">Seller · {product.seller}</span>
        </div>

        <div className="mt-4">
          <PassportBadge status={product.passport} />
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
          <span className="meta text-foreground">View product</span>
          <ArrowRight className="size-3.5 text-foreground cine transition-transform duration-500 group-hover:translate-x-1.5" />
          <span className="ml-auto block h-px w-8 bg-border cine transition-all duration-700 group-hover:w-20 group-hover:bg-primary" />
        </div>
      </div>
    </a>
  );
}
