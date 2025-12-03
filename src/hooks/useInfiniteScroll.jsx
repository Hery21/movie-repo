// hooks/useInfiniteScroll.js
import { useRef, useCallback } from "react";

export function useInfiniteScroll(hasMore, loading, onLoadMore) {
  const observer = useRef(null);

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  return lastItemRef;
}
