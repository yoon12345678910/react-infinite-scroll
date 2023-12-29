import { useMemo } from 'react';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import type { CommentApiResponse } from '../types/types';
import { FETCH_SIZE } from '../constants/constants';
import { fetchData } from '../data/makeData';

interface UseFetchMockDataProps {
  queryKey: QueryKey;
}

const useFetchMockData = (props: UseFetchMockDataProps) => {
  const { queryKey } = props;

  const Query = useInfiniteQuery<CommentApiResponse>({
    queryKey,
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

  const { data } = Query;
  const flatData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length ?? 0;
  const hasMore = totalFetched < totalDBRowCount;

  return {
    ...Query,
    flatData,
    totalDBRowCount,
    totalFetched,
    hasMore,
  } as const;
};

export default useFetchMockData;
