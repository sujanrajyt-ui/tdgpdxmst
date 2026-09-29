import React, { useEffect, useRef, type ReactNode } from 'react';
import { loadScrollTrigger } from '../core/gsap';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    distance?: number;
}

/** Small, reduced-motion-aware entrance reveal for sections and listing cards. */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className, delay = 0, distance = 26 }) => {
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = element.current;
        if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let cancelled = false;
        let revert: (() => void) | undefined;

        void loadScrollTrigger().then(({ gsap }) => {
            if (cancelled || !element.current) return;
            const context = gsap.context(() => {
                gsap.fromTo(target,
                    { autoAlpha: 0, y: distance },
                    {
                        autoAlpha: 1,
                        y: 0,
                        delay,
                        duration: 0.75,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: target, start: 'top 88%', once: true },
                    },
                );
            }, target);
            revert = () => context.revert();
        });

        return () => { cancelled = true; revert?.(); };
    }, [delay, distance]);

    return <div ref={element} className={className}>{children}</div>;
};
