# React-infinite-scroll-hook
React hook and component for get data on scroll event

## Hook

```typescript jsx
export function useInfiniteScroll<TItem>(
  pageStart: number,
  hasMore: boolean,
  loadMode: (pageNumber: number) => Promise<TItem[]>
): {
  items: TItem[];
  error: boolean;
  loading: boolean;
  observedElementRef: (node: React.ReactNode) => void;
};
```

#### Parameters
`pageStart` - index of first loaded page

`hasMore` - defines the need for subsequent page loading

`loadMore` - page loading function

#### Return values
`items` - list of loaded items

`error` - defines if an error was received while loading

`loading` - defines the loading state

`observedElementRef` - ref on scrollable element
#### Example usage

```typescript jsx
export function InfiniteScroll<TItem>({
  pageStart = 0,
  hasMore = true,
  loadMode,
  treshold = 0,
  renderItem = (item: TItem) => <div>{String(item)}</div>,
  loaderComponent = <div>Загрузка...</div>,
  errorComponent = <div>Произошла ошибка</div>,
}: InfiniteScrollProps<TItem>) {
  const { observedElementRef, loading, error, items } = useInfiniteScroll(
    pageStart,
    hasMore,
    loadMode
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
```

### Component

```typescript jsx
export function InfiniteScroll<TItem>({
  pageStart = 0,
  hasMore = true,
  loadMode,
  treshold = 0,
  renderItem = (item: TItem) => <div>{String(item)}</div>,
  loaderComponent = <div>Загрузка...</div>,
  errorComponent = <div>Произошла ошибка</div>,
}: InfiniteScrollProps<TItem>);
```

#### Props
`pageStart` - index of first loaded page

`hasMore` - defines the need for subsequent page loading

`loadMore` - page loading function

`treshold` - parameter that determines when the next page starts loading. For example, if there are 20 elements on the page, the thrashold is 5. In this case, the loading of the next page will start when we reach the 15th element

`renderItem` - function for list item renderer

`loaderComponent` - loading state component

`errorComponent` - error state component

#### Example usage

```typescript jsx
export const App = () => {
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
```
