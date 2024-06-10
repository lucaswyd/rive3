import { useCallback, useRef, useEffect } from "react";

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

const InfiniteScroll = ({
  loadMore,
  hasMore,
  loading,
  children,
}: InfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  return (
    <div>
      {children}
      <div ref={lastElementRef} />
    </div>
  );
};

export default InfiniteScroll;
