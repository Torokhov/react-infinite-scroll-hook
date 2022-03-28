import React from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export interface InfiniteScrollProps<TItem> {
  pageStart?: number;
  loadMore: (pageNumber: number) => Promise<TItem[]>;
  hasMore?: boolean;
  treshold?: number;
  loaderComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  renderItem?: (item: TItem) => React.ReactNode;
}

export function InfiniteScroll<TItem>({
  pageStart = 0,
  hasMore = true,
  loadMore,
  treshold = 0,
  renderItem = (item: TItem) => <div>{String(item)}</div>,
  loaderComponent = <div>Загрузка...</div>,
  errorComponent = <div>Произошла ошибка</div>,
}: InfiniteScrollProps<TItem>) {
  const { observedElementRef, loading, error, items } = useInfiniteScroll(
    pageStart,
    hasMore,
    loadMore
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
