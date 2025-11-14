// src/hooks/useIntersectionObserver.js
/**
 * Intersection Observer hook for lazy loading and infinite scroll
 */
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options = {}) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef(null);
  const [entry, setEntry] = useState(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return [elementRef, entry];
}

export default useIntersectionObserver;
