import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  children: React.ReactNode;
  loading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ loadMore, hasMore, children, loading }) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={lastElementRef} style={{ height: "20px", margin: "10px" }}>
          <span>Carregando...</span>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
