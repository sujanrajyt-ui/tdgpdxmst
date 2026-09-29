import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  brands,
  categories,
  conditions,
  formatPrice,
  type Condition,
  type Product,
} from "@/lib/relore-market-data";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Bits";

type Sort = "Newest" | "Price · low to high" | "Price · high to low";
const sorts: Sort[] = ["Newest", "Price · low to high", "Price · high to low"];

export function Marketplace({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [maxPrice, setMaxPrice] = useState(160000);
  const [sort, setSort] = useState<Sort>("Newest");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);
  const categoryOptions = products.length ? Array.from(new Set(products.map((p) => p.category))) : categories;
  const brandOptions = products.length ? Array.from(new Set(products.map((p) => p.brand))) : brands;

  useEffect(() => {
    const handler = (e: Event) => setQuery((e as CustomEvent<string>).detail);
    window.addEventListener("relore:search", handler);
    return () => window.removeEventListener("relore:search", handler);
  }, []);

  const list = useMemo(() => {
    const out = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!brand || p.brand === brand) &&
        (!condition || p.condition === condition) &&
        p.price <= maxPrice &&
        (query.trim() === "" ||
          `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "Price · low to high") return [...out].sort((a, b) => a.price - b.price);
    if (sort === "Price · high to low") return [...out].sort((a, b) => b.price - a.price);
    return out;
  }, [category, brand, condition, maxPrice, sort, query]);

  const active: { label: string; clear: () => void }[] = [];
  if (category) active.push({ label: `Category: ${category}`, clear: () => setCategory(null) });
  if (brand) active.push({ label: `Brand: ${brand}`, clear: () => setBrand(null) });
  if (condition) active.push({ label: `Condition: ${condition}`, clear: () => setCondition(null) });
  if (maxPrice < 160000)
    active.push({ label: `Under ${formatPrice(maxPrice)}`, clear: () => setMaxPrice(160000) });

  const clearAll = () => {
    setCategory(null);
    setBrand(null);
    setCondition(null);
    setMaxPrice(160000);
  };

  const filterPanel = (
    <div className="space-y-8">
      <FilterGroup
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={(v) => setCategory(v)}
      />
      <FilterGroup label="Brand" options={brandOptions} value={brand} onChange={(v) => setBrand(v)} />
      <FilterGroup
        label="Condition"
        options={conditions}
        value={condition}
        onChange={(v) => setCondition(v as Condition | null)}
      />
      <div>
        <label htmlFor="price" className="meta">
          Price · up to {formatPrice(maxPrice)}
        </label>
        <input
          id="price"
          type="range"
          min={20000}
          max={160000}
          step={2000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-primary"
        />
      </div>
      <div>
        <span className="meta">Sort</span>
        <div className="mt-3 space-y-2">
          {sorts.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              className={`meta block w-full text-left cine transition-colors duration-300 ${
                sort === s ? "text-primary" : "hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="marketplace" className="mx-auto max-w-[1600px] px-5 pt-24 sm:px-8">
      <Reveal>
        <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="editorial text-[11vw] leading-[0.88] text-foreground sm:text-[5.5vw]">
              Object library
            </h2>
            <p className="meta mt-5 max-w-xs leading-relaxed">
              Second-hand objects.
              <br />
              Documented for their next owner.
            </p>
          </div>
          <div className="meta">{list.length} objects</div>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="meta mb-6 text-foreground">Filters</div>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="meta border border-border px-4 py-2 text-foreground lg:hidden"
            >
              Filters
            </button>
            {active.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.clear}
                className="meta inline-flex items-center gap-2 border border-border px-3 py-1.5 text-foreground cine transition-colors duration-300 hover:border-primary"
              >
                {a.label} <X className="size-3" />
              </button>
            ))}
            {active.length > 0 && (
              <button type="button" onClick={clearAll} className="meta text-primary underline">
                Clear all
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="border border-border px-8 py-24 text-center">
              <h3 className="editorial text-4xl text-foreground">No objects found.</h3>
              <p className="meta mx-auto mt-5 max-w-xs leading-relaxed">
                Try removing a filter or expanding your search.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="meta mt-8 border border-primary px-5 py-2.5 text-primary cine transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-3">
              {list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto border-t border-border bg-surface px-5 pt-6 pb-10">
            <div className="mb-6 flex items-center justify-between">
              <span className="meta text-foreground">Filters</span>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="meta mt-10 w-full bg-primary py-3 text-primary-foreground"
            >
              Show {list.length} objects
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div>
      <span className="meta">{label}</span>
      <div className="mt-3 space-y-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? null : o)}
            className={`meta block w-full text-left cine transition-colors duration-300 ${
              value === o ? "text-primary" : "hover:text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
