import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import { CommentList } from '../comment/index';
// import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import type { CommentApiResponse } from '../../types/types';
import { FETCH_SIZE } from '../../constants/constants';
import { fetchData } from '../../data/makeData';

export const InfiniteScrollByIntersectionObserver = () => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CommentApiResponse | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // const { visible, setRef } = useIntersectionObserver();
  const { ref: setRef, inView: visible } = useInView();

  const { data, isLoading, isFetching } = useQuery<CommentApiResponse>({
    queryKey: ['comment-data', page],
    queryFn: async () => {
      const start = (page - 1) * FETCH_SIZE;
      const fetchedData = await fetchData(start, FETCH_SIZE);
      return fetchedData;
    },
  });

  const totalDBRowCount = result?.meta?.totalRowCount ?? 0;
  const totalFetched = result?.data.length ?? 0;

  const loadMore = useCallback(() => {
    setPage((page) => page + 1);
  }, []);

  useEffect(() => {
    if (data) {
      setResult((prev) => ({
        data: [...(prev?.data ?? []), ...data.data],
        meta: { totalRowCount: data.meta.totalRowCount },
      }));
    }
  }, [data]);

  useEffect(() => {
    setHasMore(totalFetched < totalDBRowCount);
  }, [totalFetched, totalDBRowCount]);

  useEffect(() => {
    if (visible && hasMore) {
      loadMore();
    }
  }, [visible, hasMore, loadMore]);

  return (
    <div className="w-96">
      <div className="p-2.5">
        <h1 className="text-xl">intersection observer</h1>
      </div>
      <div className="overflow-auto border border-solid border-gray-500 h-[calc(100vh-90px)]">
        {result && result.data && result.data.length > 0 && (
          <CommentList isLoading={isLoading || isFetching} comments={result.data} setRef={setRef} />
        )}
      </div>
      <div className="p-2.5">
        Fetched <strong>{totalFetched}</strong> of <strong>{totalDBRowCount}</strong> Rows.
      </div>
    </div>
  );
};

export default InfiniteScrollByIntersectionObserver;
