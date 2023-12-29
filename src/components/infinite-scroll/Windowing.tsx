import { useCallback } from 'react';
import { CellMeasurerCache, CellMeasurer, InfiniteLoader, AutoSizer, List, ListRowRenderer } from 'react-virtualized';

import { Comment } from '../comment/index';
import useFetchMockData from '../../hooks/useFetchMockData';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});
export const Windowing = () => {
  const { flatData, totalDBRowCount, totalFetched, hasMore, isFetching, fetchNextPage } = useFetchMockData({
    queryKey: ['windowing'],
  });

  const rowCount = flatData.length + (hasMore ? 1 : 0);

  // once the user has scrolled within {n} items from the bottom of the list, fetch more data if there is any
  const isRowLoaded = ({ index }: { index: number }) => !hasMore || index < flatData.length;

  const loadMore = useCallback(() => {
    return new Promise((resolve) => {
      if (!isFetching && hasMore) {
        resolve(fetchNextPage());
      }
    });
  }, [isFetching, hasMore, fetchNextPage]);

  const rowRenderer: ListRowRenderer = ({ index, key, parent, style }) => {
    const item = isRowLoaded({ index }) ? (
      <Comment comment={flatData[index]} />
    ) : (
      <div className="px-3 pb-3 text-center">Loading...</div>
    );
    return (
      <CellMeasurer cache={cache} key={key} columnIndex={0} rowIndex={index} parent={parent}>
        {({ registerChild }) => (
          <div ref={(_ref) => registerChild?.(_ref as Element)} style={style}>
            {item}
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <div className="w-96">
      <div className="p-2.5">
        <h1 className="text-xl">windowing</h1>
      </div>
      <div className="overflow-hidden border border-solid border-gray-500 h-[calc(100vh-90px)]">
        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMore} rowCount={rowCount} threshold={0}>
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  width={width - 3}
                  height={height}
                  rowHeight={cache.rowHeight}
                  deferredMeasurementCache={cache}
                  rowCount={rowCount}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
      <div className="p-2.5">
        Fetched <strong>{totalFetched}</strong> of <strong>{totalDBRowCount}</strong> Rows.
      </div>
    </div>
  );
};

export default Windowing;
