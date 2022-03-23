import React from 'react';
import { InfiniteScroll } from './InfiniteScroll';
import axios from 'axios';
import { boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'InfiniteScroll',
  component: InfiniteScroll,
};

interface Picture {
  albumId: string;
  id: number;
  title: string;
  url: 'https://via.placeholder.com/600/8e973b';
  thumbnailUrl: 'https://via.placeholder.com/150/8e973b';
}

export const Default = () => {
  const loadMore = async (pageNum: number) => {
    const result = await axios.get('https://jsonplaceholder.typicode.com/photos', {
      params: {
        albumId: pageNum,
      },
    });
    return result.data;
  };

  const renderItem = (item: Picture) => (
    <figure key={item.id}>
      <img src={item.thumbnailUrl} alt={item.title} />
      <figcaption>{item.title}</figcaption>
    </figure>
  );

  return (
    <div style={{ overflow: 'auto', height: '500px' }}>
      <InfiniteScroll<Picture>
        loadMode={loadMore}
        renderItem={renderItem}
        pageStart={number('pageStart', 1)}
        treshold={number('treshold', 5)}
        hasMore={boolean('hasMore', true)}
      />
    </div>
  );
};
