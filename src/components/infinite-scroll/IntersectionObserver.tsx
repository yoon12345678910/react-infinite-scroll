import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import { CommentList } from '../comment/index';
import type { CommentApiResponse } from '../../types/types';
import { FETCH_SIZE } from '../../constants/constants';
import { fetchData } from '../../data/makeData';

export const IntersectionObserver = () => {
  const { ref, inView } = useInView();

  const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery<CommentApiResponse>({
    queryKey: ['intersection-observer'],
    queryFn: async ({ pageParam }) => {
      const start = (pageParam as number) * FETCH_SIZE;
      const fetchedData = await fetchData(start, FETCH_SIZE);
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.length;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length ?? 0;
  const hasMore = totalFetched < totalDBRowCount;

  useEffect(() => {
    if (inView && hasMore) {
      fetchNextPage();
    }
  }, [inView, hasMore, fetchNextPage]);

  return (
    <div className="w-96">
      <div className="p-2.5">
        <h1 className="text-xl">intersection observer</h1>
      </div>
      <div className="overflow-auto border border-solid border-gray-500 h-[calc(100vh-90px)]">
        <CommentList isLoading={isLoading || isFetching} comments={flatData} setRef={ref} />
      </div>
      <div className="p-2.5">
        Fetched <strong>{totalFetched}</strong> of <strong>{totalDBRowCount}</strong> Rows.
      </div>
    </div>
  );
};

export default IntersectionObserver;
