import { useEffect, useRef, useState } from "react";
import closedLaptop from "@/assets/relore/hero-laptop-closed.jpg";
import openLaptop from "@/assets/relore/hero-laptop-open.jpg";
import type { Product } from "@/lib/relore-market-data";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
/** Normalised progress of `p` inside [a, b]. */
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function Hero({ product }: { product?: Product }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(total > 0 ? clamp(-rect.top / total) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const intro = seg(p, 0, 0.22);
  const open = seg(p, 0.28, 0.6);
  const used = seg(p, 0.33, 0.46);
  const reported = seg(p, 0.46, 0.58);
  const recorded = seg(p, 0.58, 0.7);
  const passport = seg(p, 0.66, 0.82);
  const remembers = seg(p, 0.76, 0.9);
  const next = seg(p, 0.9, 1);

  const laptopScale = 0.92 + seg(p, 0, 0.5) * 0.18 + next * 0.06;
  const laptopY = -intro * 3 - seg(p, 0.75, 1) * 16;
  const laptopX = next * -18;
  const laptopRot = 8 - seg(p, 0.18, 0.6) * 8;
  const passportRows = [
    ["Object", product?.objectId ?? "—"],
    ["Condition", product?.condition ?? "—"],
    ["Owners", product ? String(product.owners).padStart(2, "0") : "—"],
    ["Service", product ? String(product.serviceEvents).padStart(2, "0") : "—"],
    ["Passport", product?.passport ?? "—"],
  ];

  return (
    <div ref={wrapRef} className="relative h-[280vh] md:h-[340vh]">
      <section
        aria-label="Relore introduction"
        className="grain sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* Laptop */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate3d(${laptopX}vw, ${laptopY}vh, 0) scale(${laptopScale}) rotateX(${laptopRot}deg)`,
            opacity: 0.35 + seg(p, 0, 0.3) * 0.65,
            filter: `blur(${(1 - seg(p, 0, 0.15)) * 6}px)`,
            transformStyle: "preserve-3d",
            perspective: "1200px",
          }}
        >
          <div className="relative w-[min(92vw,1100px)]">
            <img
              src={closedLaptop}
              alt="A closed laptop in a dark studio"
              width={1536}
              height={1024}
              className="w-full"
              style={{ opacity: 1 - open }}
            />
            <img
              src={openLaptop}
              alt=""
              aria-hidden="true"
              width={1536}
              height={1024}
              loading="eager"
              className="absolute inset-0 w-full"
              style={{
                opacity: open,
                clipPath: `inset(${(1 - open) * 46}% 0% 0% 0%)`,
              }}
            />
          </div>
        </div>

        {/* Opening headline */}
        <div
          className="relative z-10 px-5 text-center"
          style={{ opacity: 1 - seg(p, 0.12, 0.28) }}
        >
          <h1 className="editorial text-[14vw] leading-[0.85] text-foreground sm:text-[9vw]">
            <span
              className="block"
              style={{ transform: `translateY(${-intro * 22}vh) translateX(${-intro * 4}vw)` }}
            >
              Every object
            </span>
            <span
              className="block"
              style={{ transform: `translateY(${intro * 14}vh) translateX(${intro * 5}vw)` }}
            >
              has a story.
            </span>
          </h1>
          <p className="meta mt-8" style={{ opacity: 1 - intro }}>
            Used · Verified · Documented
          </p>
        </div>

        {/* Word sequence */}
        <BigWord label="Used" enter={used} exit={reported} />
        <BigWord label="Verified" enter={reported} exit={recorded} />
        <BigWord label="Documented" enter={recorded} exit={passport} />

        {/* Passport metadata */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-10 z-20 mx-auto max-w-[1600px] px-5 sm:px-8"
          style={{ opacity: passport * (1 - next) }}
        >
          <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-5">
            {passportRows.map(([k, v], i) => (
              <div
                key={k}
                className="border-t border-border pt-3"
                style={{
                  transform: `translateY(${(1 - seg(p, 0.66 + i * 0.02, 0.84)) * 18}px)`,
                }}
              >
                <div className="meta">{k}</div>
                <div className="font-mono text-sm text-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing headlines */}
        <div
          className="pointer-events-none absolute z-20 px-5 text-center"
          style={{ opacity: remembers * (1 - next) }}
        >
          <h2 className="editorial text-[11vw] leading-[0.88] text-foreground sm:text-[6.5vw]">
            It remembers
            <br />
            where it&apos;s been.
          </h2>
        </div>

        <div
          className="pointer-events-none absolute z-20 px-5 text-center"
          style={{ opacity: next, transform: `translateY(${(1 - next) * 6}vh)` }}
        >
          <h2 className="editorial text-[13vw] leading-[0.88] text-primary sm:text-[7.5vw]">
            Find its
            <br />
            next owner.
          </h2>
        </div>

        <div
          className="meta absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
          style={{ opacity: 1 - seg(p, 0, 0.08) }}
        >
          Scroll to explore ↓
        </div>
      </section>
    </div>
  );
}

function BigWord({ label, enter, exit }: { label: string; enter: number; exit: number }) {
  const on = enter * (1 - exit);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      style={{ opacity: on }}
    >
      <span
        className="editorial text-[22vw] leading-none text-foreground sm:text-[16vw]"
        style={{
          clipPath: `inset(0% ${(1 - enter) * 100}% 0% 0%)`,
          transform: `translateY(${(1 - enter) * 4}vh) scale(${0.96 + enter * 0.06})`,
          mixBlendMode: "difference",
        }}
      >
        {label}
      </span>
    </div>
  );
}
