import React, { useEffect } from "react";

interface InfiniteScrollProps {
  loadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ loadMore, isLoading, hasMore, children }) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
        hasMore &&
        !isLoading
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore, loadMore]);

  return <>{children}</>;
};

export default InfiniteScroll;
