import { useCallback, useEffect, useRef, useState } from 'react';

export function useInfiniteScroll<TItem>(
  pageStart: number,
  hasMore: boolean,
  loadMode: (pageNumber: number) => Promise<TItem[]>
) {
  const [pageNum, setPageNum] = useState<number>(pageStart);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [items, setItems] = useState<TItem[]>([]);

  useEffect(() => {
    const sendQuery = async () => {
      if (hasMore) {
        try {
          setLoading(true);
          setError(false);
          const newItems = await loadMode(pageNum);
          setItems([...items, ...newItems]);
          setLoading(false);
        } catch {
          setError(true);
        }
      }
    };
    sendQuery();
  }, [pageNum, loadMode, hasMore]);

  const observer = useRef<IntersectionObserver>();
  const observedElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNum(pageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, pageNum]
  );

  return { items, error, loading, observedElementRef };
}
