'use client';

// Hook personalizado para Infinite Scroll
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  loadMore: () => Promise<void> | void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isLoading,
  loadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isLoading &&
        enabled
      ) {
        loadMore();
      }
    },
    [hasNextPage, isLoading, loadMore, enabled]
  );

  useEffect(() => {
    const currentRef = loadingRef.current;
    
    if (!currentRef || !enabled) return;

    // Crear observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Observar el elemento
    observerRef.current.observe(currentRef);

    // Cleanup
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return {
    loadingRef,
    isObserving: !!observerRef.current
  };
}; 