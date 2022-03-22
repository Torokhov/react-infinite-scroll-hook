import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface Props<TItem> {
  pageStart?: number;
  loadMode: (pageNumber: number) => Promise<TItem[]>;
  hasMore?: boolean;
  treshold?: number;
  loaderComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  renderItem?: (item: TItem) => React.ReactNode;
}

export function InfiniteScroll<TItem>({
  pageStart = 0,
  hasMore = true,
  loadMode,
  treshold = 0,
  renderItem = (item: TItem) => <div>{String(item)}</div>,
  loaderComponent = <div>Загрузка...</div>,
  errorComponent = <div>Произошла ошибка</div>,
}: Props<TItem>) {
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

  const renderItems = () => {
    const observedElementIndex =
      items.length <= treshold ? items.length - 1 : items.length - 1 - treshold;

    return (
      <>
        {items.map((item: TItem, i: number) => (
          <div key={i} ref={i === observedElementIndex ? observedElementRef : null}>
            {renderItem(item)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      {renderItems()}
      {loading && loaderComponent}
      {error && errorComponent}
    </div>
  );
}
