import React from 'react';
import { storiesOf } from '@storybook/react';
import { InfiniteScroll } from './InfiniteScroll';

const stories = storiesOf('InfiniteScroll', module);

stories.add('InfiniteScroll', () => <InfiniteScroll />, {
  info: { inline: true },
  text: `

  ### Notes

  Simple example component

  ### Usage
  ~~~js
  <InfiniteScroll />
  ~~~

`,
});
