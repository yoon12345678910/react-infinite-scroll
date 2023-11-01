import React, { useState, useEffect } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  onIntersect?: (entry: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
  setRef: React.Dispatch<React.SetStateAction<T | null>>;
  visible: boolean;
}

const useIntersectionObserver = <T extends HTMLElement>(
  options?: UseIntersectionObserverOptions,
): UseIntersectionObserverReturn<T> => {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false, onIntersect } = options ?? {};

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [ref, setRef] = useState<T | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = ref; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry], observer) => {
      setEntry(entry);
      onIntersect?.([entry], observer);
    }, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen]);

  return { setRef, visible: entry?.isIntersecting ?? false };
};

export default useIntersectionObserver;
