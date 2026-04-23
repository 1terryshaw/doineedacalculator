'use client';

import { useRef, useEffect, useState, type ElementType, type ReactNode, type HTMLAttributes } from 'react';

interface FadeInProps extends HTMLAttributes<HTMLElement> {
  delay?: number;
  as?: ElementType;
  children: ReactNode;
}

export default function FadeIn({
  delay = 0,
  as: Component = 'div',
  className = '',
  children,
  ...rest
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const threshold = window.innerHeight * 0.75;
    if (rect.top < threshold && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    setShouldAnimate(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerClass = delay > 0 ? `stagger-${Math.min(Math.ceil(delay / 80), 3)}` : '';

  if (!mounted) {
    return (
      <Component ref={ref} className={className} {...rest}>
        {children}
      </Component>
    );
  }

  if (shouldAnimate) {
    return (
      <Component
        ref={ref}
        className={`${className} ${visible ? `animate-fade-up ${staggerClass}`.trim() : ''}`.trim()}
        style={!visible ? { opacity: 0 } : undefined}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
}
