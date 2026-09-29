import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Marketplace" },
  { to: "/my-products", label: "My Products" },
  { to: "/sell", label: "Sell" },
  { to: "/account", label: "Account" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-5 sm:px-8">
        <a
          href="/"
          className="font-display text-lg font-semibold tracking-[0.3em] text-foreground"
        >
          RELORE
        </a>

        <nav className="ml-6 hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="meta cine transition-colors duration-300 hover:text-foreground [&.active]:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <label className="group hidden items-center gap-2 border-b border-border pb-1 sm:flex">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search objects</span>
            <input
              type="search"
              placeholder="SEARCH OBJECTS"
              className="meta w-40 bg-transparent text-foreground outline-none placeholder:text-muted-foreground focus:w-56 cine transition-all duration-500"
              onChange={(e) => {
                const detail = e.currentTarget.value;
                window.dispatchEvent(new CustomEvent("relore:search", { detail }));
              }}
            />
          </label>
          <button
            type="button"
            className="meta md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="meta block border-b border-border px-5 py-4 text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
