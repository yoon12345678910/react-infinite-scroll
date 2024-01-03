import { useCallback, useMemo, useEffect } from 'react';
import { CellMeasurerCache, CellMeasurer, InfiniteLoader, AutoSizer, List, ListRowRenderer } from 'react-virtualized';

import { Comment } from '../comment/index';
import { useFetchMockData, usePrevious } from '../../hooks/index';

export const Windowing = () => {
  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
      }),
    [],
  );
  const { flatData, totalDBRowCount, totalFetched, hasMore, isFetching, fetchNextPage } = useFetchMockData({
    queryKey: ['windowing'],
  });

  const previousDataLength = usePrevious(flatData.length);

  const rowCount = flatData.length + (hasMore ? 1 : 0);

  // 사용자가 목록의 맨 아래에서 {n}개 항목을 스크롤한 후 더 많은 데이터를 가져옵니다
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

  useEffect(() => {
    if (previousDataLength && flatData.length !== previousDataLength) {
      cache.clear(previousDataLength, 0);
    }
  }, [flatData.length]);

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
