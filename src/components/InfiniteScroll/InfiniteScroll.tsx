import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export const InfiniteScroll = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    const sendQuery = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await axios.get('https://jsonplaceholder.typicode.com/photos', {
          params: {
            albumId: pageNum,
          },
        });
        setList([...list, ...res.data]);
        setLoading(false);
      } catch {
        setError(true);
      }
    };
    sendQuery();
  }, [pageNum]);

  const observer = useRef<IntersectionObserver>();
  const lastBookElementRef = useCallback(
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

  return (
    <div>
      <h1>Infinite Scroll</h1>
      <h2>with useRef</h2>
      {list.map((item: any, i: number) => {
        const isLastElement = list.length === i + 1;
        return (
          <div key={item.id} ref={isLastElement ? lastBookElementRef : null}>
            <img src={item.thumbnailUrl} />
          </div>
        );
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  );
};
